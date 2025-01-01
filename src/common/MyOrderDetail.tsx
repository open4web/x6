import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Grid,
} from '@mui/material';
import {Order} from "../pages/home/Components/types";
import OrderWorkflow from './Workflow';


interface MyOrderDetailProps {
    open: boolean;
    orderData: Order; // Pass the full order data for rendering
    onClose: () => void;
}

const MyOrderDetail: React.FC<MyOrderDetailProps> = ({ open,  orderData, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>订单详情 - {orderData.identity.order_no}</DialogTitle>
            <DialogContent>
                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">基本信息</Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography>订单号: {orderData.identity.order_no}</Typography>
                            <Typography>桌号: {orderData.identity.table_no || '未指定'}</Typography>
                            <Typography>创建时间: {new Date(orderData.stp.created_at * 1000).toLocaleString()}</Typography>
                            <Typography>状态: {orderData.status}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">商户信息</Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography>商户名称: {orderData.merchant.name}</Typography>
                            <Typography>联系电话: {orderData.merchant.mobile}</Typography>
                            <Typography>地址: {orderData.merchant.address}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">客户信息</Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography>客户名称: {orderData.customer.name}</Typography>
                            <Typography>联系电话: {orderData.customer.mobile}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">商品列表</Typography>
                        <List>
                            {orderData.buckets.map((bucket) => (
                                <React.Fragment key={bucket.id}>
                                    <ListItem>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            width="100%"
                                        >
                                            <Typography variant="body1">
                                                {bucket.name} x{bucket.number}
                                            </Typography>
                                            <Box textAlign="right">
                                                <Typography variant="body2" color="textSecondary">
                                                    单价: ¥{bucket.price.toFixed(2)}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    color="error"
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    小计: ¥{(bucket.price * bucket.number).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">支付信息</Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography>支付金额: ¥{orderData.price.pay_price}</Typography>
                            <Typography>支付状态: {orderData.pay.status === 0 ? '未支付' : '已支付'}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">订单流程</Typography>
                        <OrderWorkflow workflow={orderData?.workflow} />
                    </CardContent>
                </Card>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">
                    关闭
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MyOrderDetail;