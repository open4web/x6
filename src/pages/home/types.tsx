interface Meta {
    namespace: string;
    merchant_id: string;
    founder: string;
    updater: string;
    account_id: string;
    created_at: string;
    updated_at: string;
    created_time: number;
    updated_time: number;
    status: boolean;
    deleted: boolean;
    access_level: number;
}

interface Context {
    // 根据实际上下文数据结构补充
    [key: string]: any;
}

interface ComboItem {
    combName: string;
    price: number;
    requires: number; // 需要选择的数量
    products: string[]; // 可选商品列表
}

export interface ComboGroup {
    _: {
        meta: Meta;
        context: Context;
    };
    id: string;
    is_show_backstage: number;
    sort: number;
    goods_type: number;
    is_sell: boolean;
    icon: string;
    products: string[];
    goods_list: null;
    stores: null;
    update_type: number;

    name: string; // 套餐唯一标识
    discount: number; // 套餐优惠金额
    price: number;
    combo: ComboItem[]; // 套餐包含的组合项
}

export interface MatchedCombo {
    groupId: string;
    count: number;
    matchedItems: {
        comboName: string;
        matchedProducts: string[];
        requires: number;
        price: number;
    }[];
    discount: number;
    price: number;
}

export interface ComboMatchResult {
    matchedGroups: MatchedCombo[]; // 匹配成功的套餐组
    totalDiscount: number; // 总优惠金额
    usedProductIds: Set<string>; // 已使用的商品ID（避免重复使用）
    price: number;
    count: number;
}
