// 从点餐端源码里抽出实际请求的 /v1 接口，用来对照角色授权是否超出点餐端需要。

const AUTH_API_BASE = '/v1/system/auth';

export function stripComments(source: string): string {
    let out = '';
    let i = 0;
    let state: 'code' | 'sq' | 'dq' | 'tpl' | 'line' | 'block' = 'code';
    while (i < source.length) {
        const c = source[i];
        const n = source[i + 1];
        if (state === 'code') {
            if (c === '/' && n === '/') {
                state = 'line';
                i += 2;
                continue;
            }
            if (c === '/' && n === '*') {
                state = 'block';
                i += 2;
                continue;
            }
            if (c === "'") state = 'sq';
            else if (c === '"') state = 'dq';
            else if (c === '`') state = 'tpl';
            out += c;
            i += 1;
            continue;
        }
        if (state === 'line') {
            if (c === '\n') {
                state = 'code';
                out += c;
            }
            i += 1;
            continue;
        }
        if (state === 'block') {
            if (c === '*' && n === '/') {
                state = 'code';
                i += 2;
                continue;
            }
            if (c === '\n') out += '\n';
            i += 1;
            continue;
        }
        out += c;
        if (c === '\\' && i + 1 < source.length) {
            out += source[i + 1];
            i += 2;
            continue;
        }
        if (state === 'sq' && c === "'") state = 'code';
        else if (state === 'dq' && c === '"') state = 'code';
        else if (state === 'tpl' && c === '`') state = 'code';
        i += 1;
    }
    return out;
}

// 去 query、去掉动态段和 /:_id，得到和权限缓存同一层的 path。
export function canonicalApiPath(raw: string): string {
    let p = String(raw || '').trim();
    if (!p) return '';
    const absolute = p.match(/^https?:\/\/[^/?#]+(\/[^?#]*)/i);
    if (absolute) p = absolute[1];
    const cut = p.search(/[?#]/);
    if (cut >= 0) p = p.slice(0, cut);
    let prev = '';
    while (prev !== p) {
        prev = p;
        p = p.replace(/\$\{[^}]*\}/g, '');
    }
    p = p.replace(/\/+/g, '/');
    if (!p.startsWith('/')) p = `/${p}`;
    let again = '';
    while (again !== p) {
        again = p;
        p = p.replace(/\/:[A-Za-z_][\w]*$/g, '');
    }
    while (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p;
}

function remember(found: Set<string>, raw: string) {
    const path = canonicalApiPath(raw);
    const parts = path.split('/').filter(Boolean);
    // /v1/<命名空间>/<服务>/<资源> 才是一条接口。/v1/ 前缀和 baseURL 不算。
    if (parts.length >= 4 && parts[0] === 'v1') found.add(path);
}

export function extractApiPaths(source: string): string[] {
    const code = stripComments(source);
    const found = new Set<string>();
    const literal = /`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g;
    let match: RegExpExecArray | null;
    while ((match = literal.exec(code))) {
        const body = match[0].slice(1, -1);
        if (body.includes('/v1/')) remember(found, body);
    }
    const authCall = /authApi\s*\.\s*(?:get|post|put|patch|delete)\s*(?:<[^;>]*>)?\s*\(\s*(['"`])(\/[^'"`]+)\1/g;
    while ((match = authCall.exec(code))) {
        const rel = match[2];
        remember(found, rel.startsWith('/v1/') ? rel : `${AUTH_API_BASE}${rel.startsWith('/') ? '' : '/'}${rel}`);
    }
    return Array.from(found).sort();
}

// 角色里的这条 path 在点餐端没有任何调用时，就是超出点餐端要求的授权。
export function grantExceedsX6(grantedPath: string, required: readonly string[]): boolean {
    const path = canonicalApiPath(grantedPath);
    if (!path || path === '/') return false;
    return !required.some((item) => canonicalApiPath(item) === path);
}
