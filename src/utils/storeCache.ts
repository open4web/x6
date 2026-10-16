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
    qr_display?: string;
};

export type PayChannels = {
    cash?: boolean;
    wechat?: boolean;
    balance?: boolean;
};

export type CachedStore = {
    id: string;
    name: string;
    status?: number;
    hours?: string;
    phone?: string;
    area?: string;
    address?: string;
    category?: string;
    layout?: StoreLayout;
    seats?: StoreSeat[];
    pay_channels?: PayChannels;
};

export function storePlace(store?: Pick<CachedStore, 'area' | 'address'> | null) {
    const area = String(store?.area || '').trim();
    const address = String(store?.address || '').trim();
    if (area && address) {
        return address.includes(area) ? address : `${area} · ${address}`;
    }
    return area || address;
}

export function storeSeatCounts(seats?: Array<Pick<StoreSeat, 'status'>> | null) {
    const list = seats || [];
    let busy = 0;
    let reserved = 0;
    let free = 0;
    for (const seat of list) {
        if (seat.status === 1) {
            busy += 1;
        } else if (seat.status === 2) {
            reserved += 1;
        } else if (seat.status !== 3) {
            free += 1;
        }
    }
    return {total: list.length, busy, reserved, free};
}

export function unwrapStoreList(payload: any): CachedStore[] {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }
    if (Array.isArray(payload?.list)) {
        return payload.list;
    }
    return [];
}

export function resolvePayChannels(store?: CachedStore | null): {cash: boolean; wechat: boolean; balance: boolean} {
    const channels = store?.pay_channels;
    if (!channels) {
        return {cash: true, wechat: false, balance: false};
    }
    const cash = channels.cash !== false;
    const wechat = !!channels.wechat;
    const balance = !!channels.balance;
    if (!cash && !wechat && !balance) {
        return {cash: true, wechat: false, balance: false};
    }
    return {cash, wechat, balance};
}

const KEY = (storeId: string) => `storeTables:${storeId}`;

export function writeStoreTables(storeId: string, store: CachedStore) {
    if (!storeId) {
        return;
    }
    const prev = readStoreTables(storeId);
    const next: CachedStore = {
        ...prev,
        ...store,
        id: store.id || prev?.id || storeId,
        name: store.name || prev?.name || '',
        status: store.status ?? prev?.status,
        hours: store.hours || prev?.hours,
        phone: store.phone || prev?.phone,
        area: store.area || prev?.area,
        address: store.address || prev?.address,
        category: store.category || prev?.category,
        layout: store.layout ?? prev?.layout,
        seats: store.seats ?? prev?.seats,
        pay_channels: store.pay_channels ?? prev?.pay_channels,
    };
    localStorage.setItem(KEY(storeId), JSON.stringify({...next, cachedAt: Date.now()}));
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
    unwrapStoreList(stores).forEach(store => {
        if (store?.id) {
            writeStoreTables(store.id, store);
        }
    });
}

const SIZE_PREFIX: Record<string, string> = {large: 'A', middle: 'B', small: 'C'};

function clipPrefix(value?: string) {
    return String(value || '').replace(/[|\r\n]/g, '').trim().slice(0, 8);
}

export function splitQrDisplay(value?: string) {
    const raw = String(value || '').trim();
    const cut = raw.indexOf('|');
    const modeRaw = (cut >= 0 ? raw.slice(0, cut) : raw).trim();
    const prefix = cut >= 0 ? clipPrefix(raw.slice(cut + 1)) : '';
    const mode = modeRaw === 'name' || modeRaw === 'id' || modeRaw === 'table_no' ? modeRaw : 'table_no';
    return {mode, prefix};
}

export function readSeatPrefix(area?: string) {
    const raw = String(area || '');
    return raw.startsWith('p:') ? clipPrefix(raw.slice(2)) : '';
}

export function seatZone(area?: string) {
    const raw = String(area || '').trim();
    return raw.startsWith('p:') ? '' : raw;
}

function resolveSeatPrefix(storePrefix?: string, area?: string, seatType?: string) {
    const raw = readSeatPrefix(area) || clipPrefix(storePrefix);
    if (!raw || raw === 'table' || raw === '桌号') return '桌号';
    if (raw === 'none' || raw === '-') return '';
    if (raw === 'size') return SIZE_PREFIX[String(seatType || '').trim()] || '桌号';
    return raw;
}

export function seatLabel(seat?: StoreSeat | null, qrDisplay?: string) {
    if (!seat) {
        return '';
    }
    const {mode, prefix} = splitQrDisplay(qrDisplay);
    const tableNo = String(seat.table_no || '').trim();
    const name = String(seat.name || '').trim();
    const id = String(seat.id || '').trim();
    let body = tableNo || name || id;
    if (mode === 'id') body = id || body;
    else if (mode === 'name') body = name || tableNo || id;
    const word = resolveSeatPrefix(prefix, seat.area, seat.type);
    if (!body) return word === '桌号' ? '' : word;
    if (!word || word === '桌号') return body;
    if (body === word || body.startsWith(`${word} `)) return body;
    return `${word} ${body}`;
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
