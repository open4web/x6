export type SeatStatus = 0 | 1 | 2 | 3;

export type StoreSeat = {
    id: string;
    name: string;
    table_no?: string;
    type?: string;
    status: SeatStatus | number;
    capacity?: number;
    area?: string;
    x?: number;
    y?: number;
    background?: string;
    occupied_at?: number;
    reserved_at?: number;
    order_no?: string;
    people?: number;
    elapsed?: number;
};

export type StoreLayout = {
    cols?: number;
    rows?: number;
};

export type CachedStore = {
    id: string;
    name: string;
    status?: number;
    layout?: StoreLayout;
    seats?: StoreSeat[];
};

const KEY = (storeId: string) => `storeTables:${storeId}`;

export function writeStoreTables(storeId: string, store: CachedStore) {
    if (!storeId) {
        return;
    }
    localStorage.setItem(KEY(storeId), JSON.stringify({...store, cachedAt: Date.now()}));
}

export function readStoreTables(storeId: string): CachedStore | null {
    if (!storeId) {
        return null;
    }
    try {
        const raw = localStorage.getItem(KEY(storeId));
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function writeStores(stores: CachedStore[]) {
    (stores || []).forEach(store => {
        if (store?.id) {
            writeStoreTables(store.id, store);
        }
    });
}

export function seatLabel(seat?: StoreSeat | null) {
    if (!seat) {
        return '';
    }
    return seat.table_no || seat.name || seat.id;
}

export function formatElapsed(seconds?: number) {
    const value = Math.max(0, Number(seconds) || 0);
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const secs = value % 60;
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function liveElapsed(seat: StoreSeat) {
    if (typeof seat.elapsed === 'number' && seat.elapsed > 0 && !seat.occupied_at && !seat.reserved_at) {
        return seat.elapsed;
    }
    const start = seat.status === 1 ? seat.occupied_at : seat.status === 2 ? seat.reserved_at : 0;
    if (!start) {
        return seat.elapsed || 0;
    }
    const startMs = start < 1e12 ? start * 1000 : start;
    return Math.max(0, Math.floor((Date.now() - startMs) / 1000));
}
