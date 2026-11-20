// 进入点餐前先确定门店：只认当前账号有权限的门店（/v1/hlj/store/list 已按店长过滤）。
import type {CachedStore} from './storeCache';

export const STORE_KEY = 'current_store_id';

export type StorePick =
    | {kind: 'keep'; id: string}
    | {kind: 'auto'; id: string}
    | {kind: 'pick'; stale: boolean}
    | {kind: 'empty'; stale: boolean};

export function resolveStorePick(savedId: string, stores: Array<Pick<CachedStore, 'id'>>): StorePick {
    const saved = String(savedId || '').trim();
    const ids = stores.map(store => String(store?.id || '').trim()).filter(Boolean);
    const stale = saved !== '' && !ids.includes(saved);
    if (saved && !stale) {
        return {kind: 'keep', id: saved};
    }
    if (ids.length === 0) {
        return {kind: 'empty', stale};
    }
    if (ids.length === 1) {
        return {kind: 'auto', id: ids[0]};
    }
    return {kind: 'pick', stale};
}

export function readSavedStoreId(): string {
    try {
        return (localStorage.getItem(STORE_KEY) || '').trim();
    } catch {
        return '';
    }
}

export function saveStoreId(id: string) {
    if (id) {
        localStorage.setItem(STORE_KEY, id);
    } else {
        localStorage.removeItem(STORE_KEY);
    }
}

// 门店管理页（新商户在这里建第一家店）不拦截。
export function isStoreGateExempt(pathname: string): boolean {
    return /^\/manage(\/|$)/.test(String(pathname || ''));
}
