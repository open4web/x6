type MerchantRow = {
    merchant_id?: string;
    is_owner?: boolean;
    is_admin?: boolean;
};

export function currentMerchantId(): string {
    return (localStorage.getItem('merchant_id') || '').trim();
}

export function canManageStoreAndDishes(): boolean {
    const mid = currentMerchantId();
    let list: MerchantRow[] = [];
    try {
        list = JSON.parse(localStorage.getItem('merchant') || '[]');
    } catch {
        list = [];
    }
    if (!Array.isArray(list) || list.length === 0) {
        // 无法判断时不开放管理入口，避免普通收银误进
        return false;
    }
    const hit = mid
        ? list.find((row) => String(row.merchant_id || '') === mid)
        : list.find((row) => row.is_owner || row.is_admin) || list[0];
    if (!hit) return false;
    return Boolean(hit.is_owner || hit.is_admin);
}
