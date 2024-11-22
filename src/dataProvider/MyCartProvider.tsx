import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from '../pages/home/Components/MyCart';

type CartContextType = {
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, drawerOpen, setDrawerOpen }}>
            {children}
        </CartContext.Provider>
    );
};