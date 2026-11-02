import {StoreSeat} from './storeCache';

/** 开台用餐最长 3 小时。 */
export const DINING_LIMIT_SEC = 3 * 60 * 60;
/** 每次点「延迟」增加的用餐时间。 */
export const DELAY_SEC = 30 * 60;
/** 超时后留给收银员点延迟的时间，过了就清台。 */
export const CLEAR_GRACE_SEC = 60;

export const SEATS_CHANGED = 'x6-seats-updated';

export type HoldPhase = 'ok' | 'prompt' | 'clear';

export function occupiedStartSec(seat: Pick<StoreSeat, 'status' | 'occupied_at'>): number {
    if (Number(seat.status) !== 1) {
        return 0;
    }
    const start = Number(seat.occupied_at) || 0;
    if (!start) {
        return 0;
    }
    return start < 1e12 ? Math.floor(start) : Math.floor(start / 1000);
}

export function holdKey(seatId: string, startSec: number) {
    return `${seatId}:${startSec}`;
}

export function deadlineSec(startSec: number, extraSec: number) {
    return startSec + DINING_LIMIT_SEC + Math.max(0, Math.floor(extraSec) || 0);
}

export function holdPhase(startSec: number, extraSec: number, nowSec: number): HoldPhase {
    if (!startSec) {
        return 'ok';
    }
    const deadline = deadlineSec(startSec, extraSec);
    if (nowSec < deadline) {
        return 'ok';
    }
    if (nowSec < deadline + CLEAR_GRACE_SEC) {
        return 'prompt';
    }
    return 'clear';
}

export function secondsUntilClear(startSec: number, extraSec: number, nowSec: number) {
    if (!startSec) {
        return 0;
    }
    return Math.max(0, deadlineSec(startSec, extraSec) + CLEAR_GRACE_SEC - nowSec);
}

/** 从当前截止时间和现在之间较晚的那个时刻起，再加 30 分钟。连点两次就是 60 分钟。 */
export function extraAfterDelay(startSec: number, extraSec: number, nowSec: number) {
    const base = deadlineSec(startSec, extraSec);
    const next = Math.max(base, nowSec) + DELAY_SEC;
    return next - startSec - DINING_LIMIT_SEC;
}

const holdStorageKey = (storeId: string) => `seatHold:${storeId}`;

export function readHoldExtras(storeId: string): Record<string, number> {
    if (!storeId) {
        return {};
    }
    try {
        const raw = localStorage.getItem(holdStorageKey(storeId));
        const parsed = raw ? JSON.parse(raw) : {};
        if (!parsed || typeof parsed !== 'object') {
            return {};
        }
        const out: Record<string, number> = {};
        Object.entries(parsed).forEach(([key, value]) => {
            const extra = Number(value);
            if (key && Number.isFinite(extra) && extra > 0) {
                out[key] = Math.floor(extra);
            }
        });
        return out;
    } catch {
        return {};
    }
}

export function writeHoldExtra(storeId: string, seatId: string, startSec: number, extraSec: number) {
    if (!storeId || !seatId || !startSec) {
        return;
    }
    const all = readHoldExtras(storeId);
    all[holdKey(seatId, startSec)] = Math.max(0, Math.floor(extraSec) || 0);
    localStorage.setItem(holdStorageKey(storeId), JSON.stringify(all));
}

export function pruneHoldExtras(storeId: string, liveKeys: Set<string>) {
    if (!storeId) {
        return;
    }
    const all = readHoldExtras(storeId);
    let changed = false;
    Object.keys(all).forEach(key => {
        if (!liveKeys.has(key)) {
            delete all[key];
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem(holdStorageKey(storeId), JSON.stringify(all));
    }
}
