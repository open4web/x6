// 定义常量对象
export const ChannelType = {
    Default: 0,
    WeChatPay: 1,
    KalaPay: 2,
    AliPay: 3,
    CashPay: 4,
    UniPay: 5,
    BalancePay: 6,
} as const;

const paymentChannel: number = ChannelType.WeChatPay |  ChannelType.KalaPay |  ChannelType.AliPay;

export interface ScanPayRequest {
    channel: typeof paymentChannel; // 假设 cst.ChannelType 被转换为了 string 类型
    order_id: string;
    desc: string;
    amount: number;
    at?: string; // 可选属性需要添加 "?" 符号
    code: string;
}

export interface OrderRequest {
    at: string; // 订单下单位置
    buckets: Buckets[];
    pick: number; // 取餐方式
    seat: string; // 座位
    ticket: string; // 台号
    people: string;
    phone: string;
}

export interface Buckets {
    ID: string;
    Number: number;
    // OriginAmount: string;
    Price: Number;
    // Unit: string;
    // Property: PropertyInfo[];
    // Image: string;
    // Amount: string;
    Name: string;
}

export interface OrderResp {
    identity: IdentityInfo;
    result_code: string;
    price: number;
}

export interface IdentityInfo {
    // 备注信息 （后台管理员操作）
    remark: string;
    // 脚注信息（客户提交）
    postscript: string;
    // 排队序号 （自动生成）
    sort_num: string;
    // 订单号 （自动生成）
    order_no: string;
    // 座位号 (自主选择/店铺分配）
    table_no: string;
    // 当前排队号
    current_pos: number;
}

export interface DetailsProps {
    handleClick: (item: any) => void;
    clearCartSignal: boolean; // 用于清空购物车时重置状态
}

export interface Resp {
    categories: ProductCategory[];
    products: ProductItem[];
}

// Define the type for your data
export interface ProductItem {
    id: string;
    img: string;
    name: string;
    quantity: number;
    price: number;
    kind: string;
    desc: string;
    // Add more properties as needed
    spiceOptions: PropsOptions[];
    menu: string[];
    stock: number;
    CombID: string;
    maxLimit: number;
    combIndex: number;
}

export interface PropsOptions  {
    name: string;
    id: string;
    spiceOptions: SpiceOptions[];
    multipleSelection: boolean;
}

export interface SpiceOptions  {
    id: string;
    name: string;
    price: number;
}

export interface ProductCategory {
    id: string;
    name: string;
    product_id_list: string[]; // 可选字段，存储关联产品的 ID
}

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
    // 你可以根据实际需要扩展此类型
}

export interface MenuData {
    _: {
        meta: Meta;
        context: Context;
    };
    id: string;
    name: string;
    is_show_backstage: number;
    sort: number;
    goods_type: number;
    is_sell: boolean;
    icon: string;
    products: string[];  // 商品ID列表
    goods_list: any | null;  // 可以根据需要进一步定义类型
    stores: any | null;  // 可以根据需要进一步定义类型
    update_type: number;
    combo: any | null;  // 根据需要进一步定义
    isComboMode: boolean;
}