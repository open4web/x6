// 审计日志用：每个发往本站接口的请求都带上客户端标识和版本号。
// 仅用于展示和筛选，后端不拿它做鉴权；只给同源请求和本站接口路径(/v1/)加，避免给第三方域名带来跨域预检。
declare const __APP_VERSION__: string;

export const CLIENT_ID = 'x6';
export const CLIENT_VERSION: string =
    typeof __APP_VERSION__ === 'string' && __APP_VERSION__ ? __APP_VERSION__ : 'dev';

const isSameOrigin = (url: string): boolean => {
    try {
        const u = new URL(url, window.location.href);
        return u.origin === window.location.origin || u.pathname.startsWith('/v1/');
    } catch (_) {
        return false;
    }
};

let installed = false;

export const installClientHeaders = (): void => {
    if (installed || typeof window === 'undefined') return;
    installed = true;

    // fetch（react-admin 的 fetchUtils、各页面里直接调的 fetch）
    const rawFetch = window.fetch.bind(window);
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
            typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
        if (!isSameOrigin(url)) return rawFetch(input as any, init);
        const headers = new Headers(
            init?.headers || (typeof input === 'object' && 'headers' in input ? (input as Request).headers : undefined)
        );
        if (!headers.has('X-Client-Id')) headers.set('X-Client-Id', CLIENT_ID);
        if (!headers.has('X-Client-Version')) headers.set('X-Client-Version', CLIENT_VERSION);
        return rawFetch(input as any, { ...init, headers });
    };

    // XMLHttpRequest（axios）
    const rawOpen = XMLHttpRequest.prototype.open;
    const rawSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (this: any, method: string, url: string | URL, ...rest: any[]) {
        this.__clientHeadersSame = isSameOrigin(String(url));
        return (rawOpen as any).call(this, method, url, ...rest);
    } as any;
    XMLHttpRequest.prototype.send = function (this: any, body?: any) {
        if (this.__clientHeadersSame) {
            try {
                this.setRequestHeader('X-Client-Id', CLIENT_ID);
                this.setRequestHeader('X-Client-Version', CLIENT_VERSION);
            } catch (_) {
                /* 请求状态不对时忽略，不影响业务请求 */
            }
        }
        return rawSend.call(this, body);
    };
};
