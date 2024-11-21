import React from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';

type Order = {
    id: number;
    item: string;
    quantity: number;
    price: string;
    status: string;
};

const orders: Order[] = [
    {
        id: 1,
        item: "Coffee",
        quantity: 2,
        price: "$5.00",
        status: "Pending Payment",
    },
    {
        id: 2,
        item: "Sandwich",
        quantity: 1,
        price: "$8.00",
        status: "Pending Payment",
    },
    {
        id: 3,
        item: "Cake Slice",
        quantity: 3,
        price: "$12.00",
        status: "Pending Payment",
    },
    // Add more orders here
    {
        id: 4,
        item: "Coffee",
        quantity: 2,
        price: "$5.00",
        status: "Pending Payment",
    },
    {
        id: 5,
        item: "Sandwich",
        quantity: 1,
        price: "$8.00",
        status: "Pending Payment",
    },
    {
        id: 6,
        item: "Cake Slice",
        quantity: 3,
        price: "$12.00",
        status: "Pending Payment",
    },
    {
        id: 7,
        item: "Coffee",
        quantity: 2,
        price: "$5.00",
        status: "Pending Payment",
    },
    {
        id: 8,
        item: "Sandwich",
        quantity: 1,
        price: "$8.00",
        status: "Pending Payment",
    },
    {
        id: 9,
        item: "Cake Slice",
        quantity: 3,
        price: "$12.00",
        status: "Pending Payment",
    },
];

type HoldOrderPageProps = {
    open: boolean;
};

export default function HoldOrderPage({ open }: HoldOrderPageProps) {
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
            {orders.map((order) => (
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
                            <Typography variant="body1">Item: {order.item}</Typography>
                            <Typography variant="body1">Quantity: {order.quantity}</Typography>
                            <Typography variant="body1">Price: {order.price}</Typography>
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
                                    Cancel
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
                                    Pay Now
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