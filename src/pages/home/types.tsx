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

export interface ComboItem {
    combName: string;
    price: number;
    requires: number;
    quantity?: number;
    products: string[];
}

export interface ComboGroup {
    id: string;
    name: string;
    price: number;
    discount?: number;
    icon?: string;
    is_sell?: boolean;
    products?: string[];
    combo: ComboItem[];
}


