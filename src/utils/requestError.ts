import {playPosSound} from './touchSound';
import {clearDeviceBlocked, isGuardedDevicePath, markDeviceBlocked} from './deviceGuard';
import {clearAuthStorage, readAuthToken} from './authToken';

export type RequestErrorInfo = {
    status: number;
    message: string;
    requestId: string;
    url: string;
    method: string;
    noAccess: boolean;
    seq?: number;
};

export const REQUEST_ERROR_EVENT = 'app-request-error';
export const REQUEST_ERROR_DEDUP_MS = 1600;
export const REQUEST_ERROR_QUIET_MS = 1000;

const SKIP = /\/(signin|signout|otp|login|heartbeat)(\/|$|\?)/i;
const SESSION_DEAD = /expired|invalid token|jwt|登录.*过期|token.*invalid|authorization header/i;

let lastKey = '';
let lastAt = 0;
let errorSeq = 0;
let errorBatch: RequestErrorInfo[] = [];
let dialogOpen = false;
let quietUntil = 0;
let nowImpl = () => Date.now();
let soundCount = 0;

function currentNow() {
    return nowImpl();
}

export function setRequestErrorNowForTests(ts: number | (() => number) | null) {
    if (ts == null) {
        nowImpl = () => Date.now();
        return;
    }
    nowImpl = typeof ts === 'function' ? ts : () => ts;
}

export function getRequestErrorBatch(): RequestErrorInfo[] {
    return errorBatch.slice();
}

export function getRequestErrorSoundCountForTests(): number {
    return soundCount;
}

export function resetRequestErrorQueueForTests() {
    lastKey = '';
    lastAt = 0;
    errorBatch = [];
    dialogOpen = false;
    quietUntil = 0;
    soundCount = 0;
    nowImpl = () => Date.now();
}

export function closeRequestErrorDialog() {
    errorBatch = [];
    dialogOpen = false;
    quietUntil = currentNow() + REQUEST_ERROR_QUIET_MS;
}

function storedAuthToken(): string {
    try {
        return readAuthToken();
    } catch {
        return '';
    }
}

function decodeJwtExp(token: string): number {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return 0;
    }
    try {
        const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
        const json =
            typeof atob === 'function'
                ? atob(padded)
                : (globalThis as any).Buffer.from(padded, 'base64').toString('binary');
        const exp = Number(JSON.parse(json).exp);
        return Number.isFinite(exp) ? exp : 0;
    } catch {
        return 0;
    }
}

/**
 * 登录 token 已过期（JWT exp 到点）。服务端 jwt cookie 与 token 同时到期（24h），
 * 过期后所有接口都是空 body 的 401；localStorage 里的 token 却一直留着。
 */
export function authTokenExpired(nowMs: number = Date.now()): boolean {
    const token = storedAuthToken();
    if (!token) {
        return false;
    }
    const exp = decodeJwtExp(token);
    return exp > 0 && exp * 1000 <= nowMs;
}

/** 有 token 且没过期。过期 token 不算登录态，避免把“登录过期”当成“无权限”。 */
export function hasAuthToken(): boolean {
    return !!storedAuthToken() && !authTokenExpired();
}

/** 只走 JWT 校验、不查菜单权限的接口：它们空 body 401 就是登录态失效。 */
const SESSION_PROBE = /\/v1\/system\/auth\/user\/(prefs|access|application)(\?|$)/;

/** 清掉本地登录态并回到 #/login，不再用 history.back() 离开站点。 */
export function expireSession() {
    if (typeof window === 'undefined') {
        return;
    }
    clearAuthStorage();
    const here = `${window.location.pathname}${window.location.hash}`;
    if (/login/i.test(here)) {
        return;
    }
    window.location.hash = '#/login';
}

function emptyBody(body: any): boolean {
    if (body == null) {
        return true;
    }
    return typeof body === 'string' && !body.trim();
}

function skipUrl(url: string): boolean {
    return SKIP.test(url);
}

const PRINTER_LIST_PATH = /\/device\/pos\/printer(?:\/)?(?:\?|$)/;

function errorText(body: unknown, message?: string): string {
    if (typeof body === 'string') {
        return `${message || ''} ${body}`;
    }
    if (body && typeof body === 'object') {
        const record = body as {title?: unknown; message?: unknown; error?: unknown};
        return `${message || ''} ${record.title || ''} ${record.message || ''} ${record.error || ''}`;
    }
    return message || '';
}

/** 门店未配置打印机，或打印机列表接口明确返回不存在。这类失败用导航提示，不弹错误框。 */
export function isAbsentPrinterError(input: {
    status?: number;
    url?: string;
    body?: unknown;
    message?: string;
}): boolean {
    const url = String(input.url || '');
    if (!PRINTER_LIST_PATH.test(url)) {
        return false;
    }
    const status = Number(input.status) || 0;
    if (status === 404) {
        return true;
    }
    return /打印机不存在|暂无打印机|门店不存在|store not found|printer not found/i.test(
        errorText(input.body, input.message),
    );
}

function readHeader(headers: Headers | undefined, name: string): string {
    if (!headers || typeof headers.get !== 'function') {
        return '';
    }
    return (
        headers.get(name) ||
        headers.get(name.toLowerCase()) ||
        headers.get('X-Request-Id') ||
        headers.get('x-request-id') ||
        ''
    );
}

function messageFromBody(body: any, fallback: string): string {
    if (!body) {
        return fallback;
    }
    if (typeof body === 'string') {
        const text = body.trim();
        if (!text) {
            return fallback;
        }
        try {
            return messageFromBody(JSON.parse(text), text);
        } catch {
            return text.slice(0, 500);
        }
    }
    return String(body.message || body.error || body.msg || body.title || fallback);
}

