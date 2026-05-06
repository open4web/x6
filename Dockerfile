# ====================== 1. Dependencies Stage ======================
FROM node:20-alpine AS deps

# 安装 libc6-compat（Vite 需要）
RUN apk add --no-cache libc6-compat

# === 关键修复：安装 Yarn ===
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY package.json yarn.lock vite.config.ts ./

RUN yarn install --frozen-lockfile --prefer-offline


# ====================== 2. Builder Stage ======================
FROM node:20-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV BASE_PATH admin

RUN yarn build


# ====================== 3. Production Stage (Nginx) ======================
FROM nginx:alpine AS runner

# 复制构建好的静态文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置（如果有）
COPY ./deployment/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]