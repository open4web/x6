import React from 'react';
import {Box, Button, Divider, ListItemButton, ListItemText, Paper, Typography} from '@mui/material';
import {useCartContext} from "../dataProvider/MyCartProvider";
import {CartItemHolder} from "./types";
import {useTranslate} from 'react-admin';

type HoldOrderPageProps = {
    open: boolean;
};

export default function HoldOrderPage({ open }: HoldOrderPageProps) {
    const translate = useTranslate();
    // 指定 cartItems 的类型为 CartItem[]
    const { setCartItems, setDrawerOpen, holdOrders, setHoldOrders, triggerOrderFly, orderFlyEvent } = useCartContext();
    const [pulseId, setPulseId] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (orderFlyEvent?.kind === 'hold') {
            const id = Number(orderFlyEvent.orderNo);
            if (Number.isFinite(id)) {
                setPulseId(id);
                const timer = window.setTimeout(() => setPulseId(null), 900);
                return () => window.clearTimeout(timer);
            }
        }
    }, [orderFlyEvent?.id, orderFlyEvent?.kind, orderFlyEvent?.orderNo]);

    // 删除订单的处理函数
    const handleDeleteOrder = (orderId: number) => {
        // 过滤掉被删除的订单
        const updatedOrders = holdOrders.filter(order => order.id !== orderId);

        // 更新状态和 localStorage
        setHoldOrders(updatedOrders);
        localStorage.setItem("holdOrders", JSON.stringify(updatedOrders));
    };


    const handleContinueOrder = (order: CartItemHolder, event?: React.MouseEvent) => {
        triggerOrderFly(String(order.id), {
            start: {
                x: event?.clientX ?? 48,
                y: event?.clientY ?? 180,
            },
            kind: 'resume',
        });
        setCartItems(order.cartItems);
        setDrawerOpen(true);
        handleDeleteOrder(order.id);
    };


    return (
        <Box
            data-fly-target="hold"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'left',
                padding: 0,
                maxHeight: '100vh',
                overflowY: 'auto',
                bgcolor: 'background.default',
            }}
        >
            {holdOrders.map((order: CartItemHolder) => (
                <Paper
                    key={order.id}
                    sx={{
                        width: '80%',
                        padding: 1,
                        marginBottom: 1,
                        borderRadius: 1,
                        boxShadow: 3,
                        background: 'white',
                        outline: pulseId === order.id ? '2px solid #42a5f5' : 'none',
                        animation: pulseId === order.id ? 'orderShake 0.28s ease-in-out 2' : 'none',
                    }}
                >
                    {open ? (
                        // 展开显示详细信息
                        <>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                #{order.id}
                            </Typography>
                            <Typography variant="body2">{order.createdAt}</Typography>
                            <Divider sx={{ my: 1, width: '100%' }} />

                            {order?.cartItems?.map((item) => (
                                <ListItemButton
                                    key={item.id}
                                    sx={{
                                        py: 0,
                                        minHeight: 32,
                                        color: 'darkorange',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                        }}
                                    >
                                        <ListItemText
                                            primary={item.name}
                                            primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <ListItemText
                                            primary={item.quantity}
                                            primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                        />
                                    </Box>
                                </ListItemButton>
                            ))}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 1,
                                    marginTop: 2,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        minWidth: '100px',
                                    }}
                                    onClick={() => handleDeleteOrder(order.id)} // 点击时调用删除函数
                                >
                                    {translate('pos.keypad.delete')}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        minWidth: '100px',
                                    }}
                                    onClick={(event) => handleContinueOrder(order, event)}
                                >
                                    {translate('pos.cart.resume')}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        // 收起时仅显示 Order ID
                        <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                            #{order.id}
                        </Typography>
                    )}
                </Paper>
            ))}
        </Box>
    );
}