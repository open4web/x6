// Device-local shortcut for shift change. Password is NOT stored;
// auth-api issues a 7-day revocable device_token after OTP success.
const STORAGE_KEY = 'pos.login.remember7';
const PENDING_KEY = 'pos.login.pending';
const REMEMBER_FLAG_KEY = 'pos.login.rememberPending';

export const REMEMBER_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type RememberedLogin = {
    phone: string;
    /** Revocable POS device credential from auth-api. Legacy password field ignored. */
    deviceToken: string;
    until: number;
};

export function maskPhone(phone: string): string {
    const digits = phone.trim();
    if (digits.length < 7) return digits;
    return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
}

export function formatRememberUntil(until: number): string {
    return new Date(until).toLocaleString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export function buildRememberedLogin(phone: string, deviceToken: string, now = Date.now(), until?: number): RememberedLogin | null {
    const nextPhone = phone.trim();
    if (!nextPhone || !deviceToken) return null;
    return {
        phone: nextPhone,
        deviceToken,
        until: typeof until === 'number' && Number.isFinite(until) ? until : now + REMEMBER_TTL_MS,
    };
}

export function parseRememberedLogin(raw: string | null, now = Date.now()): RememberedLogin | null {
    if (!raw) return null;
    try {
        const data = JSON.parse(raw) as Partial<RememberedLogin> & {password?: string};
        if (typeof data.phone !== 'string' || !data.phone) return null;
        if (typeof data.until !== 'number' || !Number.isFinite(data.until)) return null;
        if (data.until <= now) return null;
        // Migrate away from legacy plaintext password storage.
        if (typeof data.password === 'string' && data.password && !data.deviceToken) {
            return null;
        }
        if (typeof data.deviceToken !== 'string' || !data.deviceToken) return null;
        return {phone: data.phone, deviceToken: data.deviceToken, until: data.until};
    } catch {
        return null;
    }
}

export function readRememberedLogin(now = Date.now()): RememberedLogin | null {
    let raw: string | null = null;
    try {
        raw = localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
    const parsed = parseRememberedLogin(raw, now);
    if (raw && !parsed) {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore quota or private-mode failures */
        }
    }
    return parsed;
}

export function writeRememberedLogin(phone: string, deviceToken: string, until?: number, now = Date.now()) {
    const next = buildRememberedLogin(phone, deviceToken, now, until);
    if (!next) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearRememberedLogin() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        /* ignore */
    }
}

/** Remember checkbox only marks intent; token is written after OTP + /device/bind. */
export function applyRememberChoice(remember: boolean | undefined, phone?: string, _password?: string) {
    if (remember === true) {
        try {
            sessionStorage.setItem(REMEMBER_FLAG_KEY, '1');
            if (phone) {
                sessionStorage.setItem('pos.login.rememberPhone', phone.trim());
            }
        } catch {
            /* ignore */
        }
        return;
    }
    if (remember === false) {
        clearRememberedLogin();
        try {
            sessionStorage.removeItem(REMEMBER_FLAG_KEY);
        } catch {
            /* ignore */
        }
    }
}

export function consumeRememberFlag(): boolean {
    try {
        const on = sessionStorage.getItem(REMEMBER_FLAG_KEY) === '1';
        sessionStorage.removeItem(REMEMBER_FLAG_KEY);
        return on;
    } catch {
        return false;
    }
}

export function dropRememberedAfterReject(remember: boolean | undefined, status: number) {
    if (remember === true && status >= 400 && status < 500 && status !== 429) {
        clearRememberedLogin();
    }
}

export function markLoginPending(step: string) {
    try {
        sessionStorage.setItem(PENDING_KEY, step || 'mfa');
    } catch {
        /* ignore */
    }
}

export function takeLoginPending(): string {
    try {
        const value = sessionStorage.getItem(PENDING_KEY) || '';
        sessionStorage.removeItem(PENDING_KEY);
        return value;
    } catch {
        return '';
    }
}

export function clearLoginPending() {
    try {
        sessionStorage.removeItem(PENDING_KEY);
    } catch {
        /* ignore */
    }
}
