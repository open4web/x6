import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Container,
    List,
    ListItem,
    ListItemText,
    TableContainer,
    Table, TableHead, TableRow, TableBody, Paper
} from '@mui/material';
import dayjs from 'dayjs';
import { useFetchData } from "../../../common/FetchData";
import TableCell from "@mui/material/TableCell";

// 订单状态定义
const statusColors = [
    '#ffe0b2', // OrderInit
    '#c5e1a5', // OrderPaid
    '#ffcc80', // OrderMaking
    '#80deea', // OrderProduceCompleted
    '#c8e6c9', // OrderCompleted
    '#ff8a80', // OrderCancel
    '#f48fb1', // OrderCancelApproved
    '#f1f8e9', // OrderCancelCompleted
    '#fff59d', // OrderTakeoutPending
    '#ffb74d', // OrderTakeoutConfirmed
    '#e57373', // OrderTakeoutUnConfirmed
    '#81c784', // OrderTakeoutTake
    '#4caf50', // OrderTakeoutDone
    '#f06292', // OrderTakeoutComment
    '#d32f2f', // OrderClosed
];

// 定义 `buckets` 的数据类型
type Bucket = {
    id: string;
    name: string;
    number: number;
    price: number;
    origin_amount: string;
    unit: string;
    props_id: number[];
    props_text: string;
};

// 更新订单数据类型，增加 `buckets` 字段
type Order = {
    id: string;
    identity: {
        order_no: string;
        table_no: string;
        pay_price: number;
    };
    status: number; // 订单状态数字
    date: string;
    buckets: Bucket[]; // 商品列表
};

// 模拟订单数据（包含 `buckets` 字段）
const ordersData: Order[] = [
    {
        id: '1',
        identity: { order_no: 'ORD001', table_no: 'T01', pay_price: 100 },
        status: 0,
        date: dayjs().format('YYYY-MM-DD'),
        buckets: [
            { id: '1', name: 'Apple iPhone 14', number: 1, price: 100, origin_amount: '1000', unit: 'pcs', props_id: [1, 2], props_text: 'Color: Red' }
        ]
    },
    {
        id: '2',
        identity: { order_no: 'ORD002', table_no: 'T02', pay_price: 150 },
        status: 1,
        date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        buckets: [
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' }
        ]
    },
    {
        id: '3',
        identity: { order_no: 'ORD001', table_no: 'T01', pay_price: 100 },
        status: 0,
        date: dayjs().format('YYYY-MM-DD'),
        buckets: [
            { id: '1', name: 'Apple iPhone 14', number: 1, price: 100, origin_amount: '1000', unit: 'pcs', props_id: [1, 2], props_text: 'Color: Red' }
        ]
    },
    {
        id: '4',
        identity: { order_no: 'ORD002', table_no: 'T02', pay_price: 150 },
        status: 1,
        date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        buckets: [
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' },
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' },
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' },
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' },
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' },
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' }
        ]
    },
    {
        id: '6',
        identity: { order_no: 'ORD001', table_no: 'T01', pay_price: 100 },
        status: 0,
        date: dayjs().format('YYYY-MM-DD'),
        buckets: [
            { id: '1', name: 'Apple iPhone 14', number: 1, price: 100, origin_amount: '1000', unit: 'pcs', props_id: [1, 2], props_text: 'Color: Red' }
        ]
    },
    {
        id: '7',
        identity: { order_no: 'ORD002', table_no: 'T02', pay_price: 150 },
        status: 1,
        date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        buckets: [
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' },
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' },
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' },
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' },
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' },
            { id: '2', name: 'Samsung Galaxy S22', number: 1, price: 150, origin_amount: '1500', unit: 'pcs', props_id: [3, 4], props_text: 'Color: Blue' }
        ]
    },
    // 更多订单数据...
];

// 获取数据并设置状态
function MyOrder() {
    const [orders, setOrders] = useState<Order[]>(ordersData);
    const [viewMode, setViewMode] = useState('list');
    const fetchData = useFetchData();

    useEffect(() => {
        // 尝试从 API 获取数据
        fetchData('/v1/order/pos', (response) => {
            console.log("get order ==>", response);
            // 设置订单数据
            setOrders(response);
        }, "GET", {}).catch(() => {
            // 如果请求失败，使用模拟的订单数据
            console.log("Failed to fetch data, using example orders.");
            setOrders(ordersData);
        });
    }, []); // Empty dependency array ensures the effect runs only once

    // 切换展示模式
    const handleViewModeChange = (mode: string) => {
        setViewMode(mode);
    };

    // 根据订单状态返回对应的背景颜色
    function getStatusColor(status: number) {
        return statusColors[status] || '#ffffff'; // 默认背景为白色
    }

    return (
        <Container>
            {/* 订单列表展示，启用水平滚动 */}
            <Box sx={{ overflowX: 'auto', display: 'flex', flexWrap: 'nowrap', gap: 1}}>
                {orders?.map((order) => (
                    <Box key={order.id} sx={{ flexShrink: 0, width: 300}}>
                        <Card
                            variant="outlined"
                            sx={{
                                backgroundColor: getStatusColor(order.status), // 根据状态设置背景颜色
                                boxShadow: 3,
                                padding: 1,
                                borderRadius: 1
                            }}
                        >
                            <CardContent>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                                    {`#${order?.identity?.order_no}`}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6d4c41' }}>
                                    {`@:${order?.identity?.table_no}`}
                                </Typography>

                                {/* 商品详情部分 */}
                                <Box sx={{ height: 100, overflowY: 'auto' }}>
                                        <Table stickyHeader size="small" aria-label="buckets table">
                                            {/* 表头 */}
                                            {/* 表内容 */}
                                            <TableBody>
                                                {order.buckets?.map((bucket) => (
                                                    <TableRow key={bucket.id}>
                                                        <TableRow key={bucket.id}>
                                                            {/* 商品名称 */}
                                                            <TableCell sx={{ color: '#333333' }}>{bucket.name}</TableCell>
                                                            {/* 商品数量和单位 */}
                                                            <TableCell sx={{ color: '#333333' }}>{`${bucket.number} ${bucket.unit}`}</TableCell>
                                                            {/* 商品价格 */}
                                                            <TableCell sx={{ color: '#333333' }}>{`¥${bucket.price}`}</TableCell>
                                                        </TableRow>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                            </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Container>
    );
}

export default MyOrder;