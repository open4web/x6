# ====================== 1. Dependencies ======================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# ❗只复制必要文件
COPY package.json yarn.lock ./

# ❗关键修改（去掉 --immutable-cache）
RUN yarn install --immutable


# ====================== 2. Builder ======================
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV BASE_PATH=admin

RUN yarn build


# ====================== 3. Runner ======================
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]