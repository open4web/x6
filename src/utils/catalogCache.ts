import {useEffect, useState} from 'react';
import {MenuData, ProductItem} from '../pages/home/Components/Type';
import {ComboGroup} from '../pages/home/types';

export const CATALOG_TTL_MS = 15 * 60 * 1000;
const STORAGE_PREFIX = 'posCatalog:';

type CacheEntry<T> = {
    data: T;
    fetchedAt: number;
    dateKey: string;
};

type MerchantCatalog = {
    merchantId: string;
    menus?: CacheEntry<MenuData[]>;
    productsByMenu: Record<string, CacheEntry<ProductItem[]>>;
    combs?: CacheEntry<ComboGroup[]>;
    stockByProduct: Record<string, number>;
};

type ReadResult<T> = {
    data: T;
    fresh: boolean;
};

let memory: MerchantCatalog | null = null;
let catalogTick = 0;
const listeners = new Set<() => void>();

function todayKey(): string {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}

function isFresh(entry: CacheEntry<unknown> | undefined): boolean {
    if (!entry) {
        return false;
    }
    return entry.dateKey === todayKey() && Date.now() - entry.fetchedAt < CATALOG_TTL_MS;
}

function emptyCatalog(merchantId: string): MerchantCatalog {
    return {
        merchantId,
        productsByMenu: {},
        stockByProduct: {},
    };
}

function notify(): void {
    catalogTick += 1;
    listeners.forEach(listener => listener());
}

function persist(catalog: MerchantCatalog): void {
    memory = catalog;
    try {
        sessionStorage.setItem(STORAGE_PREFIX + catalog.merchantId, JSON.stringify(catalog));
    } catch {
        // quota / private mode: memory cache still works
    }
    notify();
}

function ensureStore(merchantId: string): MerchantCatalog {
    if (!merchantId) {
        return emptyCatalog('');
    }
    if (memory?.merchantId === merchantId) {
        return memory;
    }

    try {
        const raw = sessionStorage.getItem(STORAGE_PREFIX + merchantId);
        if (raw) {
            const parsed = JSON.parse(raw) as MerchantCatalog;
            if (parsed?.merchantId === merchantId) {
                parsed.productsByMenu = parsed.productsByMenu || {};
                parsed.stockByProduct = parsed.stockByProduct || {};
                memory = parsed;
                return parsed;
            }
        }
    } catch {
        // ignore corrupt cache
    }

    const created = emptyCatalog(merchantId);
    memory = created;
    return created;
}

function applyStockToProducts(merchantId: string, products: ProductItem[]): ProductItem[] {
    const stockByProduct = ensureStore(merchantId).stockByProduct;
    return products.map(product => {
        const stock = stockByProduct[product.id];
        return stock === undefined ? product : {...product, stock};
    });
}

function seedStock(catalog: MerchantCatalog, products: ProductItem[]): void {
    products.forEach(product => {
        if (typeof product.stock === 'number') {
            catalog.stockByProduct[product.id] = product.stock;
        }
    });
}

export function readMenus(merchantId: string): ReadResult<MenuData[]> | null {
    if (!merchantId) {
        return null;
    }
    const entry = ensureStore(merchantId).menus;
    if (!entry) {
        return null;
    }
    return {data: entry.data, fresh: isFresh(entry)};
}

export function writeMenus(merchantId: string, menus: MenuData[]): void {
    if (!merchantId) {
        return;
    }
    const catalog = ensureStore(merchantId);
    catalog.menus = {data: menus, fetchedAt: Date.now(), dateKey: todayKey()};
    persist(catalog);
}

export function readProducts(merchantId: string, menuId: string): ReadResult<ProductItem[]> | null {
    if (!merchantId || !menuId) {
        return null;
    }
    const entry = ensureStore(merchantId).productsByMenu[menuId];
    if (!entry) {
        return null;
    }
    return {
        data: applyStockToProducts(merchantId, entry.data),
        fresh: isFresh(entry),
    };
}

export function writeProducts(merchantId: string, menuId: string, products: ProductItem[]): void {
    if (!merchantId || !menuId) {
        return;
    }
    const catalog = ensureStore(merchantId);
    catalog.productsByMenu[menuId] = {
        data: products,
        fetchedAt: Date.now(),
        dateKey: todayKey(),
    };
    seedStock(catalog, products);
    persist(catalog);
}

export function readCombs(merchantId: string): ReadResult<ComboGroup[]> | null {
    if (!merchantId) {
        return null;
    }
    const entry = ensureStore(merchantId).combs;
    if (!entry) {
        return null;
    }
    return {data: entry.data, fresh: isFresh(entry)};
}

export function writeCombs(merchantId: string, combs: ComboGroup[]): void {
    if (!merchantId) {
        return;
    }
    const catalog = ensureStore(merchantId);
    catalog.combs = {data: combs, fetchedAt: Date.now(), dateKey: todayKey()};
    persist(catalog);
}

export function applyStock(merchantId: string, products: ProductItem[]): ProductItem[] {
    return applyStockToProducts(merchantId, products);
}

/** Overlay live stock without touching the catalog TTL. Ready for websocket patches. */
export function patchStock(
    merchantId: string,
    items: Array<{ productId: string; stock: number }>,
): void {
    if (!merchantId || items.length === 0) {
        return;
    }
    const catalog = ensureStore(merchantId);
    items.forEach(item => {
        catalog.stockByProduct[item.productId] = item.stock;
    });
    persist(catalog);
}

export function invalidateCatalog(merchantId?: string): void {
    if (merchantId) {
        try {
            sessionStorage.removeItem(STORAGE_PREFIX + merchantId);
        } catch {
            // ignore
        }
        if (memory?.merchantId === merchantId) {
            memory = emptyCatalog(merchantId);
        }
    } else {
        memory = null;
    }
    notify();
}

export function subscribeCatalog(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function useCatalogTick(): number {
    const [tick, setTick] = useState(catalogTick);
    useEffect(() => subscribeCatalog(() => setTick(catalogTick)), []);
    return tick;
}
