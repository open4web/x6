export const DEVICE_BLOCKED_EVENT = 'x6-device-blocked';
const FLAG = 'x6.device.blocked';

export function isDeviceNotAllowed(payload: any): boolean {
    const data = payload?.error ? payload : payload?.data || payload?.body || payload;
    return data?.error === 'device_not_allowed' || /设备白名单|device_not_allowed/.test(String(data?.message || payload?.message || ''));
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
    try {
        sessionStorage.removeItem(FLAG);
    } catch {
        /* ignore */
    }
}

export function isDeviceBlocked(): boolean {
    try {
        return sessionStorage.getItem(FLAG) === '1';
    } catch {
        return false;
    }
}
