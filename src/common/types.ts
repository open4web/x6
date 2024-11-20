export interface LoginInput {
    phone?: string;
    password?: string;
    step?: number;
    status?: number;
}

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