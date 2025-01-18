import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Slide,
    Table,
    TableBody,
    TableRow,
    Typography,
} from '@mui/material';
import TableCell from '@mui/material/TableCell';
import {TransitionProps} from '@mui/material/transitions';
import {useFetchData} from '../../../common/FetchData';
import {FormatTimestampAsTime} from '../../../utils/time';
import MyOrderDetail from '../../../common/MyOrderDetail';
import PayChannel from '../../../common/PayChannel';
import {Order} from './types';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import CancelIcon from '@mui/icons-material/Cancel';
import {isOrderExpired} from "../../../utils/expireStore";
import {MyOrderSkeleton} from "../../../common/MyOrderSkeleton";

const statusColors = ['#ffe0b2', '#c5e1a5']; // OrderInit, OrderPaid

function getStatusColor(status: number) {
    return statusColors[status] || '#ffffff';
}

interface MyOrderProps {
    orderNo?: string;
    phoneNumber?: string;
    status?: number;
    startDate?: string;
    endDate?: string;
}

function generateQueryParams({ orderNo, status, startDate, endDate }: MyOrderProps) {
    const queryParams: Record<string, string | number> = {};

    if (orderNo) {
        queryParams.order_no = orderNo; // 如果有 orderNo，仅返回 orderNo
    } else {
        if (status !== undefined && status !== null) {
            queryParams.status = status; // 添加状态过滤
        }
        if (startDate) {
            queryParams.start_gte = startDate; // 添加开始时间
        }
        if (endDate) {
            queryParams.end_lte = endDate; // 添加结束时间
        }
    }

    return queryParams;
}

