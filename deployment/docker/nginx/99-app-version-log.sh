#!/bin/sh
# Read the version.json that nginx will serve, and emit an http-context
# snippet so access logs can include the same version and git hash the UI shows.
set -eu

VERSION_FILE="/usr/share/nginx/html/version.json"
CONF_FILE="/etc/nginx/conf.d/00-app-version-log.conf"

sanitize() {
  printf '%s' "$1" | sed 's/[^A-Za-z0-9._+-]//g'
}

extract_json_string() {
  _key=$1
  _file=$2
  sed -n "s/.*\"${_key}\"[[:space:]]*:[[:space:]]*\"\\([^\"]*\\)\".*/\\1/p" "$_file" | sed -n '1p'
}

version=unknown
git_hash=unknown

if [ -r "$VERSION_FILE" ]; then
  raw_version=$(extract_json_string version "$VERSION_FILE" || true)
  raw_hash=$(extract_json_string gitHash "$VERSION_FILE" || true)
  version=$(sanitize "$raw_version")
  git_hash=$(sanitize "$raw_hash")
  [ -n "$version" ] || version=unknown
  [ -n "$git_hash" ] || git_hash=unknown
fi

cat > "$CONF_FILE" <<EOF
map \$hostname \$app_version { default "${version}"; }
map \$hostname \$git_hash { default "${git_hash}"; }
log_format app_ver '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                   '\$status \$body_bytes_sent "\$http_referer" '
                   '"\$http_user_agent" "\$app_version" "\$git_hash"';
EOF
