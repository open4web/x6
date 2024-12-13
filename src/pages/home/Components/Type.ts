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
}

export interface PropsOptions  {
    name: string;
    id: string;
    spiceOptions: SpiceOptions[];
}

export interface SpiceOptions  {
    id: string;
    name: string;
    price: number;
}

export interface ProductCategory {
    id: string;
    name: string;
}