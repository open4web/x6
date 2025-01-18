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
    Divider,
    Button,
    IconButton, Chip,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import {Order} from "../pages/home/Components/types";
import OrderWorkflow from './Workflow';
import ListItemText from "@mui/material/ListItemText";
import {getOrderStatus} from "./orderStatus";
import {isOrderExpired} from "../utils/expireStore";
import {useFetchData} from "./FetchData";

interface MyOrderDetailProps {
    open: boolean;
    orderData: Order;
    onClose: () => void;
    openOrderDetailWithReason: string;
}

const MyOrderDetail: React.FC<MyOrderDetailProps> = ({open, orderData, onClose, openOrderDetailWithReason}) => {

    const {name: statusName, color: statusColor} = getOrderStatus(orderData.status);
    const {fetchData, alertComponent} = useFetchData();

    const handleOrderDetailCancel = () => {
        fetchData(
            '/v1/order/pos/fastCancel/' + orderData.id,
            (response) => {
                console.log("更新成功=>", response)
                onClose();
            },
            'PUT',
            '',
        ).catch(() => {
            console.log('Failed to fetch data.');
        });

    };


    const handlePrint = () => {
        const printContent = document.getElementById("print-section");
        const printWindow = window.open('', '_blank');
        if (printWindow && printContent) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>{openOrderDetailWithReason}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        .title {
                            font-size: 20px;
                            font-weight: bold;
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .info, .items {
                            margin-bottom: 20px;
                        }
                        .info-item {
                            margin-bottom: 5px;
                        }
                        .items-header {
                            font-weight: bold;
                            display: flex;
                            justify-content: space-between;
                        }
                        .item {
                            display: flex;
                            justify-content: space-between;
                            margin: 5px 0;
                        }
                        .item-total {
                            font-weight: bold;
                            text-align: right;
                        }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                {openOrderDetailWithReason} - {orderData.identity.order_no}
                <IconButton onClick={handlePrint} sx={{float: 'right'}}>
                    <PrintIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {/* 订单详情信息 */}
                <Typography variant="h6">基本信息</Typography>
                <Card variant="outlined" sx={{marginBottom: 2}}>
                    <CardContent>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography>订单号: {orderData.identity.order_no}</Typography>
                            <Typography>桌号: {orderData.identity.table_no || '未指定'}</Typography>
                            <Typography>创建时间: {new Date(orderData.stp.created_at * 1000).toLocaleString()}</Typography>
                            <Typography>
                                状态: <Chip label={statusName} sx={{backgroundColor: statusColor, color: '#fff',}}
                                            size={"small"}/>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* 隐藏的打印清单 */}
                <div id="print-section" style={{display: 'none'}}>
                    <div className="title">订单清单</div>
                    <div className="info">
                        <div className="info-item">订单号: {orderData.identity.order_no}</div>
                        <div className="info-item">桌号: {orderData.identity.table_no || '未指定'}</div>
                        <div
                            className="info-item">创建时间: {new Date(orderData.stp.created_at * 1000).toLocaleString()}</div>
                        <div className="info-item">状态: {orderData.status}</div>
                    </div>
                    <div className="items">
                        <div className="items-header">
                            <span>商品</span>
                            <span>单价</span>
                            <span>数量</span>
                            <span>小计</span>
                        </div>
                        {orderData.buckets.map((bucket) => (
                            <div className="item" key={bucket.id}>
                                <span>{bucket.name}</span>
                                <span>¥{bucket.price.toFixed(2)}</span>
                                <span>{bucket.number}</span>
                                <span>¥{(bucket.price * bucket.number).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="item-total">
                        总计: ¥{orderData.price.pay_price.toFixed(2)}
                    </div>
                </div>

                {/* 商品列表 */}
                <Typography variant="h6">商品列表</Typography>
                <Card variant="outlined" sx={{marginBottom: 2}}>
                    <CardContent>
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
                                            <ListItemText
                                                primary={bucket.name}
                                                secondary={bucket.props_text}
                                            />
                                            <Box textAlign="right">
                                                <Typography variant="body2" color="textSecondary">
                                                    x {bucket.number}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    ¥{bucket.price.toFixed(2)}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    color="error"
                                                    sx={{fontWeight: 'bold'}}
                                                >
                                                    小计: ¥{(bucket.price * bucket.number).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    <Divider/>
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>

                {/* 支付信息 */}
                <Typography variant="h6">支付信息</Typography>
                <Card variant="outlined" sx={{marginBottom: 2}}>
                    <CardContent>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography>支付金额: ¥{orderData.price.pay_price}</Typography>
                            <Typography>支付状态: {orderData.pay.status === 0 ? '未支付' : '已支付'}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* 订单流程 */}
                <Typography variant="h6" sx={{flexShrink: 0}}>
                    订单流程
                </Typography>
                <Card
                    variant="outlined"
                    sx={{
                        marginBottom: 2,
                        overflowX: "auto", // 确保卡片内部可以横向滚动
                    }}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            gap: 2,
                            whiteSpace: "nowrap", // 确保内容不会换行
                            overflowX: "auto", // 卡片内容的横向滚动
                            paddingBottom: 1,  // 调整内边距
                        }}
                    >
                        <OrderWorkflow workflow={orderData?.workflow}/>
                    </CardContent>
                </Card>
            </DialogContent>
            <DialogActions>
                {

                }
                {orderData?.status === 1 && (
                    <Button onClick={handleOrderDetailCancel} variant="contained" color="secondary">
                        确认
                    </Button>
                )}

                <Button onClick={onClose} variant="contained" color="primary">
                    关闭
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MyOrderDetail;