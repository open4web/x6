import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardContent, Container, Table, TableBody, TableRow, Typography} from '@mui/material';
import {useFetchData} from "../../../common/FetchData";
import TableCell from "@mui/material/TableCell";
import {Order} from "./types";
import {FormatTimestampAsTime} from "../../../utils/time";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import PayChannel from "../../../common/PayChannel";
import DialogActions from "@mui/material/DialogActions";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";

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

// 根据订单状态返回对应的背景颜色
function getStatusColor(status: number) {
    return statusColors[status] || '#ffffff'; // 默认背景为白色
}

// 获取数据并设置状态
function MyOrder() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [viewMode, setViewMode] = useState('list');
    const [openPayChannel, setOpenPayChannel] = React.useState(false);
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
            // setOrders(ordersData);
        });
    }, []); // Empty dependency array ensures the effect runs only once

    const handleClose = () => {
        setOpenPayChannel(false);
    };

    const handleContinuePay = () => {
        setOpenPayChannel(true);
    };

    return (
        <Container>
            {/* 订单列表展示，启用水平滚动 */}
            <Box sx={{overflowX: 'auto', display: 'flex', flexWrap: 'nowrap', gap: 1}}>
                {orders?.map((order) => (
                    <Box key={order.id} sx={{flexShrink: 0, width: 300}}>
                        <Card
                            variant="outlined"
                            sx={{
                                backgroundColor: getStatusColor(order.status), // 根据状态设置背景颜色
                                boxShadow: 3,
                                padding: 0,
                                borderRadius: 1
                            }}
                        >
                            <CardContent>
                                {/* OrderNo 和 TableNo */}
                                <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 'bold', color: '#3e2723', display: 'flex', justifyContent: 'space-between' }}
                                >
                                    {`#${order?.identity?.order_no}`}

                                    {order?.identity?.table_no && (
                                        <Typography
                                            component="span"
                                            variant="body1"
                                            sx={{ fontWeight: 'normal', color: '#6d4c41', marginLeft: 1 }}
                                        >
                                            {`@${order?.identity?.table_no}`}
                                        </Typography>
                                    )}
                                </Typography>

                                {/* 商品详情部分 */}
                                <Box sx={{height: 100, overflowY: 'auto'}}>
                                    <Table size="small" aria-label="buckets table">
                                        {/* 表头 */}
                                        {/* 表内容 */}
                                        <TableBody>
                                            {order.buckets?.map((bucket) => (
                                                <TableRow key={bucket.id}>
                                                    <TableRow key={bucket.id}>
                                                        {/* 商品名称 */}
                                                        <TableCell align="left"
                                                                   sx={{color: '#333333', padding: '2px 4px'}}>
                                                            {bucket.name}
                                                        </TableCell>
                                                        {/* 商品数量和单位 */}
                                                        <TableCell align="left"
                                                                   sx={{color: '#333333', padding: '2px 4px'}}>
                                                            {`${bucket.number} ${bucket.unit}`}
                                                        </TableCell>
                                                        {/* 商品价格 */}
                                                        <TableCell align="left"
                                                                   sx={{color: '#333333', padding: '2px 4px'}}>
                                                            {`¥${bucket.price}`}
                                                        </TableCell>
                                                        {/* 商品属性 */}
                                                        <TableCell align="left"
                                                                   sx={{color: '#333333', padding: '2px 4px', 'font-size': 8}}>
                                                            {bucket.props_text}
                                                        </TableCell>
                                                    </TableRow>
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
                                    sx={{ fontWeight: 'normal', color: '#3e2723', marginLeft: 1 }}
                                >
                                    {FormatTimestampAsTime(order.stp.created_at)}
                                </Typography>
                                {order?.status == 0 && (
                                <Button size="large" color="info" onClick={handleContinuePay}>
                                    支付
                                </Button>
                                    )}
                                {order?.status > 0 && (
                                    <Button size="large" color="primary">
                                        退款
                                    </Button>
                                )}
                            </CardActions>
                        </Card>


                        {/*    支付渠道弹窗*/}
                        <Dialog
                            open={openPayChannel}
                            fullWidth={true}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle align={"center"}>{"选择支付渠道"}</DialogTitle>
                            <DialogContent>
                                <PayChannel setCart={null} price={order?.price?.pay_price} setOpen={setOpenPayChannel} orderID={order?.identity?.order_no}/>
                            </DialogContent>
                            <DialogActions>
                                {/*<Button onClick={handleClose}>取消</Button>*/}
                                {/*<Button onClick={handleClose}>支付</Button>*/}
                            </DialogActions>
                        </Dialog>
                    </Box>
                ))}
            </Box>
        </Container>
    );
}

export default MyOrder;


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});