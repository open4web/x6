import React from 'react';
import {Box, Paper, Typography, Button, Divider, ListItemButton, ListItemText} from '@mui/material';
import {CartItemHolder} from "../pages/home/Components/MyCart";

type Order = {
    id: number;
    item: string;
    quantity: number;
    price: string;
    status: string;
};

type HoldOrderPageProps = {
    open: boolean;
};

export default function HoldOrderPage({ open }: HoldOrderPageProps) {
    // 获取当前已存储的 holdOrders 列表（如果不存在，返回空数组）
    const holdOrders = JSON.parse(localStorage.getItem("holdOrders") || "[]");


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'left',
                padding: 0,
                maxHeight: '100vh', // Limit height for scrolling
                overflowY: 'auto', // Enable vertical scrolling
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
                        // Show full details when open
                        <>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Order #{order.id}
                            </Typography>
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
                            <Typography variant="body1">{order.createdAt}</Typography>
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
                                >
                                    继续
                                </Button>
                            </Box>
                        </>
                    ) : (
                        // Show only Order ID when closed
                        <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                            #{order.id}
                        </Typography>
                    )}
                </Paper>
            ))}
        </Box>
    );
}