function requestIdFromBody(body: any): string {
    if (!body || typeof body !== 'object') {
        return '';
    }
    return String(body.request_id || body.requestId || body.req_id || '');
}

function dispatchBatch(latest: RequestErrorInfo, playSound: boolean) {
    if (typeof window === 'undefined') {
        return;
    }
    const detail = Object.assign({}, latest, {items: errorBatch.slice()});
    window.dispatchEvent(new CustomEvent(REQUEST_ERROR_EVENT, {detail}));
    if (!playSound) {
        return;
    }
    soundCount += 1;
    try {
        playPosSound(latest.noAccess ? 'deny' : 'warn');
    } catch {
        /* autoplay */
    }
}

function emit(info: RequestErrorInfo): RequestErrorInfo | null {
    const key = `${info.status}|${info.url}|${info.requestId}|${info.message}`;
    const ts = currentNow();
    if (key === lastKey && ts - lastAt < REQUEST_ERROR_DEDUP_MS) {
        return null;
    }
    if (!dialogOpen && ts < quietUntil) {
        return null;
    }
    lastKey = key;
    lastAt = ts;
    const stamped = {...info, seq: ++errorSeq};
    const opening = !dialogOpen;
    if (opening) {
        dialogOpen = true;
        errorBatch = [stamped];
    } else {
        errorBatch = errorBatch.concat(stamped);
    }
    dispatchBatch(stamped, opening);
    return stamped;
}

export function goBackSafe() {
    if (typeof window === 'undefined') {
        return;
    }
    const here = `${window.location.pathname}${window.location.hash}`;
    if (/login/i.test(here)) {
        return;
    }
    // 只在站内有上一页时后退。history.length 会把新标签页（chrome://new-tab-page）也算进去，
    // 直接 history.back() 会把人带出站点，看起来就是“闪一下变空白页”。
    const idx = Number((window.history.state as any)?.idx);
    if (Number.isFinite(idx) && idx > 0) {
        window.history.back();
        return;
    }
    const hash = window.location.hash || '';
    if (hash.startsWith('#')) {
        if (hash !== '#/' && hash !== '#') {
            window.location.hash = '#/';
        }
        return;
    }
    if (window.location.pathname !== '/') {
        window.location.assign('/');
    }
}

export function formatRequestErrorCopy(info: RequestErrorInfo): string {
    return [
        `错误: ${info.message}`,
        `状态: ${info.status}`,
        `Request-Id: ${info.requestId || '-'}`,
        `接口: ${info.method} ${info.url}`,
    ].join('\n');
}

export function formatRequestErrorBatchCopy(items: RequestErrorInfo[]): string {
    return items.map(formatRequestErrorCopy).join('\n\n');
}

export function requestErrorItemsFromEvent(
    detail: (RequestErrorInfo & {items?: RequestErrorInfo[]}) | null | undefined,
): RequestErrorInfo[] {
    if (!detail) {
        return [];
    }
    if (detail.items && detail.items.length) {
        return detail.items;
    }
    return [detail];
}

export function reportHttpError(input: {
    status: number;
    message?: string;
    requestId?: string;
    url?: string;
    method?: string;
    body?: any;
}) {
    const status = Number(input.status) || 0;
    if (status < 400) {
        return;
    }
    const url = String(input.url || '');
    if (skipUrl(url)) {
        return;
    }
    if (isAbsentPrinterError(input)) {
        return;
    }
    if (status === 403 && (input.body?.error === 'device_not_allowed' || /设备白名单/.test(String(input.body?.message || '')))) {
        markDeviceBlocked();
        return;
    }
    const message = messageFromBody(input.body, input.message || `HTTP ${status}`);
    if (
        status === 401 &&
        storedAuthToken() &&
        (authTokenExpired() || SESSION_DEAD.test(message) || (SESSION_PROBE.test(url) && emptyBody(input.body)))
    ) {
        expireSession();
        return;
    }
    const noAccess = (status === 401 || status === 403) && hasAuthToken() && !SESSION_DEAD.test(message);
    emit({
        status,
        message: noAccess ? (message && message !== 'Unauthorized' && message !== 'Forbidden' ? message : '该页面无访问权限') : message,
        requestId: input.requestId || requestIdFromBody(input.body) || '',
        url,
        method: (input.method || 'GET').toUpperCase(),
        noAccess,
    });
    if (noAccess) {
        window.setTimeout(goBackSafe, 50);
    }
}

export async function reportFetchResponse(res: Response, url: string, method: string) {
    if (!res || res.ok || skipUrl(url)) {
        return;
    }
    let body: any;
    try {
        const clone = res.clone();
        const text = await clone.text();
        body = text;
        try {
            body = JSON.parse(text);
        } catch {
            /* keep text */
        }
    } catch {
        body = undefined;
    }
    reportHttpError({
        status: res.status,
        message: res.statusText,
        requestId: readHeader(res.headers, 'Request-Id'),
        url,
        method,
        body,
    });
}

export function reportXhr(xhr: XMLHttpRequest, url: string, method: string) {
    if (xhr && xhr.status >= 200 && xhr.status < 300 && isGuardedDevicePath(url)) {
        clearDeviceBlocked();
    }
    if (!xhr || xhr.status < 400) {
        return;
    }
    let body: any = xhr.responseText;
    try {
        body = JSON.parse(xhr.responseText);
    } catch {
        /* keep text */
    }
    const requestId =
        xhr.getResponseHeader('Request-Id') ||
        xhr.getResponseHeader('X-Request-Id') ||
        xhr.getResponseHeader('x-request-id') ||
        '';
    reportHttpError({
        status: xhr.status,
        message: xhr.statusText,
        requestId,
        url,
        method,
        body,
    });
}
