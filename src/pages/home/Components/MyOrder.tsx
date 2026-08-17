import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent, Chip,
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
import MyOrderDetail, {OpenReason} from '../../../common/MyOrderDetail';
import PaymentDialog from '../../../common/PaymentDialog';
import {Order} from './types';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import SubscriptIcon from '@mui/icons-material/Subscript';
import CancelIcon from '@mui/icons-material/Cancel';
import {isOrderExpired} from "../../../utils/expireStore";
import {MyOrderSkeleton} from "../../../common/MyOrderSkeleton";
import { orderStatusMap } from '../../../common/orderStatus';
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {useTranslate} from 'react-admin';

const statusColors = ['#ffe0b2', '#c5e1a5']; // OrderInit, OrderPaid

function getStatusColor(status: number) {
    return statusColors[status] || '#ffffff';
}

interface MyOrderProps {
    orderNo?: string;
    phoneNumber?: string;
    status?: number;
    source?: number;
    startDate?: string;
    endDate?: string;
    onlyMyOrder?: boolean;
    setTotalRecord: React.Dispatch<React.SetStateAction<number>>; // 用于更新 open 状态的函数
    saleStatus?: number;
}

function generateQueryParams({ orderNo, status, startDate, endDate, source , onlyMyOrder, saleStatus}: MyOrderProps) {
    const queryParams: Record<string, string | number> = {};
    console.log("onlyMyOrder===>", onlyMyOrder)

    if (orderNo) {
        queryParams.order_no = orderNo; // 如果有 orderNo，仅返回 orderNo
    } else if (saleStatus !== undefined && saleStatus !== null && saleStatus != -1) {
        queryParams.status_gte = saleStatus; // 售前/售后查询
    } else {
        if (status !== undefined && status !== null && saleStatus != -1) {
            queryParams.status = status; // 添加状态过滤
        }
        if (source !== undefined && source !== null && saleStatus != -1) {
            queryParams.source = source; // 添加状态过滤
        }
        if (onlyMyOrder !== undefined && onlyMyOrder !== null) {
            queryParams.onlyMyOrder = onlyMyOrder ? 1 : 0; // 转换为 0 或 1
        }
    }

    // 除了订单号精准查询，其他都可以增加日期
    if (!orderNo) {
        if (startDate) {
            queryParams.start_gte = startDate;
        }
        if (endDate) {
            queryParams.end_lte = endDate;
        }
    }

    return queryParams;
}

// 计算订单中所有商品的总数量
function calculateTotalItems(buckets: any[]): number {
    return buckets?.reduce((total, bucket) => total + bucket.number, 0);
}

