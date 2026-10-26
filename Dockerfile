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

RUN yarn install

COPY . .

ENV BASE_PATH=admin

# B-15: stamp version.json from CI build-args (not the stale checked-in file)
ARG GIT_SHA=unknown
ARG GIT_BRANCH=unknown
ARG APP_VERSION=0.0.0
ARG BUILD_TIME=unknown
RUN short=$(printf '%s' "$GIT_SHA" | cut -c1-7) \
 && printf '{\n  "version": "%s",\n  "gitHash": "%s",\n  "gitBranch": "%s",\n  "buildTime": "%s",\n  "tag": "v%s"\n}\n' \
      "$APP_VERSION" "$short" "$GIT_BRANCH" "$BUILD_TIME" "$APP_VERSION" \
      > public/version.json \
 && echo "stamped public/version.json:" && cat public/version.json

# ==================== 重点修改：增加详细构建日志 ====================
RUN yarn build --debug 2>&1 | tee build.log || (echo "=== BUILD FAILED ===" && cat build.log && exit 1)

# 可选：同时输出到控制台和文件，方便查看
# RUN yarn build --debug


# ====================== 3. Production ======================
FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./deployment/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
