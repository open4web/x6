import React, {useState} from 'react';
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
    IconButton, Chip, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, FormControl, FormLabel
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import {Order} from "../pages/home/Components/types";
import OrderWorkflow from './Workflow';
import ListItemText from "@mui/material/ListItemText";
import {getOrderStatus} from "./orderStatus";
import {isOrderExpired} from "../utils/expireStore";
import {useFetchData} from "./FetchData";
import {getPlatformInfo} from "./payMethod";

interface MyOrderDetailProps {
    open: boolean;
    orderData: Order;
    onClose: () => void;
    openOrderDetailWithReason: OpenReason;
}

export enum OpenReason {
    Default = "default",
    FastCancel = "fastCancel",
    Cancel = "cancel",
    Close = "close",
}

export const OpenReasonMap: Record<OpenReason, { title: string; action: string }> = {
    [OpenReason.Default]: {
        title: "订单详情",
        action: "",
    },
    [OpenReason.FastCancel]: {
        title: "快速取消订单",
        action: "立即取消",
    },
    [OpenReason.Cancel]: {
        title: "取消订单",
        action: "取消",
    },
    [OpenReason.Close]: {
        title: "关闭订单详情",
        action: "关闭订单",
    },
};

const reasonList = [
    "商家未履约",
    "个人原因",
    "缺货",
    "品质问题",
    "点错",
    "更换菜品",
    "长时间未出餐",
    "其它",
]

interface SelectedItems {
    [key: string]: boolean;
}

