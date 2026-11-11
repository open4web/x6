import {CartItem} from '../common/types';
import {ComboGroup, ComboItem} from '../pages/home/types';

export type ComboSlot = {
    combName: string;
    price: number;
    requires: number;
    products: string[];
};

export type ComboOffer = {
    id: string;
    name: string;
    price: number;
    combo: ComboSlot[];
};

export type ComboHitItem = {
    id: string;
    name: string;
    quantity: number;
    comboName: string;
    unitPrice: number;
    combIndex?: number;
};

export type ComboHit = {
    id: string;
    name: string;
    count: number;
    price: number;
    original: number;
    discount: number;
    items: ComboHitItem[];
};

export type ComboMatchResult = {
    matches: ComboHit[];
    totalDiscount: number;
    payAmount: number;
    originalAmount: number;
    usedQty: Record<string, number>;
    lineMarks: Record<string, string>;
};

export function resolveUnitPrice(item?: {price?: number; origin_price?: number} | null): number {
    const origin = Number(item?.origin_price) || 0;
    if (origin > 0) {
        return origin;
    }
    return Number(item?.price) || 0;
}

export function withUnitPrices(items: CartItem[], lookup?: (id: string) => number): CartItem[] {
    return (items || []).map(item => {
        const unit = resolveUnitPrice(item) || lookup?.(item.id) || 0;
        if (unit <= 0) {
            return item;
        }
        return {
            ...item,
            origin_price: item.origin_price || unit,
            price: Number(item.price) > 0 ? item.price : unit,
        };
    });
}

export type OrderPropItem = {
    is_default: number;
    id: number;
    code: string;
    value: string;
    price: number;
};

function parsePropId(raw: string | number | undefined): number {
    const id = Number.parseInt(String(raw ?? ''), 10);
    return Number.isFinite(id) ? id : 0;
}

/** Selected specs from cart desc + spiceOptions. Backend PriceOrder requires props_item when unit price includes extras. */
export function spiceSelections(item: CartItem): OrderPropItem[] {
    if (!item?.desc || !item.spiceOptions?.length) {
        return [];
    }
    const names = item.desc.split(',').map(name => name.trim()).filter(Boolean);
    const used = new Set<string>();
    const selected: OrderPropItem[] = [];
    names.forEach(name => {
        for (const prop of item.spiceOptions) {
            const matched = (prop.spiceOptions || []).find(spice => {
                if (spice.name !== name) {
                    return false;
                }
                const key = `${prop.id}:${spice.id}`;
                return !used.has(key);
            });
            if (!matched) {
                continue;
            }
            used.add(`${prop.id}:${matched.id}`);
            selected.push({
                is_default: 0,
                id: parsePropId(matched.id),
                code: prop.id,
                value: matched.name,
                price: Math.round(Number(matched.price) || 0),
            });
            break;
        }
    });
    return selected;
}

function spiceOf(item: CartItem): number {
    return spiceSelections(item).reduce((sum, spice) => sum + (Number(spice.price) || 0), 0);
}

function lineKey(item: CartItem) {
    return `${item.id}::${item.desc || ''}`;
}

function asList(groups: ComboGroup[] | any): ComboGroup[] {
    if (Array.isArray(groups)) {
        return groups;
    }
    if (Array.isArray(groups?.data)) {
        return groups.data;
    }
    return [];
}

export function normalizeComboOffers(groups: ComboGroup[] | any): ComboOffer[] {
    return asList(groups).map((group): ComboOffer | null => {
        const slots: ComboSlot[] = (group.combo || []).map((slot: ComboItem) => ({
            combName: slot.combName || group.name || '',
            price: Number(slot.price) || 0,
            requires: Math.max(1, Number(slot.requires) || 1),
            products: (slot.products || []).map(String).filter(Boolean),
        })).filter(slot => slot.products.length > 0);

        if (!slots.length && Array.isArray(group.products) && group.products.length) {
            group.products.forEach((id: string) => {
                slots.push({
                    combName: group.name || '',
                    price: 0,
                    requires: 1,
                    products: [String(id)],
                });
            });
        }
        if (!slots.length) {
            return null;
        }
        return {
            id: group.id || group.name,
            name: group.name || '套餐',
            price: Number(group.price) || 0,
            combo: slots,
        };
    }).filter((item): item is ComboOffer => !!item);
}

