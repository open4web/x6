# ====================== 1. Dependencies ======================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install


# ====================== 2. Builder ======================
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY package.json yarn.lock ./
COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV BASE_PATH=admin

# B-15: build first, then stamp dist/version.json so a failed yarn
# cannot leave a stale dist/ from the build context (pipefail).
ARG GIT_SHA=unknown
ARG GIT_BRANCH=unknown
ARG APP_VERSION=0.0.0
ARG BUILD_TIME=unknown
RUN set -euxo pipefail \
 && yarn build --debug 2>&1 | tee build.log \
 && short=$(printf '%s' "$GIT_SHA" | cut -c1-7) \
 && printf '{\n  "version": "%s",\n  "gitHash": "%s",\n  "gitBranch": "%s",\n  "buildTime": "%s",\n  "tag": "v%s"\n}\n' \
      "$APP_VERSION" "$short" "$GIT_BRANCH" "$BUILD_TIME" "$APP_VERSION" \
      > dist/version.json \
 && cp dist/version.json public/version.json \
 && echo "stamped dist/version.json:" && cat dist/version.json

# 可选：同时输出到控制台和文件，方便查看
# RUN yarn build --debug


# ====================== 3. Production ======================
FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./deployment/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
