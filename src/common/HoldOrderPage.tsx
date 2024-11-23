import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Divider, ListItemButton, ListItemText } from '@mui/material';
import {CartItem, CartItemHolder} from "../pages/home/Components/MyCart";
import {useCartContext} from "../dataProvider/MyCartProvider";

type HoldOrderPageProps = {
    open: boolean;
};

export default function HoldOrderPage({ open }: HoldOrderPageProps) {
    // 指定 cartItems 的类型为 CartItem[]
    const { setCartItems, setDrawerOpen,holdOrders, setHoldOrders } = useCartContext();

    // 删除订单的处理函数
    const handleDeleteOrder = (orderId: number) => {
        // 过滤掉被删除的订单
        const updatedOrders = holdOrders.filter(order => order.id !== orderId);

        // 更新状态和 localStorage
        setHoldOrders(updatedOrders);
        localStorage.setItem("holdOrders", JSON.stringify(updatedOrders));
    };


    const handleContinueOrder = (order: CartItemHolder) => {
        setCartItems(order.cartItems);
        setDrawerOpen(true);
    };


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'left',
                padding: 0,
                maxHeight: '100vh', // 限制高度以支持滚动
                overflowY: 'auto', // 启用垂直滚动
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
                                        color: 'rgba(255,255,255,.8)',
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
                                    删除
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        minWidth: '100px',
                                    }}
                                    onClick={() => handleContinueOrder(order)}
                                >
                                    继续
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