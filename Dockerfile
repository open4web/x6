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

# ==================== 重点修改：增加详细构建日志 ====================
RUN yarn build --debug 2>&1 | tee build.log || (echo "=== BUILD FAILED ===" && cat build.log && exit 1)

# 可选：同时输出到控制台和文件，方便查看
# RUN yarn build --debug


# ====================== 3. Production ======================
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8000

ENV PORT 8000

CMD ["nginx", "-g", "daemon off;"]