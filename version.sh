#!/usr/bin/env bash
# release_and_push.sh
# 用法：
#   chmod +x release_and_push.sh
#   ./release_and_push.sh
#   ./release_and_push.sh "可选的 commit message"

set -euo pipefail

MSG="${1:-chore: release}"

# ---------- 检查 git 仓库 ----------
if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
  echo "错误: 当前目录不是 git 仓库，请在仓库根目录执行"
  exit 1
fi

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "错误: 未找到 origin remote"
  exit 1
fi

# ---------- 读取最新 tag；没有则从 v0.0.1 开始 ----------
LATEST_TAG="$(git tag --list 'v[0-9]*.[0-9]*.[0-9]*' --sort=-v:refname | head -n 1 || true)"

if [[ -z "${LATEST_TAG}" ]]; then
  NEW_TAG="v0.0.1"
  echo "未找到已有 tag，使用初始版本: ${NEW_TAG}"
else
  echo "当前最新 tag: ${LATEST_TAG}"
  VER="${LATEST_TAG#v}"
  IFS='.' read -r MAJOR MINOR PATCH <<< "${VER}"
  if [[ -z "${MAJOR}" || -z "${MINOR}" || -z "${PATCH}" ]]; then
    echo "错误: 无法解析 tag: ${LATEST_TAG}（期望 vX.Y.Z）"
    exit 1
  fi
  PATCH=$((PATCH + 1))
  NEW_TAG="v${MAJOR}.${MINOR}.${PATCH}"
  echo "自增后版本: ${NEW_TAG}"
fi

VERSION="${NEW_TAG#v}"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
BUILD_TIME="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

# ---------- 写入 version.json ----------
mkdir -p public
cat > public/version.json <<EOF
{
  "version": "${VERSION}",
  "gitHash": "pending",
  "gitBranch": "${BRANCH}",
  "buildTime": "${BUILD_TIME}",
  "tag": "${NEW_TAG}"
}
EOF

echo "已写入 public/version.json:"
cat public/version.json
echo

# ---------- 同步 package.json 的 version ----------
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.version = '${VERSION}';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 4) + '\n');
"
echo "已同步 package.json version => ${VERSION}"

# ---------- 提交版本文件 ----------
git add public/version.json package.json
if git diff --cached --quiet; then
  echo "没有需要提交的版本文件变更"
else
  git commit -m "${MSG}: ${NEW_TAG}"
fi

# ---------- 用最新 commit hash 回写 version.json ----------
NEW_HASH="$(git rev-parse --short HEAD)"
BUILD_TIME="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

cat > public/version.json <<EOF
{
  "version": "${VERSION}",
  "gitHash": "${NEW_HASH}",
  "gitBranch": "${BRANCH}",
  "buildTime": "${BUILD_TIME}",
  "tag": "${NEW_TAG}"
}
EOF

git add public/version.json
if ! git diff --cached --quiet; then
  git commit -m "chore: sync version.json for ${NEW_TAG}"
fi

NEW_HASH="$(git rev-parse --short HEAD)"

# ---------- 打 tag 并 push ----------
if git rev-parse "${NEW_TAG}" >/dev/null 2>&1; then
  echo "错误: tag ${NEW_TAG} 已存在"
  exit 1
fi

git tag "${NEW_TAG}"

echo "准备 push: branch (${BRANCH}) + tag (${NEW_TAG})"
git push origin "HEAD:${BRANCH}"
git push origin "${NEW_TAG}"

echo
echo "完成: ${NEW_TAG}"
cat public/version.json