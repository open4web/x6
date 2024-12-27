import * as React from "react";

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

export interface MyProductProps {
    id: string;
    name: string;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    propsOptions: MyProductProps[];
}

export interface MyCartProps {
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export interface CartItemHolder {
    id: number;
    createdAt: string;
    cartItems: CartItem[];
}