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
};

// 更新订单数据类型，增加 `buckets` 字段
export type Order = {
    id: string;
    stp: {
        created_at: number;
    },
    identity: {
        order_no: string;
        table_no: string;
        pay_price: number;
    };
    price: {
        pay_price: number;
    },
    status: number; // 订单状态数字
    date: string;
    buckets: Bucket[]; // 商品列表
};