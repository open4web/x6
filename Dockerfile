# B-15: CI 已 yarn build；镜像只打包 dist，并写入与本次 commit 一致的 version.json。
# 避免在镜像内再跑 yarn（Yarn Berry + 拷贝 node_modules 会报 lockfile 缺失）。
FROM nginx:1.27-alpine

ARG GIT_SHA=unknown
ARG GIT_BRANCH=unknown
ARG APP_VERSION=0.0.0
ARG BUILD_TIME=unknown

COPY dist /usr/share/nginx/html
COPY ./deployment/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

RUN short=$(printf '%s' "$GIT_SHA" | cut -c1-7) \
 && printf '{\n  "version": "%s",\n  "gitHash": "%s",\n  "gitBranch": "%s",\n  "buildTime": "%s",\n  "tag": "v%s"\n}\n' \
      "$APP_VERSION" "$short" "$GIT_BRANCH" "$BUILD_TIME" "$APP_VERSION" \
      > /usr/share/nginx/html/version.json \
 && echo "stamped version.json:" && cat /usr/share/nginx/html/version.json
