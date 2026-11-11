import {playPosSound} from './touchSound';

export type RequestErrorInfo = {
    status: number;
    message: string;
    requestId: string;
    url: string;
    method: string;
    noAccess: boolean;
};

export const REQUEST_ERROR_EVENT = 'app-request-error';

const SKIP = /\/(signin|signout|otp|login|heartbeat)(\/|$|\?)/i;
const SESSION_DEAD = /expired|invalid token|jwt|登录.*过期|token.*invalid|authorization header/i;

let lastKey = '';
let lastAt = 0;

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

function emit(info: RequestErrorInfo) {
    const key = `${info.status}|${info.url}|${info.requestId}|${info.message}`;
    const now = Date.now();
    if (key === lastKey && now - lastAt < 1600) {
        return;
    }
    lastKey = key;
    lastAt = now;
    if (typeof window === 'undefined') {
        return;
    }
    window.dispatchEvent(new CustomEvent(REQUEST_ERROR_EVENT, {detail: info}));
    try {
        playPosSound(info.noAccess ? 'deny' : 'warn');
    } catch {
        /* autoplay */
    }
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