function MyOrder({ orderNo, phoneNumber, status, startDate, endDate, source, onlyMyOrder, setTotalRecord , saleStatus}: MyOrderProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [viewMode, setViewMode] = useState('list');
    const [loading, setLoading] = useState<boolean>(true); // 添加加载状态
    const [openPayChannel, setOpenPayChannel] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // 保存选中的订单
    const [openOrderDetail, setOpenOrderDetail] = useState(false); // 是否展示详情对话框
    const [openOrderDetailWithReason, setOpenOrderDetailWithReason] = useState(OpenReason.Default); // 是否展示详情对话框
    const [detailOrder, setDetailOrder] = useState<Order | null>(null); // 当前详情订单
    const [highlightOrderId, setHighlightOrderId] = useState(''); // 高亮订单 ID
    const { fetchData, alertComponent } = useFetchData();
    const { highlightOrderNo, setHighlightOrderNo } = useCartContext();
    const translate = useTranslate();

    useEffect(() => {
        // 每次请求都先设定加载骨架
        setLoading(true)
        // 如果 orderNo 存在并且长度小于 13，则不触发请求
        if (orderNo && orderNo.length < 17) {
            // P20250113230928ME
            console.log("订单号长度不足，未触发请求");
            return;
        }

        console.log("saleStatus ===>", saleStatus)

        const queryParams = generateQueryParams({ orderNo, phoneNumber, status, startDate, endDate , source, onlyMyOrder, setTotalRecord, saleStatus});
        fetchData(
            '/v1/hlj/order/pos',
            (response) => {
                const list = response || [];
                setOrders(list);
                setLoading(false);
                setTotalRecord(list.length);

                if (highlightOrderNo) {
                    setHighlightOrderId(highlightOrderNo);
                    return;
                }
                if (list.length > 0) {
                    const newestOrder = list[0];
                    if (!isOrderExpired(newestOrder.identity.order_no, 10000)) {
                        setHighlightOrderId(newestOrder.identity.order_no);
                        setTimeout(() => setHighlightOrderId(''), 2000);
                    }
                }
            },
            'GET',
            queryParams,
        ).catch(() => {
            console.log('Failed to fetch data.');
            setLoading(false); // 加载失败
        });
    }, [status, startDate, endDate, orderNo, source, onlyMyOrder, saleStatus]);

    useEffect(() => {
        if (!highlightOrderNo) {
            return;
        }
        setHighlightOrderId(highlightOrderNo);
    }, [highlightOrderNo]);

    useEffect(() => {
        if (!highlightOrderId) {
            return;
        }
        const exists = orders.some(order => order?.identity?.order_no === highlightOrderId);
        if (!exists) {
            return;
        }
        const timer = setTimeout(() => {
            setHighlightOrderNo('');
            setHighlightOrderId('');
        }, 1100);
        return () => clearTimeout(timer);
    }, [highlightOrderId, orders, setHighlightOrderNo]);

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
        setOpenOrderDetailWithReason(OpenReason.FastCancel)
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
                                    animation: highlightOrderId === order?.identity?.order_no ? 'orderShake 0.28s ease-in-out 2' : 'none',
                                    transformOrigin: 'center center',
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

                                    {/* 显示订单总金额和商品总数 */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 0.5, flexWrap: 'nowrap' }}>
                                        <Typography variant="body2" noWrap sx={{ fontWeight: 'bold', color: '#d32f2f', flexShrink: 0 }}>
                                            {translate('pos.cart.total')}: ¥{order.price?.pay_price?.toFixed(2)}
                                        </Typography>

                                        {/* 添加状态展示 */}
                                        {(() => {
                                            const statusInfo = orderStatusMap.find(item => item.id === order.status);
                                            if (statusInfo) {
                                                return (
                                                    <Chip
                                                        label={translate(`pos.status.${order.status}`, {_: statusInfo.name})}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'darkgray',
                                                            color: `${statusInfo.color}`,
                                                            fontWeight: 'bold',
                                                            flexShrink: 0,
                                                            height: 22,
                                                            '& .MuiChip-label': {whiteSpace: 'nowrap', px: 0.75},
                                                        }}
                                                    />
                                                );
                                            }
                                            return null;
                                        })()}

                                        <Typography variant="body2" noWrap sx={{ color: '#6d4c41', flexShrink: 0 }}>
                                            {translate('pos.list.items', {count: calculateTotalItems(order.buckets)})}
                                        </Typography>
                                    </Box>

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
                                            {translate('pos.list.pay')}
                                        </Button>
                                    )}
                                    {order?.status === 1 && (
                                        <IconButton aria-label="delete" size="large" color="error" onClick={() => handleOrderCancel(order)}>
                                            <CancelIcon />
                                        </IconButton>
                                    )}
                                    {order?.status === 16 && (
                                        <IconButton aria-label="delete" size="large" color="error" onClick={() => handleOrderCancel(order)}>
                                            <SubscriptIcon />
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
                <PaymentDialog
                    open={openPayChannel}
                    onClose={handleClosePayChannel}
                    price={selectedOrder?.price?.pay_price || 0}
                    orderID={selectedOrder.identity?.order_no}
                    fetchData={fetchData}
                    storeId={selectedOrder?.merchant?.id}
                />
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
@keyframes orderShake {
    0%, 100% { transform: translateX(0) scale(1); }
    20% { transform: translateX(-10px) scale(1.03); }
    40% { transform: translateX(10px) scale(1.03); }
    60% { transform: translateX(-7px) scale(1.02); }
    80% { transform: translateX(7px) scale(1.01); }
}
`;

const styleTag = document.createElement('style');
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);