export const DEVICE_BLOCKED_EVENT = 'x6-device-blocked';
const FLAG = 'x6.device.blocked';

// 这些接口挂了点餐设备白名单。心跳和门店接口没有挂，成功也不能当作已放行。
const GUARDED_PREFIXES = [
    '/v1/hlj/product/pos',
    '/v1/hlj/order/pos',
    '/v1/hlj/order/pad',
    '/v1/pay/scan',
    '/v1/pay/cash',
    '/v1/pay/balance',
    '/v1/pay/lakala',
];

export function isDeviceNotAllowed(payload: any): boolean {
    const data = payload?.error ? payload : payload?.data || payload?.body || payload;
    return data?.error === 'device_not_allowed' || /设备白名单|device_not_allowed/.test(String(data?.message || payload?.message || ''));
}

export function isGuardedDevicePath(path: string): boolean {
    const raw = String(path || '');
    let pathname = raw.split('?')[0];
    try {
        pathname = new URL(raw, 'http://local').pathname;
    } catch {
        /* 相对路径按原样判断 */
    }
    return GUARDED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

// allow：白名单已放行（含业务 4xx）。deny：仍被白名单拒绝。skip：网络或登录失效，保持原状态。
export function guardDecision(status: number, payload: any): 'allow' | 'deny' | 'skip' {
    if (status === 403 && isDeviceNotAllowed(payload)) {
        return 'deny';
    }
    if (status >= 200 && status < 300) {
        return 'allow';
    }
    if (status >= 400 && status < 500 && status !== 401) {
        return 'allow';
    }
    return 'skip';
}

export function markDeviceBlocked() {
    try {
        sessionStorage.setItem(FLAG, '1');
    } catch {
        /* ignore */
    }
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(DEVICE_BLOCKED_EVENT));
    }
}

export function clearDeviceBlocked() {
    const was = isDeviceBlocked();
    try {
        sessionStorage.removeItem(FLAG);
    } catch {
        /* ignore */
    }
    if (was && typeof window !== 'undefined') {
        window.dispatchEvent(new Event(DEVICE_BLOCKED_EVENT));
    }
}

export function isDeviceBlocked(): boolean {
    try {
        return sessionStorage.getItem(FLAG) === '1';
    } catch {
        return false;
    }
}

