import React, {createContext, useCallback, useContext, useRef, useState, ReactNode} from 'react';
import {toast} from 'react-toastify';
import {tPos} from '../i18n/t';
import {CartItem, CartItemHolder} from "../common/types";

export type OrderSyncStatus = 'idle' | 'syncing' | 'ready';

export type OrderFlyKind = 'paid' | 'hold' | 'resume';

export type OrderFlyEvent = {
    id: number;
    orderNo: string;
    startX: number;
    startY: number;
    kind?: OrderFlyKind;
    endX?: number;
    endY?: number;
};

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
    watchingOrderNo: string;
    highlightOrderNo: string;
    setHighlightOrderNo: React.Dispatch<React.SetStateAction<string>>;
    startPaymentWatch: (orderNo: string) => void;
    notifyOrderPaid: (orderNo: string) => void;
    orderFlyEvent: OrderFlyEvent | null;
    triggerOrderFly: (orderNo: string, opts?: {
        start?: {x: number; y: number};
        end?: {x: number; y: number};
        kind?: OrderFlyKind;
    }) => void;
    clearOrderFlyEvent: () => void;
    orderSyncStatus: OrderSyncStatus;
    orderSyncProgress: number;
    setOrderSyncProgress: React.Dispatch<React.SetStateAction<number>>;
    syncingOrderNo: string;
    startOrderListSync: (orderNo: string) => void;
    markOrderListReady: (orderNo: string) => void;
    resetOrderSync: () => void;
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
    const [watchingOrderNo, setWatchingOrderNo] = useState('');
    const [highlightOrderNo, setHighlightOrderNo] = useState('');
    const lastPaidRef = useRef('');

    const startPaymentWatch = useCallback((orderNo: string) => {
        if (!orderNo || lastPaidRef.current === orderNo) {
            return;
        }
        setWatchingOrderNo(orderNo);
    }, []);

    const [orderFlyEvent, setOrderFlyEvent] = useState<OrderFlyEvent | null>(null);

    const triggerOrderFly = useCallback((orderNo: string, opts?: {
        start?: {x: number; y: number};
        end?: {x: number; y: number};
        kind?: OrderFlyKind;
    }) => {
        setOrderFlyEvent({
            id: Date.now(),
            orderNo,
            startX: opts?.start?.x ?? window.innerWidth - 220,
            startY: opts?.start?.y ?? window.innerHeight / 2,
            endX: opts?.end?.x,
            endY: opts?.end?.y,
            kind: opts?.kind || 'paid',
        });
    }, []);

    const clearOrderFlyEvent = useCallback(() => {
        setOrderFlyEvent(null);
    }, []);

    const [orderSyncStatus, setOrderSyncStatus] = useState<OrderSyncStatus>('idle');
    const [orderSyncProgress, setOrderSyncProgress] = useState(0);
    const [syncingOrderNo, setSyncingOrderNo] = useState('');

    const notifyOrderPaid = useCallback((orderNo: string) => {
        if (!orderNo || lastPaidRef.current === orderNo) {
            return;
        }
        lastPaidRef.current = orderNo;
        toast.success(tPos('pay.success'), {position: "top-center", autoClose: 2000});
        setWatchingOrderNo('');
        setDrawerOpen(false);
        triggerOrderFly(orderNo, {
            start: {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            },
            kind: 'paid',
        });
    }, [triggerOrderFly]);

    const startOrderListSync = useCallback((orderNo: string) => {
        if (!orderNo) {
            return;
        }
        setSyncingOrderNo(orderNo);
        setOrderSyncStatus('syncing');
        setOrderSyncProgress(0);
    }, []);

    const markOrderListReady = useCallback((orderNo: string) => {
        setHighlightOrderNo(orderNo);
        setSyncingOrderNo('');
        setOrderSyncStatus('ready');
        setOrderSyncProgress(100);
    }, []);

    const resetOrderSync = useCallback(() => {
        setOrderSyncStatus('idle');
        setOrderSyncProgress(0);
        setSyncingOrderNo('');
    }, []);

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
            watchingOrderNo,
            highlightOrderNo,
            setHighlightOrderNo,
            startPaymentWatch,
            notifyOrderPaid,
            orderFlyEvent,
            triggerOrderFly,
            clearOrderFlyEvent,
            orderSyncStatus,
            orderSyncProgress,
            setOrderSyncProgress,
            syncingOrderNo,
            startOrderListSync,
            markOrderListReady,
            resetOrderSync,
        }}>
            {children}
        </CartContext.Provider>
    );
};