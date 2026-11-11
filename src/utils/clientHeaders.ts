import {DEVICE_ID_HEADER, readDeviceId} from './deviceId';
import {reportFetchResponse, reportXhr} from './requestError';

// 每个发往本站接口的请求都带上客户端标识、版本号和本机设备号。
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
        if (!headers.has(DEVICE_ID_HEADER)) headers.set(DEVICE_ID_HEADER, readDeviceId());
        return rawFetch(input as any, { ...init, headers }).then((res: Response) => {
            if (res && res.ok === false) {
                void reportFetchResponse(res, url, (init && (init as RequestInit).method) || 'GET');
            }
            return res;
        });
    };

    // XMLHttpRequest（axios）
    const rawOpen = XMLHttpRequest.prototype.open;
    const rawSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (this: any, method: string, url: string | URL, ...rest: any[]) {
        this.__clientHeadersSame = isSameOrigin(String(url));
        this.__clientHeadersUrl = String(url);
        this.__clientHeadersMethod = method;
        return (rawOpen as any).call(this, method, url, ...rest);
    } as any;
    XMLHttpRequest.prototype.send = function (this: any, body?: any) {
        if (this.__clientHeadersSame) {
            try {
                this.setRequestHeader('X-Client-Id', CLIENT_ID);
                this.setRequestHeader('X-Client-Version', CLIENT_VERSION);
                this.setRequestHeader(DEVICE_ID_HEADER, readDeviceId());
            } catch (_) {
                /* 请求状态不对时忽略，不影响业务请求 */
            }
            this.addEventListener('load', function (this: any) {
                reportXhr(this, this.__clientHeadersUrl, this.__clientHeadersMethod);
            });
        }
        return rawSend.call(this, body);
    };
};
