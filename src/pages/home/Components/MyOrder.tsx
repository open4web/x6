import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Table,
    TableBody,
    TableRow,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    CardActions,
    IconButton,
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

const statusColors = ['#ffe0b2', '#c5e1a5']; // OrderInit, OrderPaid

function getStatusColor(status: number) {
    return statusColors[status] || '#ffffff';
}

function MyOrder() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [viewMode, setViewMode] = useState('list');
    const [openPayChannel, setOpenPayChannel] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // 保存选中的订单
    const [openOrderDetail, setOpenOrderDetail] = useState(false); // 是否展示详情对话框
    const [detailOrder, setDetailOrder] = useState<Order | null>(null); // 当前详情订单
    const { fetchData, alertComponent } = useFetchData();

    useEffect(() => {
        fetchData(
            '/v1/order/pos',
            (response) => {
                setOrders(response);
            },
            'GET',
            {}
        ).catch(() => {
            console.log('Failed to fetch data.');
        });
    }, []);

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

    const handleOrderDetailClose = () => {
        setOpenOrderDetail(false);
        setDetailOrder(null); // 清除详情订单
    };

    return (
        <Container>
            <Box sx={{overflowX: 'auto', display: 'flex', flexWrap: 'nowrap', gap: 1}}>
                {alertComponent}
                {orders?.map((order) => (
                    <Box key={order.id} sx={{flexShrink: 0, width: 300}}>
                        <Card
                            variant="outlined"
                            sx={{
                                backgroundColor: getStatusColor(order.status),
                                boxShadow: 3,
                                padding: 0,
                                borderRadius: 1,
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
                                <Box sx={{height: 100, overflowY: 'auto'}}>
                                    <Table size="small" aria-label="buckets table">
                                        <TableBody>
                                            {order.buckets?.map((bucket) => (
                                                <TableRow key={bucket.id}>
                                                    <TableCell align="left" sx={{color: '#333333', padding: '2px 4px'}}>
                                                        {bucket.name}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{color: '#333333', padding: '2px 4px'}}>
                                                        {`${bucket.number} ${bucket.unit}`}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{color: '#333333', padding: '2px 4px'}}>
                                                        {`¥${bucket.price}`}
                                                    </TableCell>
                                                    <TableCell
                                                        align="left"
                                                        sx={{color: '#333333', padding: '2px 4px', fontSize: 8}}
                                                    >
                                                        {bucket.props_text}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{fontWeight: 'normal', color: '#3e2723', marginLeft: 1}}
                                >
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
                                <IconButton aria-label="delete" size="large" color={"error"}>
                                    < PublishedWithChangesIcon/>
                                </IconButton>
                                <IconButton aria-label="delete" size="large" color={"success"}
                                            onClick={() => handleOrderDetail(order)}>
                                    < ExpandCircleDownIcon/>
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Box>
                ))}
            </Box>

            {/* 订单详情对话框 */}
            {detailOrder && (
                <MyOrderDetail open={openOrderDetail} orderData={detailOrder} onClose={handleOrderDetailClose}/>
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