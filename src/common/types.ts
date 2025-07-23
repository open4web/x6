import * as React from "react";
import {PropsOptions} from "../pages/home/Components/Type";

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
    price: number;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    propsOptions: MyProductProps[];
    spiceOptions: PropsOptions[];
    desc: string;
    combName: string;
    combID: string;
    // 当不是套餐当时候，使用kindName
    kindName: string;
    // 套餐的价格
    combPrice: number;
    combRequestItems: { id: string; quantity: number }[];
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