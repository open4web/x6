// Device-local shortcut for shift change. Sign-in still sends the password, then the OTP.
const STORAGE_KEY = 'pos.login.remember7';
const PENDING_KEY = 'pos.login.pending';

export const REMEMBER_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type RememberedLogin = {
    phone: string;
    password: string;
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

export function buildRememberedLogin(phone: string, password: string, now = Date.now()): RememberedLogin | null {
    const nextPhone = phone.trim();
    if (!nextPhone || !password) return null;
    return {phone: nextPhone, password, until: now + REMEMBER_TTL_MS};
}

export function parseRememberedLogin(raw: string | null, now = Date.now()): RememberedLogin | null {
    if (!raw) return null;
    try {
        const data = JSON.parse(raw) as Partial<RememberedLogin>;
        if (typeof data.phone !== 'string' || !data.phone) return null;
        if (typeof data.password !== 'string' || !data.password) return null;
        if (typeof data.until !== 'number' || !Number.isFinite(data.until)) return null;
        if (data.until <= now) return null;
        return {phone: data.phone, password: data.password, until: data.until};
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

export function writeRememberedLogin(phone: string, password: string, now = Date.now()) {
    const next = buildRememberedLogin(phone, password, now);
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

export function applyRememberChoice(remember: boolean | undefined, phone?: string, password?: string) {
    if (remember === true) {
        if (phone && password) writeRememberedLogin(phone, password);
        return;
    }
    if (remember === false) clearRememberedLogin();
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