function MyOrder({ orderNo, phoneNumber, status, startDate, endDate }: MyOrderProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [viewMode, setViewMode] = useState('list');
    const [loading, setLoading] = useState<boolean>(true); // 添加加载状态
    const [openPayChannel, setOpenPayChannel] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // 保存选中的订单
    const [openOrderDetail, setOpenOrderDetail] = useState(false); // 是否展示详情对话框
    const [openOrderDetailWithReason, setOpenOrderDetailWithReason] = useState('订单详情'); // 是否展示详情对话框
    const [detailOrder, setDetailOrder] = useState<Order | null>(null); // 当前详情订单
    const [highlightOrderId, setHighlightOrderId] = useState(''); // 高亮订单 ID
    const { fetchData, alertComponent } = useFetchData();

    useEffect(() => {
        // 每次请求都先设定加载骨架
        setLoading(true)
        // 如果 orderNo 存在并且长度小于 13，则不触发请求
        if (orderNo && orderNo.length < 17) {
            // P20250113230928ME
            console.log("订单号长度不足，未触发请求");
            return;
        }
        const queryParams = generateQueryParams({ orderNo, phoneNumber, status, startDate, endDate });
        fetchData(
            '/v1/order/pos',
            (response) => {
                setOrders(response);
                // 高亮最新订单
                if (response?.length > 0) {
                    const newestOrder = response[0];
                    if (!isOrderExpired(newestOrder.identity.order_no, 10000)) {
                        setHighlightOrderId(newestOrder.identity.order_no);
                        setTimeout(() => setHighlightOrderId(''), 2000); // 2 秒后清除高亮
                    }
                    setLoading(false); // 加载完成
                }
            },
            'GET',
            queryParams,
        ).catch(() => {
            console.log('Failed to fetch data.');
            setLoading(false); // 加载失败
        });
    }, [status, startDate, endDate, orderNo]);

    const handleClosePayChannel = () => {
        setOpenPayChannel(false);
        setSelectedOrder(null); // 清除已选中的订单
    };

    const handleContinuePay = (order: Order) => {
        setSelectedOrder(order); // 设置当前选中的订单
        setOpenPayChannel(true);
    };

    const handleOrderDetail = (order: Order) => {
        setDetailOrder(order); // 设置当前选中的详情订单
        setOpenOrderDetail(true);
    };

    // 对于已支付但未出餐的可以快速申请取消
    // 申请取消后系统会通知后台进行审批退款
    const handleOrderCancel = (order: Order) => {
        console.log("正在申请快速取消订单")
        setDetailOrder(order); // 设置当前选中的详情订单
        setOpenOrderDetail(true);
        setOpenOrderDetailWithReason("订单快速取消")
    };

    const handleOrderDetailClose = () => {
        setOpenOrderDetail(false);
        setDetailOrder(null); // 清除详情订单
    };

    return (
        <Container>
            <Box sx={{overflowX: 'auto', display: 'flex', flexWrap: 'nowrap', gap: 1}}>
                {alertComponent}
                {loading
                    ? Array.from({ length: 4 }).map((_, index) => MyOrderSkeleton(index))
                    : orders?.map((order) => (
                        <Box key={order.id} sx={{ flexShrink: 0, width: 300 }}>
                            <Card
                                variant="outlined"
                                sx={{
                                    backgroundColor: getStatusColor(order.status),
                                    boxShadow: 3,
                                    padding: 0,
                                    borderRadius: 1,
                                    border: highlightOrderId === order?.identity?.order_no ? '3px solid #FF5722' : '1px solid transparent',
                                    animation: highlightOrderId === order?.identity?.order_no ? 'flash 0.5s ease-in-out 4' : 'none',
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#3e2723',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box>
                                            {`#${order?.identity?.order_no}`}
                                            {order?.identity?.table_no && (
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 'normal',
                                                        color: '#6d4c41',
                                                        marginLeft: 1,
                                                    }}
                                                >
                                                    {`@${order?.identity?.table_no}`}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Typography>
                                    <Box sx={{ height: 100, overflowY: 'auto' }}>
                                        <Table size="small" aria-label="buckets table">
                                            <TableBody>
                                                {order.buckets?.map((bucket) => (
                                                    <TableRow key={bucket.id}>
                                                        <TableCell align="left" sx={{ color: '#333333', padding: '2px 4px' }}>
                                                            {bucket.name}
                                                        </TableCell>
                                                        <TableCell align="left" sx={{ color: '#333333', padding: '2px 4px' }}>
                                                            {`${bucket.number} ${bucket.unit}`}
                                                        </TableCell>
                                                        <TableCell align="left" sx={{ color: '#333333', padding: '2px 4px' }}>
                                                            {`¥${bucket.price}`}
                                                        </TableCell>
                                                        <TableCell align="left" sx={{ color: '#333333', padding: '2px 4px', fontSize: 8 }}>
                                                            {bucket.props_text}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Typography component="span" variant="body1" sx={{ fontWeight: 'normal', color: '#3e2723', marginLeft: 1 }}>
                                        {FormatTimestampAsTime(order.stp.created_at)}
                                    </Typography>
                                    {order?.status === 0 && (
                                        <Button size="large" color="info" onClick={() => handleContinuePay(order)}>
                                            支付
                                        </Button>
                                    )}
                                    {order?.status > 0 && (
                                        <Button size="large" color="primary">
                                            退款
                                        </Button>
                                    )}
                                    {order?.status === 1 && (
                                        <IconButton aria-label="delete" size="large" color="error" onClick={() => handleOrderCancel(order)}>
                                            <CancelIcon />
                                        </IconButton>
                                    )}
                                    <IconButton aria-label="delete" size="large" color="success" onClick={() => handleOrderDetail(order)}>
                                        <ExpandCircleDownIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
            </Box>

            {/* 订单详情对话框 */}
            {detailOrder && (
                <MyOrderDetail open={openOrderDetail} orderData={detailOrder} onClose={handleOrderDetailClose} openOrderDetailWithReason={openOrderDetailWithReason}/>
            )}

            {/* 支付渠道对话框 */}
            {selectedOrder && (
                <Dialog
                    open={openPayChannel}
                    fullWidth={true}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClosePayChannel}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>
                        <Typography variant="h6" align="center">订单号: {selectedOrder.identity?.order_no}</Typography>
                        <Typography variant="subtitle1" align="center" color="text.secondary">
                            待支付金额: <span style={{ color: "#d32f2f", fontWeight: "bold" }}>¥{selectedOrder?.price?.pay_price.toFixed(2)}</span>
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <PayChannel
                            setCart={null}
                            price={selectedOrder?.price?.pay_price}
                            setOpen={setOpenPayChannel}
                            orderID={selectedOrder?.identity?.order_no}
                            at={selectedOrder?.merchant?.id}
                        />
                    </DialogContent>
                    <DialogActions/>
                </Dialog>
            )}
        </Container>
    );
}

export default MyOrder;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// 添加 CSS 样式
const styles = `
@keyframes flash {
    0% { border-color: #FF5722; }
    50% { border-color: transparent; }
    100% { border-color: #FF5722; }
}
`;

const styleTag = document.createElement('style');
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);