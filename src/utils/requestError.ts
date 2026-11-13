import {playPosSound} from './touchSound';

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

export function hasAuthToken(): boolean {
    try {
        return !!(
            localStorage.getItem('token') ||
            localStorage.getItem('cookie') ||
            localStorage.getItem('accessToken')
        );
    } catch {
        return false;
    }
}

function skipUrl(url: string): boolean {
    return SKIP.test(url);
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
    if (window.history.length > 1) {
        window.history.back();
        return;
    }
    const hash = window.location.hash || '';
    if (hash.startsWith('#')) {
        window.location.hash = '#/';
        return;
    }
    window.location.assign('/');
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
    if (status === 403 && (input.body?.error === 'device_not_allowed')) {
        return;
    }
    const message = messageFromBody(input.body, input.message || `HTTP ${status}`);
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
