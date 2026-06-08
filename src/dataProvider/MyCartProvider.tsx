import React, { createContext, useContext, useState, ReactNode } from 'react';
import {CartItem, CartItemHolder} from "../common/types";

type CartContextType = {
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    orderDrawerOpen: boolean;
    setOrderDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    holdOrders: CartItemHolder[];
    setHoldOrders: React.Dispatch<React.SetStateAction<CartItemHolder[]>>;
    setShowProductImage: React.Dispatch<React.SetStateAction<boolean>>;
    showProductImage: boolean;
    setMerchantId: React.Dispatch<React.SetStateAction<string>>;
    merchantId: string;

    dataDrawerOpen: boolean;
    setDataDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    loginStep: string;
    setLoginStep: React.Dispatch<React.SetStateAction<string>>;
    // 交接班
    shiftOpen: boolean;
    setShiftOpen: React.Dispatch<React.SetStateAction<boolean>>;
    // 是否开始工作统计
    ready: boolean;
    setReady: React.Dispatch<React.SetStateAction<boolean>>;
    startReady: number;
    setStartReady: React.Dispatch<React.SetStateAction<number>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};

export const MyCartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
    const [showProductImage, setShowProductImage] = useState(false);
    const [merchantId, setMerchantId] = useState(localStorage.getItem("current_store_id") || '')
    const [dataDrawerOpen, setDataDrawerOpen] = useState(false);
    const [loginStep, setLoginStep] = useState<string>('password')
    const [shiftOpen, setShiftOpen] = useState(false);
    // ==================== ready 本地存储初始化 ====================
    const [ready, setReady] = useState<boolean>(() => {
        const savedReady = localStorage.getItem("shiftReady:" + merchantId); // key 必须是与门店绑定
        return savedReady !== null ? JSON.parse(savedReady) : false;
    });
    const [startReady, setStartReady] = useState<number>(() => {
        const savedReady = localStorage.getItem("shiftReadyTime:" + merchantId); // key 必须是与门店绑定
        return savedReady !== null ? JSON.parse(savedReady) : false;
    });

    // 从 localStorage 初始化 holdOrders 列表
    const [holdOrders, setHoldOrders] = useState<CartItemHolder[]>(
        JSON.parse(localStorage.getItem("holdOrders") || "[]")
    );
    return (
        <CartContext.Provider value={{ cartItems, setCartItems,
            drawerOpen, setDrawerOpen,
            holdOrders, setHoldOrders,
            orderDrawerOpen, setOrderDrawerOpen,
            showProductImage,
            setShowProductImage,
            setMerchantId,
            merchantId,
            dataDrawerOpen,
            setDataDrawerOpen,
            loginStep,
            setLoginStep,
            setShiftOpen,
            shiftOpen,
            ready,
            setReady,
            startReady,
            setStartReady,
        }}>
            {children}
        </CartContext.Provider>
    );
};