function remainingOf(pool: Record<string, number>, productIds: string[]) {
    return productIds.reduce((sum, id) => sum + (pool[id] || 0), 0);
}

function canFill(offer: ComboOffer, pool: Record<string, number>) {
    return offer.combo.every(slot => remainingOf(pool, slot.products) >= slot.requires);
}

function consumeSlot(slot: ComboSlot, pool: Record<string, number>, names: Record<string, string>): ComboHitItem[] {
    let need = slot.requires;
    const taken: ComboHitItem[] = [];
    const ordered = [...slot.products].sort((a, b) => (pool[b] || 0) - (pool[a] || 0));
    for (const id of ordered) {
        if (need <= 0) {
            break;
        }
        const have = pool[id] || 0;
        if (have <= 0) {
            continue;
        }
        const qty = Math.min(have, need);
        pool[id] = have - qty;
        need -= qty;
        taken.push({
            id,
            name: names[id] || id,
            quantity: qty,
            comboName: slot.combName,
            unitPrice: 0,
        });
    }
    return taken;
}

function fillOnce(offer: ComboOffer, pool: Record<string, number>, names: Record<string, string>, prices: Record<string, number>): ComboHitItem[] | null {
    const snapshot = {...pool};
    const items: ComboHitItem[] = [];
    for (let index = 0; index < offer.combo.length; index += 1) {
        const slot = offer.combo[index];
        const taken = consumeSlot(slot, pool, names);
        const got = taken.reduce((sum, item) => sum + item.quantity, 0);
        if (got < slot.requires) {
            Object.keys(snapshot).forEach(key => {
                pool[key] = snapshot[key];
            });
            return null;
        }
        taken.forEach(item => {
            item.unitPrice = prices[item.id] || 0;
            item.combIndex = index;
        });
        items.push(...taken);
    }
    return items;
}

export type ComboListPrice = {
    price: number;
    original: number;
    discount: number;
};

export function comboSlotSummary(offer: ComboOffer): string {
    const parts = (offer.combo || []).map(slot => {
        const name = (slot.combName || '').trim();
        const need = Math.max(1, Number(slot.requires) || 1);
        if (name) {
            return need > 1 ? `${name}×${need}` : name;
        }
        return need > 1 ? `×${need}` : '';
    }).filter(Boolean);
    return parts.join(' + ');
}

export function comboListPrice(offer: ComboOffer, lookup?: (id: string) => number): ComboListPrice {
    const original = (offer.combo || []).reduce((sum, slot) => {
        const cheapest = Math.min(...(slot.products || []).map(id => {
            const unit = lookup?.(id) ?? 0;
            return unit > 0 ? unit : Number.POSITIVE_INFINITY;
        }));
        const unit = Number.isFinite(cheapest) ? cheapest : 0;
        return sum + unit * Math.max(1, Number(slot.requires) || 1);
    }, 0);
    const price = Number(offer.price) > 0 ? Number(offer.price) : original;
    return {
        price,
        original,
        discount: Math.max(0, original - price),
    };
}

function savings(offer: ComboOffer, prices: Record<string, number>) {
    return comboListPrice(offer, id => prices[id] || 0).discount;
}