const MyOrderDetail: React.FC<MyOrderDetailProps> = ({open, orderData, onClose, openOrderDetailWithReason}) => {
    // 根据理由从映射中读取 title 和 action
    const reasonDetails = OpenReasonMap[openOrderDetailWithReason];

    const {name: statusName, color: statusColor} = getOrderStatus(orderData.status);
    const {fetchData, alertComponent} = useFetchData();

    const [refundReason, setRefundReason] = useState<string>(''); // 存储退款原因
    const [openRefundDialog, setOpenRefundDialog] = useState<boolean>(false); // 控制退款原因弹窗
    const [selectedItems, setSelectedItems] = useState<SelectedItems>({}); // 存储选中的商品
    const [refundType, setRefundType] = useState<'full' | 'partial'>('full'); // 退款类型：全额或部分

    // 处理商品选择
    const handleItemSelect = (itemId: string) => {
        // 检查商品是否已退款，已退款的不允许选择
        const item = orderData.buckets.find(b => b.id === itemId);
        if (item && item.status === 1) {
            return; // 已退款，不处理选择
        }

        setSelectedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    // 全选/取消全选 - 只选择未退款的商品
    const handleSelectAll = (selectAll: boolean) => {
        const newSelected: SelectedItems = {};
        if (selectAll) {
            orderData.buckets.forEach(item => {
                // 只选择未退款的商品
                if (item.status !== 1) {
                    newSelected[item.id] = true;
                }
            });
        }
        setSelectedItems(newSelected);
    };

    // 获取可选择的商品（未退款的）
    const getSelectableItems = () => {
        return orderData.buckets.filter(item => item.status !== 1);
    };

    // 获取选中的商品ID列表
    const getSelectedItemIds = (): string[] => {
        return Object.keys(selectedItems).filter(id => selectedItems[id]);
    };

    // 获取选中商品的总金额
    const getSelectedItemsTotal = (): number => {
        return orderData.buckets.reduce((total, item) => {
            if (selectedItems[item.id] && item.status !== 1) { // 只计算未退款的选中商品
                return total + (item.price * item.number);
            }
            return total;
        }, 0);
    };

    // 检查是否所有可选择的商品都被选中
    const areAllItemsSelected = (): boolean => {
        const selectableItems = getSelectableItems();
        if (selectableItems.length === 0) return false;
        return selectableItems.every(item => selectedItems[item.id]);
    };

    // 检查是否有选中的商品
    const hasSelectedItems = (): boolean => {
        return Object.keys(selectedItems).some(id =>
            selectedItems[id] && orderData.buckets.find(b => b.id === id)?.status !== 1
        );
    };

    // 检查是否有可退款的商品
    const hasRefundableItems = (): boolean => {
        return orderData.buckets.some(item => item.status !== 1);
    };

    const handleOrderDetailCancel = () => {
        if (!refundReason) {
            setOpenRefundDialog(true);
            return;
        }

        const selectedIds = getSelectedItemIds();
        const isPartialRefund = refundType === 'partial' && selectedIds.length > 0;

        let url = `/v1/order/fastCancel/${orderData.id}/${refundReason}`;

        if (isPartialRefund) {
            url += `?items=${selectedIds.join(',')}`;
        }

        fetchData(
            url,
            (response) => {
                console.log("订单取消成功 =>", response);
                onClose();
            },
            'PUT',
            '',
        ).catch(() => {
            console.log('Failed to cancel order.');
        });
    };

    const handleOrderRefund = () => {
        if (!refundReason) {
            setOpenRefundDialog(true);
            return;
        }

        const selectedIds = getSelectedItemIds();
        const isPartialRefund = refundType === 'partial' && selectedIds.length > 0;

        console.log("isPartialRefund-->", isPartialRefund, "selectedIds-->", selectedIds)

        let url = `/v1/order/fastRefund/${orderData.id}/${refundReason}`;

        if (isPartialRefund) {
            url += `?items=${selectedIds.join(',')}`;
        }

        fetchData(
            url,
            (response) => {
                console.log("退款成功 =>", response);
                onClose();
            },
            'PUT',
            '',
        ).catch(() => {
            console.log('Failed to process refund.');
        });
    };

    const handlePrint = () => {
        const printContent = document.getElementById("print-section");
        const printWindow = window.open('', '_blank');

        if (printWindow && printContent) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>{reasonDetails.title}</title>
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
                        .refunded {
                            color: #999;
                            text-decoration: line-through;
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
                {reasonDetails.title} - {orderData.identity.order_no}
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
                            <span>状态</span>
                        </div>
                        {orderData.buckets.map((bucket) => (
                            <div className={`item ${bucket.status === 1 ? 'refunded' : ''}`} key={bucket.id}>
                                <span>{bucket.name}</span>
                                <span>¥{bucket.price.toFixed(2)}</span>
                                <span>{bucket.number}</span>
                                <span>¥{(bucket.price * bucket.number).toFixed(2)}</span>
                                <span>{bucket.status === 1 ? '已退款' : '正常'}</span>
                            </div>
                        ))}
                    </div>
                    <div className="item-total">
                        总计: ¥{orderData.price.pay_price.toFixed(2)}
                    </div>
                </div>

                {/* 商品列表 */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">商品列表</Typography>
                    {hasRefundableItems() && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={areAllItemsSelected()}
                                    indeterminate={hasSelectedItems() && !areAllItemsSelected()}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            }
                            label="全选可退款商品"
                        />
                    )}
                </Box>
                <Card variant="outlined" sx={{marginBottom: 2}}>
                    <CardContent>
                        <List>
                            {orderData.buckets.map((bucket) => {
                                const isRefunded = bucket.status === 1;
                                return (
                                    <React.Fragment key={bucket.id}>
                                        <ListItem sx={{
                                            opacity: isRefunded ? 0.4 : 1,
                                            backgroundColor: isRefunded ? 'inherit' : 'transparent'
                                        }}>
                                            <Box display="flex" alignItems="center" width="100%">
                                                <Checkbox
                                                    checked={!!selectedItems[bucket.id]}
                                                    onChange={() => handleItemSelect(bucket.id)}
                                                    disabled={isRefunded}
                                                    sx={{ mr: 1 }}
                                                />
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    width="100%"
                                                >
                                                    <ListItemText
                                                        primary={
                                                            <Box display="flex" alignItems="center">
                                                                {bucket.name}
                                                                {isRefunded && (
                                                                    <Chip
                                                                        label="已退款"
                                                                        size="small"
                                                                        color="default"
                                                                        sx={{ ml: 1 }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        }
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
                                                            color={isRefunded ? "textSecondary" : "error"}
                                                            sx={{fontWeight: 'bold', textDecoration: isRefunded ? 'line-through' : 'none'}}
                                                        >
                                                            小计: ¥{(bucket.price * bucket.number).toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </ListItem>
                                        <Divider/>
                                    </React.Fragment>
                                );
                            })}
                        </List>
                        {hasSelectedItems() && (
                            <Box mt={2} p={1} bgcolor="red.100" borderRadius={1}>
                                <Typography variant="body2">
                                    已选商品金额: <strong>¥{getSelectedItemsTotal().toFixed(2)}</strong>
                                </Typography>
                            </Box>
                        )}
                        {!hasRefundableItems() && (
                            <Box mt={2} p={2} textAlign="center" bgcolor="grey.100" borderRadius={1}>
                                <Typography variant="body2" color="textSecondary">
                                    所有商品均已退款，无法再次退款
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* 支付信息 */}
                <Typography variant="h6">支付信息</Typography>
                <Card variant="outlined" sx={{marginBottom: 2}}>
                    <CardContent>
                        <Box display="flex" flexDirection="row" gap={2} justifyContent="space-between">
                            <Box display="flex" flexDirection="column" gap={1} flex="1">
                                <Typography>支付金额: ¥{orderData.price.pay_price}</Typography>
                                <Typography>支付状态: {orderData.pay.status === 0 ? '未支付' : '已支付'}</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" gap={1} flex="1">
                                {(() => {
                                    const { name, color } = getPlatformInfo(orderData.pay.method);
                                    return (
                                        <Box>
                                            <Typography>
                                                支付方式: <Chip label={name} sx={{backgroundColor: color, color: '#fff',}}
                                                                size={"small"}/>
                                            </Typography>
                                        </Box>
                                    );
                                })()}
                                <Typography>支付单号: {orderData.pay.transaction_id}</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" gap={1} flex="1">
                                <Typography> 退款次数: {orderData.refund_summary.total_times || 0}</Typography>
                                <Typography>已退款金额: ¥{(orderData.refund_summary.total_amount || 0).toFixed(2)}</Typography>
                            </Box>
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
                <Dialog open={openRefundDialog} onClose={() => setOpenRefundDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>选择退款原因</DialogTitle>
                    <DialogContent dividers>
                        <RadioGroup value={refundReason} onChange={(e) => setRefundReason(e.target.value)}>
                            {reasonList.map((reason) => (
                                <FormControlLabel key={reason} value={reason} control={<Radio />} label={reason} />
                            ))}
                        </RadioGroup>

                        {hasSelectedItems() && (
                            <FormControl component="fieldset" sx={{ mt: 2 }}>
                                <FormLabel component="legend">退款类型</FormLabel>
                                <RadioGroup
                                    value={refundType}
                                    onChange={(e) => setRefundType(e.target.value as 'full' | 'partial')}
                                >
                                    <FormControlLabel
                                        value="partial"
                                        control={<Radio />}
                                        label={`部分退款 (仅选中商品: ¥${getSelectedItemsTotal().toFixed(2)})`}
                                    />
                                    <FormControlLabel
                                        value="full"
                                        control={<Radio />}
                                        label="全额退款"
                                    />
                                </RadioGroup>
                            </FormControl>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenRefundDialog(false)} color="primary">取消</Button>
                        <Button
                            onClick={() => {
                                if (!refundReason) {
                                    alert("请选择退款原因");
                                    return;
                                }
                                setOpenRefundDialog(false);
                            }}
                            color="secondary"
                            variant="contained"
                        >
                            确认
                        </Button>
                    </DialogActions>
                </Dialog>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* 退款原因显示 */}
                {refundReason && (
                    <Typography variant="body2" color="textSecondary" sx={{ marginRight: "auto" }}>
                        退款原因：
                        <Chip
                            label={refundReason}
                            color="warning"
                            variant="outlined"
                            size="small"
                            sx={{ marginLeft: 1, fontWeight: "bold" }}
                        />
                        {hasSelectedItems() && refundType === 'partial' && (
                            <Chip
                                label={`部分退款: ¥${getSelectedItemsTotal().toFixed(2)}`}
                                color="info"
                                variant="outlined"
                                size="small"
                                sx={{ marginLeft: 1, fontWeight: "bold" }}
                            />
                        )}
                    </Typography>
                )}

                {/* 取消订单按钮（仅在符合状态时显示） */}
                {orderData?.status === 1 && openOrderDetailWithReason === OpenReason.FastCancel && reasonDetails.action.length > 0 && (
                    <Button onClick={handleOrderDetailCancel} variant="contained" color="secondary">
                        {refundReason ? (refundType === 'partial' ? "取消选中商品" : "立即取消") : "申请取消"}
                    </Button>
                )}
                {/* 快速退款订单按钮（仅在符合状态时显示） */}
                {orderData?.status === 1 && openOrderDetailWithReason === OpenReason.FastCancel && reasonDetails.action.length > 0 && hasRefundableItems() && (
                    <Button onClick={handleOrderRefund} variant="contained" color="error">
                        {refundReason ? (refundType === 'partial' ? "退款选中商品" : "立即退款") : "申请退款"}
                    </Button>
                )}

                {/* 快速退款订单按钮（仅在符合状态时显示） */}
                {orderData?.status === 16 && openOrderDetailWithReason === OpenReason.FastCancel && reasonDetails.action.length > 0 && hasRefundableItems() && (
                    <Button onClick={handleOrderRefund} variant="contained" color="error">
                        {refundReason ? (refundType === 'partial' ? "退款选中商品" : "继续退款") : "申请再次退款"}
                    </Button>
                )}

                {/* 关闭按钮 */}
                <Button onClick={onClose} variant="contained" color="primary">
                    关闭
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MyOrderDetail;