import * as React from 'react';
import {Badge, Box, CircularProgress, Fab, Grid, Paper, Typography} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import MyProducts from "../home/Components/MyProducts";
import { toast } from "react-toastify";
import {useTranslate} from 'react-admin';
import MyCartDrawer from "../home/Components/MyCartDrawer";
import { useCartContext } from "../../dataProvider/MyCartProvider";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GradingIcon from '@mui/icons-material/Grading';
import MyOrderDrawer from "../home/Components/MyOrderDrawer";
import {CartItem} from "../../common/types";
import {useCallback, useEffect, useRef, useState} from "react";
import MyDataDrawer from "./MyDataDrawer";
import RechargeCardSelector from "../../common/RechargeCardSelector";
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import HandoverPageDrawer from "../Shift/Handover";
import {OrderListWatcher, PaymentWatcher} from "../../common/OrderPulling";
import OrderFlyOverlay from "../home/Components/OrderFlyOverlay";

export const MyHome = () => {
    const {
        cartItems, setCartItems, setDrawerOpen, setOrderDrawerOpen, dataDrawerOpen,
        orderFlyEvent, orderDrawerOpen, startOrderListSync, orderSyncStatus, orderSyncProgress,
        resetOrderSync, ready, clearOrderFlyEvent,
    } = useCartContext();
    const translate = useTranslate();
    const [clearCartSignal, setClearCartSignal] = useState(false);
    const [rechargeOpen, setRechargeOpen] = useState(false);
    const [inboundOrders, setInboundOrders] = useState(0);
    const [fabPulse, setFabPulse] = useState(false);
    const orderFabRef = useRef<HTMLButtonElement>(null);

    const guardOrdering = () => {
        if (ready) {
            return true;
        }
        toast.warning(translate('pos.lock.toast'), {position: 'top-center', autoClose: 2200});
        return false;
    };

    const handleClick = (item: CartItem) => {
        if (!guardOrdering()) {
            return;
        }
        setDrawerOpen(true);

        // 检查购物车中是否已存在该商品
        const existingItem = cartItems.find((cartItem: CartItem) => cartItem.id === item.id && cartItem.desc === item.desc);

        if (existingItem ) {

            // TODO 如果同一款产品属性不一样则按照新item加入购物车
            // 商品已存在，增加数量
            setCartItems((prevCart) =>
                prevCart.map((cartItem: CartItem) =>
                    cartItem.id === item.id && cartItem.desc === item.desc
                        ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
                        : cartItem
                )
            );
            console.log("increment quantity", cartItems)
            toast.success(translate('pos.cart.qty_up', {name: item.name}), { position: "top-center", autoClose: 2000 });
        } else {
            // 商品不存在，首次添加到购物车
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
            toast.success(translate('pos.cart.added'), { position: "top-center", autoClose: 2000 });
        }
    };

    // clearCartSignal
    // 当 cartItems 为空时，触发 clearCartSignal
    useEffect(() => {
        if (cartItems.length === 0) {
            setClearCartSignal(true); // 触发信号
        } else {
            setClearCartSignal(false); // 重置信号
        }
    }, [cartItems]);

    useEffect(() => {
        if (orderDrawerOpen) {
            setInboundOrders(0);
            if (orderSyncStatus === 'ready') {
                const timer = window.setTimeout(() => resetOrderSync(), 400);
                return () => window.clearTimeout(timer);
            }
        }
    }, [orderDrawerOpen, orderSyncStatus, resetOrderSync]);

    const handleOrderArrived = useCallback((orderNo: string, kind?: string) => {
        if (kind === 'paid' || !kind) {
            setInboundOrders(count => count + 1);
            setFabPulse(true);
            window.setTimeout(() => setFabPulse(false), 700);
            startOrderListSync(orderNo);
        }
        clearOrderFlyEvent();
    }, [startOrderListSync, clearOrderFlyEvent]);

    return (
        <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={12}>
                <React.Fragment>
                    <PaymentWatcher />
                    <OrderListWatcher />
                    <MyCartDrawer />
                    <MyOrderDrawer/>
                    <MyDataDrawer/>
                    <OrderFlyOverlay
                        event={dataDrawerOpen && (!orderFlyEvent?.kind || orderFlyEvent.kind === 'paid') ? null : orderFlyEvent}
                        targetEl={orderFabRef.current}
                        onArrived={handleOrderArrived}
                    />
                    <HandoverPageDrawer/>
                    <RechargeCardSelector
                        modal={true}
                        open={rechargeOpen}
                        onClose={() => setRechargeOpen(false)}
                        onSuccess={(card) => {
                            console.log('已选择充值卡:', card);
                            // 刷新会员余额等
                        }}
                    />
                    {/* 仅在 dataDrawerOpen 为 false 时渲染以下部分 */}
                    {!dataDrawerOpen && (
                        <>
                            {!ready && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mb: 2,
                                        mx: 1,
                                        px: 2.5,
                                        py: 1.75,
                                        borderRadius: 2,
                                        border: '1px solid #ffe0b2',
                                        bgcolor: '#fff8e1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 2,
                                    }}
                                >
                                    <Box>
                                        <Typography sx={{fontWeight: 700, color: '#e65100'}}>
                                            {translate('pos.lock.title')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {translate('pos.lock.body')}
                                        </Typography>
                                    </Box>
                                </Paper>
                            )}
                            <Box
                                sx={{
                                    pointerEvents: ready ? 'auto' : 'none',
                                    filter: ready ? 'none' : 'grayscale(0.25)',
                                    opacity: ready ? 1 : 0.55,
                                }}
                            >
                                <MyProducts handleClick={handleClick} clearCartSignal={clearCartSignal} />
                            </Box>

                            {/* Floating Action Button */}
                            <Fab
                                aria-label="Expand"
                                color="inherit"
                                sx={{
                                    position: 'fixed',
                                    bottom: 16,
                                    right: 16,
                                    zIndex: 1000,
                                }}
                                onClick={() => setRechargeOpen(true)}
                            >
                                <AssuredWorkloadIcon fontSize="large" color={'info'} />
                            </Fab>
                            <Box
                                sx={{
                                    position: 'fixed',
                                    bottom: 80,
                                    right: 16,
                                    zIndex: 1000,
                                    width: 56,
                                    height: 56,
                                }}
                            >
                                {orderSyncStatus !== 'idle' && (
                                    <>
                                        <CircularProgress
                                            variant="determinate"
                                            value={100}
                                            size={56}
                                            thickness={2}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                color: 'rgba(0,0,0,0.12)',
                                                pointerEvents: 'none',
                                            }}
                                        />
                                        <CircularProgress
                                            variant="determinate"
                                            value={orderSyncStatus === 'ready' ? 100 : orderSyncProgress}
                                            size={56}
                                            thickness={2}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                color: orderSyncStatus === 'ready' ? '#2e7d32' : '#fb8c00',
                                                pointerEvents: 'none',
                                                '& .MuiCircularProgress-circle': {
                                                    transition: 'stroke-dashoffset 0.4s linear',
                                                },
                                            }}
                                        />
                                    </>
                                )}
                                <Fab
                                    ref={orderFabRef}
                                    aria-label="查看订单"
                                    color="inherit"
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        boxShadow: fabPulse ? '0 0 0 8px rgba(255,152,0,0.22)' : undefined,
                                    }}
                                    onClick={() => setOrderDrawerOpen(true)}
                                >
                                    {orderSyncStatus === 'ready' ? (
                                        <CheckIcon sx={{fontSize: 32, color: '#2e7d32'}} />
                                    ) : (
                                        <Badge badgeContent={orderSyncStatus === 'idle' ? inboundOrders : 0} color="error">
                                            <GradingIcon fontSize="large" color={'warning'} />
                                        </Badge>
                                    )}
                                </Fab>
                            </Box>
                            <Fab
                                aria-label="Expand"
                                color="inherit"
                                data-fly-target="cart"
                                sx={{
                                    position: 'fixed',
                                    bottom: 144,
                                    right: 16,
                                    zIndex: 1000,
                                }}
                                disabled={!ready}
                                onClick={() => {
                                    if (!guardOrdering()) {
                                        return;
                                    }
                                    setDrawerOpen(true);
                                }}
                            >
                                <ShoppingCartIcon fontSize="large" color={ready ? 'error' : 'disabled'} />
                            </Fab>
                        </>
                    )}
                </React.Fragment>
            </Grid>
        </Grid>
    );
};