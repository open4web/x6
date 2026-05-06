# ====================== 1. Dependencies ======================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app
COPY package.json yarn.lock vite.config.ts ./
RUN yarn install --immutable-cache


# ====================== 2. Builder ======================
FROM node:20-alpine AS builder

RUN corepack enable

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV BASE_PATH=admin

RUN yarn build


# ====================== 3. Runner ======================
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# 如果有自定义 nginx 配置
# COPY ./deployment/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]