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
    // 从 localStorage 初始化 holdOrders 列表
    const [holdOrders, setHoldOrders] = useState<CartItemHolder[]>(
        JSON.parse(localStorage.getItem("holdOrders") || "[]")
    );
    return (
        <CartContext.Provider value={{ cartItems, setCartItems, drawerOpen, setDrawerOpen, holdOrders, setHoldOrders, orderDrawerOpen, setOrderDrawerOpen }}>
            {children}
        </CartContext.Provider>
    );
};