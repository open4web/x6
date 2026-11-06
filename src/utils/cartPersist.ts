import {CartItem} from '../common/types';

const PREFIX = 'posCart:';

export type PersistedCart = {
    merchantId: string;
    items: CartItem[];
    phone?: string;
    seatId?: string;
    people?: number;
    savedAt: number;
};

export function cartStorageKey(merchantId: string): string {
    return PREFIX + (merchantId || 'none');
}

export function readPersistedCart(merchantId: string): PersistedCart | null {
    if (!merchantId) {
        return null;
    }
    try {
        const raw = localStorage.getItem(cartStorageKey(merchantId));
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw) as PersistedCart;
        if (!parsed || parsed.merchantId !== merchantId || !Array.isArray(parsed.items)) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

export function writePersistedCart(merchantId: string, items: CartItem[], extra?: Partial<PersistedCart>): void {
    if (!merchantId) {
        return;
    }
    try {
        const payload: PersistedCart = {
            merchantId,
            items,
            phone: extra?.phone,
            seatId: extra?.seatId,
            people: extra?.people,
            savedAt: Date.now(),
        };
        localStorage.setItem(cartStorageKey(merchantId), JSON.stringify(payload));
    } catch {
        /* quota */
    }
}

export function clearPersistedCart(merchantId: string): void {
    try {
        localStorage.removeItem(cartStorageKey(merchantId));
    } catch {
        /* ignore */
    }
}