export function matchComboGroups(cartItems: CartItem[], comboGroups: ComboGroup[] | any): ComboMatchResult {
    const empty: ComboMatchResult = {
        matches: [],
        totalDiscount: 0,
        payAmount: 0,
        originalAmount: 0,
        usedQty: {},
        lineMarks: {},
    };
    if (!cartItems?.length) {
        return empty;
    }

    const pool: Record<string, number> = {};
    const names: Record<string, string> = {};
    const prices: Record<string, number> = {};
    const spiceById: Record<string, number> = {};
    cartItems.forEach(item => {
        pool[item.id] = (pool[item.id] || 0) + (item.quantity || 0);
        names[item.id] = item.name;
        prices[item.id] = resolveUnitPrice(item);
        spiceById[item.id] = spiceOf(item);
    });

    const offers = normalizeComboOffers(comboGroups).sort((a, b) => {
        const slotDiff = b.combo.length - a.combo.length;
        if (slotDiff) {
            return slotDiff;
        }
        return savings(b, prices) - savings(a, prices);
    });

    const hits: ComboHit[] = [];
    offers.forEach(offer => {
        let count = 0;
        let bundled: ComboHitItem[] = [];
        let original = 0;
        while (canFill(offer, pool)) {
            const taken = fillOnce(offer, pool, names, prices);
            if (!taken) {
                break;
            }
            count += 1;
            bundled = bundled.concat(taken);
            original += taken.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        }
        if (count <= 0) {
            return;
        }
        const merged = new Map<string, ComboHitItem>();
        bundled.forEach(item => {
            const key = `${item.id}::${item.comboName}`;
            const prev = merged.get(key);
            if (prev) {
                prev.quantity += item.quantity;
            } else {
                merged.set(key, {...item});
            }
        });
        const unitOriginal = original / count;
        const unitPrice = offer.price > 0 ? offer.price : unitOriginal;
        hits.push({
            id: offer.id,
            name: offer.name,
            count,
            price: unitPrice,
            original: unitOriginal,
            discount: Math.max(0, (unitOriginal - unitPrice) * count),
            items: Array.from(merged.values()),
        });
    });

    const usedQty: Record<string, number> = {};
    hits.forEach(hit => {
        hit.items.forEach(item => {
            usedQty[item.id] = (usedQty[item.id] || 0) + item.quantity;
        });
    });

    const originalAmount = cartItems.reduce((sum, item) => sum + (resolveUnitPrice(item) + spiceOf(item)) * item.quantity, 0);
    let comboBase = 0;
    let matchedSpice = 0;
    hits.forEach(hit => {
        comboBase += hit.price * hit.count;
        hit.items.forEach(item => {
            matchedSpice += (spiceById[item.id] || 0) * item.quantity;
        });
    });

    const usedLeft = {...usedQty};
    let remainderPay = 0;
    cartItems.forEach(item => {
        const used = Math.min(item.quantity, usedLeft[item.id] || 0);
        usedLeft[item.id] = (usedLeft[item.id] || 0) - used;
        const rest = item.quantity - used;
        if (rest > 0) {
            remainderPay += (resolveUnitPrice(item) + spiceOf(item)) * rest;
        }
    });

    const lineMarks: Record<string, string> = {};
    const markLeft = {...usedQty};
    cartItems.forEach(item => {
        const take = Math.min(item.quantity, markLeft[item.id] || 0);
        if (take > 0) {
            const hit = hits.find(entry => entry.items.some(row => row.id === item.id));
            lineMarks[lineKey(item)] = hit?.name || '';
            markLeft[item.id] = (markLeft[item.id] || 0) - take;
        }
    });

    return {
        matches: hits,
        totalDiscount: hits.reduce((sum, hit) => sum + hit.discount, 0),
        payAmount: comboBase + matchedSpice + remainderPay,
        originalAmount,
        usedQty,
        lineMarks,
    };
}

export function toOrderBuckets(cartItems: CartItem[], result: ComboMatchResult) {
    const comboByProduct: Record<string, {id: string; index: number}> = {};
    result.matches.forEach(hit => {
        hit.items.forEach(item => {
            if (!comboByProduct[item.id]) {
                comboByProduct[item.id] = {id: hit.id, index: item.combIndex || 0};
            }
        });
    });

    return cartItems.map(item => {
        const propsItem = spiceSelections(item);
        const combo = comboByProduct[item.id];
        const unitPrice = resolveUnitPrice(item);
        return {
            ID: item.id,
            Number: item.quantity,
            Price: Number(unitPrice.toFixed(4)),
            Name: item.name,
            props_text: item.desc,
            props: propsItem.map(prop => prop.id).filter(id => id > 0),
            props_item: propsItem,
            comb_id: combo?.id || '',
            comb_index: combo?.index || 0,
        };
    });
}
