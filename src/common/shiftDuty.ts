// 开班以服务端为准。本机只缓存当前账号、当前门店的开始时间，用来在核对完成前先显示计时。

export function dutyUserId(): string {
    try {
        return localStorage.getItem('user_id') || '';
    } catch {
        return '';
    }
}

export function dutyReadyKey(userId: string, storeId: string): string {
    return `shiftReady:${userId || '0'}:${storeId}`;
}

export function dutyStartKey(userId: string, storeId: string): string {
    return `shiftReadyTime:${userId || '0'}:${storeId}`;
}

export function parseStartMs(value: unknown): number {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        return value < 1e12 ? value * 1000 : value;
    }
    if (typeof value === 'string' && value.trim()) {
        const asNumber = Number(value);
        if (Number.isFinite(asNumber) && asNumber > 0) {
            return asNumber < 1e12 ? asNumber * 1000 : asNumber;
        }
        const parsed = Date.parse(value);
        if (Number.isFinite(parsed) && parsed > 0) {
            return parsed;
        }
    }
    return 0;
}

export function elapsedSeconds(startMs: number, nowMs: number): number {
    if (!startMs || !nowMs || nowMs <= startMs) {
        return 0;
    }
    return Math.floor((nowMs - startMs) / 1000);
}

export type DutySnapshot = {
    ready: boolean;
    start: number;
};

export function readDutyPayload(body: unknown): DutySnapshot | null {
    const record = body && typeof body === 'object' ? body as {ready?: unknown; start?: unknown; data?: {ready?: unknown; start?: unknown}} : null;
    const source = record && typeof record.ready === 'boolean'
        ? record
        : record?.data && typeof record.data.ready === 'boolean'
            ? record.data
            : null;
    if (!source) {
        return null;
    }
    const start = Number(source.start);
    return {
        ready: source.ready === true && Number.isFinite(start) && start > 0,
        start: Number.isFinite(start) ? start : 0,
    };
}

export function isNotStartedMessage(message: string): boolean {
    return message.includes('还未开始');
}

export function dutyErrorMessage(body: unknown): string {
    if (!body || typeof body !== 'object') {
        return '';
    }
    const record = body as {message?: unknown; error?: unknown};
    if (typeof record.message === 'string' && record.message) {
        return record.message;
    }
    if (typeof record.error === 'string' && record.error) {
        return record.error;
    }
    return '';
}

function clearLegacyDuty(storeId: string) {
    localStorage.removeItem(`shiftReady:${storeId}`);
    localStorage.removeItem(`shiftReadyTime:${storeId}`);
}

export function readLocalDuty(userId: string, storeId: string): DutySnapshot {
    if (!storeId) {
        return {ready: false, start: 0};
    }
    try {
        const readyRaw = localStorage.getItem(dutyReadyKey(userId, storeId));
        const startRaw = localStorage.getItem(dutyStartKey(userId, storeId));
        const ready = readyRaw ? JSON.parse(readyRaw) === true : false;
        const start = startRaw ? Number(JSON.parse(startRaw)) : 0;
        if (!ready || !Number.isFinite(start) || start <= 0) {
            return {ready: false, start: 0};
        }
        return {ready: true, start};
    } catch {
        return {ready: false, start: 0};
    }
}

export function writeLocalDuty(userId: string, storeId: string, start: number) {
    if (!storeId || !start) {
        return;
    }
    localStorage.setItem(dutyReadyKey(userId, storeId), 'true');
    localStorage.setItem(dutyStartKey(userId, storeId), JSON.stringify(start));
    clearLegacyDuty(storeId);
}

export function clearLocalDuty(userId: string, storeId: string) {
    if (!storeId) {
        return;
    }
    localStorage.removeItem(dutyReadyKey(userId, storeId));
    localStorage.removeItem(dutyStartKey(userId, storeId));
    clearLegacyDuty(storeId);
}
