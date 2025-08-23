export type MerchantLbs = {
    longitude: number;
    latitude: number;
}

export type Merchant = {
    mobile: string;
    name: string;
    id: string;
    address: string;
    lbs: MerchantLbs;
}

export type Customer = {
    mobile: string;
    name: string;
    id: string;
    account: string;
    avatar: string;
}

export type Price = {
    original_price: string;
    sale_price: string;
    reduced_price: string;
    retail_price: string;
    pay_price: number;
}

export type Workflow = {
    label: string;
    description: string;
    operator: string;
    operator_id: string;
}

export type STP = {
    created_at: number;
    pay_at: number;
    payed_at: number;
    review_at: number;
    completed_at: number;
    closed_at: number;
}

// 定义 `buckets` 的数据类型
export type Bucket = {
    id: string;
    name: string;
    number: number;
    price: number;
    origin_amount: string;
    unit: string;
    props_id: number[];
    props_text: string;
    status: number;
};

// 更新订单数据类型，增加 `buckets` 字段
export type Order = {
    id: string;
    stp: STP,
    identity: {
        order_no: string;
        table_no: string;
    };
    merchant: Merchant,
    status: number; // 订单状态数字
    date: string;
    buckets: Bucket[]; // 商品列表
    customer: Customer;
    pay: Record<string, any>;
    price: Price;
    workflow: Workflow[];
    refundReason: string;
    refund_summary: {
        total_amount: number;
        total_times: number;
    };
};