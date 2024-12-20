import React, { useState } from 'react';
import { Card, CardContent, Typography, ButtonGroup, ToggleButton, Box, Container } from '@mui/material';
import dayjs from 'dayjs';

// 模拟订单数据
const ordersData = [
    { id: 1, product: 'Apple iPhone 14', quantity: 1, status: 'Pending', date: dayjs().format('YYYY-MM-DD') },
    { id: 2, product: 'Samsung Galaxy S22', quantity: 2, status: 'Shipped', date: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
    { id: 3, product: 'MacBook Pro', quantity: 1, status: 'Delivered', date: dayjs().subtract(2, 'days').format('YYYY-MM-DD') },
    { id: 4, product: 'Google Pixel 6', quantity: 1, status: 'Pending', date: dayjs().subtract(3, 'days').format('YYYY-MM-DD') },
    { id: 5, product: 'OnePlus 9', quantity: 1, status: 'Shipped', date: dayjs().subtract(4, 'days').format('YYYY-MM-DD') },
    { id: 6, product: 'Huawei P50', quantity: 1, status: 'Delivered', date: dayjs().subtract(5, 'days').format('YYYY-MM-DD') },
    { id: 7, product: 'Xiaomi Mi 11', quantity: 1, status: 'Pending', date: dayjs().subtract(6, 'days').format('YYYY-MM-DD') },
    { id: 8, product: 'Oppo Find X3', quantity: 1, status: 'Shipped', date: dayjs().subtract(7, 'days').format('YYYY-MM-DD') },
    // 可以继续扩展更多订单数据...
];

function MyOrder() {
    const [orders, setOrders] = useState(ordersData);
    const [viewMode, setViewMode] = useState('list');

    // 切换展示模式
    const handleViewModeChange = (mode: React.SetStateAction<string>) => {
        setViewMode(mode);
    };

    return (
        <Container>
            {/* 订单列表展示，启用水平滚动 */}
            <Box sx={{ overflowX: 'auto', display: 'flex', flexWrap: 'nowrap', gap: 1 }}>
                {orders.map((order) => (
                    <Box key={order.id} sx={{ flexShrink: 0, width: 300 }}>
                            <Card variant="outlined" sx={{ backgroundColor: '#f4f1e1', boxShadow: 3, padding: 1, borderRadius: 1 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                                        {`Order #${order.id}`}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6d4c41' }}>
                                        {`Product: ${order.product}`}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6d4c41' }}>
                                        {`Quantity: ${order.quantity}`}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6d4c41' }}>
                                        {`Status: ${order.status}`}
                                    </Typography>
                                </CardContent>
                            </Card>

                    </Box>
                ))}
            </Box>
        </Container>
    );
}

export default MyOrder;