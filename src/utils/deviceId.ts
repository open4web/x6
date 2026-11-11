const STORAGE_KEY = 'x6.device.id';
const PREFIX = 'x6_';
const ID_RE = /^x6_[0-9a-f]{16,64}$/i;

export function isValidDeviceId(id?: string | null): boolean {
    return !!id && ID_RE.test(id);
}

function bytesToHex(bytes: Uint8Array): string {
    let out = '';
    for (let i = 0; i < bytes.length; i += 1) {
        out += bytes[i].toString(16).padStart(2, '0');
    }
    return out;
}

function randomHex(len: number): string {
    const bytes = new Uint8Array(Math.ceil(len / 2));
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(bytes);
    } else {
        for (let i = 0; i < bytes.length; i += 1) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
    }
    return bytesToHex(bytes).slice(0, len);
}

function hardwareHint(): string {
    if (typeof navigator === 'undefined') {
        return '';
    }
    const nav = navigator as Navigator & {userAgentData?: {platform?: string}};
    const platform = nav.userAgentData?.platform || nav.platform || '';
    const screenSize = typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : '';
    return [platform, nav.hardwareConcurrency || '', nav.maxTouchPoints || '', screenSize].join('|');
}

/** Stable POS machine id. Generated once on this browser profile and reused. */
export function createDeviceId(now = Date.now()): string {
    const hw = hardwareHint();
    let mix = now >>> 0;
    for (let i = 0; i < hw.length; i += 1) {
        mix = (Math.imul(mix, 33) + hw.charCodeAt(i)) >>> 0;
    }
    return `${PREFIX}${randomHex(24)}${mix.toString(16).padStart(8, '0')}`;
}

export function readDeviceId(): string {
    if (typeof window === 'undefined') {
        return '';
    }
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (isValidDeviceId(stored)) {
            return stored as string;
        }
        const next = createDeviceId();
        localStorage.setItem(STORAGE_KEY, next);
        return next;
    } catch {
        return createDeviceId();
    }
}

export const DEVICE_ID_HEADER = 'X-Device-ID';
export const DEVICE_STORAGE_KEY = STORAGE_KEY;
