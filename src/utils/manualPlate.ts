import {sameTableToken} from './storeCache';

/** 手动号牌最长占用 2 小时，到点自动释放，不能靠延迟再延长。 */
export const MANUAL_PLATE_LIMIT_SEC = 2 * 60 * 60;

export type ManualPlate = {
    no: string;
    at: number;
    ordered: boolean;
};

const storageKey = (storeId: string) => `manualPlate:${storeId}`;

function readRaw(storeId: string): ManualPlate[] {
    if (!storeId) {
        return [];
    }
    try {
        const parsed = JSON.parse(localStorage.getItem(storageKey(storeId)) || '[]');
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.flatMap(item => {
            const no = String(item?.no || '').trim();
            const at = Math.floor(Number(item?.at) || 0);
            if (!no || !at) {
                return [];
            }
            return [{no, at, ordered: Boolean(item?.ordered)}];
        });
    } catch {
        return [];
    }
}

function writeRaw(storeId: string, plates: ManualPlate[]) {
    if (!storeId) {
        return;
    }
    if (!plates.length) {
        localStorage.removeItem(storageKey(storeId));
        return;
    }
    localStorage.setItem(storageKey(storeId), JSON.stringify(plates));
}

export function splitManualPlates(storeId: string, nowSec: number) {
    const active: ManualPlate[] = [];
    const released: ManualPlate[] = [];
    readRaw(storeId).forEach(plate => {
        if (nowSec - plate.at >= MANUAL_PLATE_LIMIT_SEC) {
            released.push(plate);
        } else {
            active.push(plate);
        }
    });
    return {active, released};
}

export function sweepManualPlates(storeId: string, nowSec = Math.floor(Date.now() / 1000)) {
    const split = splitManualPlates(storeId, nowSec);
    writeRaw(storeId, split.active);
    return split.released;
}

export function findActiveManualPlate(storeId: string, no: string, nowSec = Math.floor(Date.now() / 1000)) {
    const token = no.trim();
    if (!token) {
        return null;
    }
    return splitManualPlates(storeId, nowSec).active.find(plate => sameTableToken(plate.no, token)) || null;
}

export function manualPlateSecondsLeft(plate: ManualPlate, nowSec: number) {
    return Math.max(0, plate.at + MANUAL_PLATE_LIMIT_SEC - nowSec);
}

/** 同一个号还在占用时，不把开始时间往后推。 */
export function rememberManualPlate(storeId: string, no: string, nowSec = Math.floor(Date.now() / 1000)) {
    const token = no.trim();
    if (!storeId || !token) {
        return null;
    }
    const {active} = splitManualPlates(storeId, nowSec);
    const found = active.find(plate => sameTableToken(plate.no, token));
    if (found) {
        writeRaw(storeId, active);
        return found;
    }
    const next: ManualPlate = {no: token, at: nowSec, ordered: false};
    writeRaw(storeId, [...active, next]);
    return next;
}

export function markManualPlateOrdered(storeId: string, no: string, nowSec = Math.floor(Date.now() / 1000)) {
    const token = no.trim();
    if (!storeId || !token) {
        return;
    }
    const {active} = splitManualPlates(storeId, nowSec);
    const found = active.find(plate => sameTableToken(plate.no, token));
    if (found) {
        found.ordered = true;
        writeRaw(storeId, active);
        return;
    }
    writeRaw(storeId, [...active, {no: token, at: nowSec, ordered: true}]);
}

/** 还没下单就换号或清空时，马上放开。已经下单的号牌仍等到 2 小时。 */
export function releaseUnorderedManualPlate(storeId: string, no: string, nowSec = Math.floor(Date.now() / 1000)) {
    const token = no.trim();
    if (!storeId || !token) {
        return;
    }
    const {active} = splitManualPlates(storeId, nowSec);
    writeRaw(storeId, active.filter(plate => plate.ordered || !sameTableToken(plate.no, token)));
}
