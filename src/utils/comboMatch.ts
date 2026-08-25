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

function spiceOf(item: CartItem): number {
    if (!item?.desc || !item.spiceOptions?.length) {
        return 0;
    }
    const names = item.desc.split(',').map(name => name.trim()).filter(Boolean);
    return names.reduce((sum, name) => {
        let extra = 0;
        item.spiceOptions.forEach(prop => {
            const matched = prop.spiceOptions.find(spice => spice.name === name);
            if (matched) {
                extra += Number(matched.price) || 0;
            }
        });
        return sum + extra;
    }, 0);
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
    for (const slot of offer.combo) {
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
        });
        items.push(...taken);
    }
    return items;
}

function savings(offer: ComboOffer, prices: Record<string, number>) {
    const original = offer.combo.reduce((sum, slot) => {
        const cheapest = Math.min(...slot.products.map(id => prices[id] ?? Number.POSITIVE_INFINITY));
        const unit = Number.isFinite(cheapest) ? cheapest : 0;
        return sum + unit * slot.requires;
    }, 0);
    if (offer.price > 0) {
        return original - offer.price;
    }
    return 0;
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
        prices[item.id] = Number(item.price) || 0;
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

    const originalAmount = cartItems.reduce((sum, item) => sum + (item.price + spiceOf(item)) * item.quantity, 0);
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
            remainderPay += (item.price + spiceOf(item)) * rest;
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
    const money: Record<string, number> = {};
    const qty: Record<string, number> = {};
    result.matches.forEach(hit => {
        const original = hit.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || 1;
        const comboPay = hit.price * hit.count;
        hit.items.forEach(item => {
            const share = comboPay * ((item.unitPrice * item.quantity) / original);
            money[item.id] = (money[item.id] || 0) + share;
            qty[item.id] = (qty[item.id] || 0) + item.quantity;
        });
    });

    return cartItems.map(item => {
        const used = Math.min(item.quantity, qty[item.id] || 0);
        const comboPay = used > 0 && qty[item.id] ? money[item.id] * (used / qty[item.id]) : 0;
        if (used > 0) {
            money[item.id] -= comboPay;
            qty[item.id] -= used;
        }
        const rest = item.quantity - used;
        const pay = comboPay + rest * item.price + spiceOf(item) * item.quantity;
        const unit = item.quantity > 0 ? pay / item.quantity : item.price;
        return {
            ID: item.id,
            Number: item.quantity,
            Price: Number(unit.toFixed(4)),
            Name: item.name,
            props_text: item.desc,
        };
    });
}
