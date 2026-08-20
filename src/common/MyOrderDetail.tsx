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
import {useTranslate} from 'react-admin';

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
    [OpenReason.Default]: {title: 'pos.detail.title', action: ''},
    [OpenReason.FastCancel]: {title: 'pos.detail.fast_cancel', action: 'pos.detail.cancel_now'},
    [OpenReason.Cancel]: {title: 'pos.detail.cancel_order', action: 'pos.detail.cancel'},
    [OpenReason.Close]: {title: 'pos.detail.close_title', action: 'pos.detail.close_action'},
};

const reasonList = [
    {value: '商家未履约', key: 'r_merchant'},
    {value: '个人原因', key: 'r_personal'},
    {value: '缺货', key: 'r_stock'},
    {value: '品质问题', key: 'r_quality'},
    {value: '点错', key: 'r_wrong'},
    {value: '更换菜品', key: 'r_change'},
    {value: '长时间未出餐', key: 'r_late'},
    {value: '其它', key: 'r_other'},
];

interface SelectedItems {
    [key: string]: boolean;
}

const MyOrderDetail: React.FC<MyOrderDetailProps> = ({open, orderData, onClose, openOrderDetailWithReason}) => {
    const translate = useTranslate();
    const reasonDetails = OpenReasonMap[openOrderDetailWithReason];
    const dialogTitle = translate(reasonDetails.title);
    const {name: statusName, color: statusColor} = getOrderStatus(orderData.status);
    const statusLabel = translate(`pos.status.${orderData.status}`, {_: statusName});
    const reasonLabel = (value: string) => {
        const found = reasonList.find(item => item.value === value);
        return found ? translate(`pos.detail.${found.key}`) : value;
    };
    const {fetchData, alertComponent} = useFetchData();

    const [refundReason, setRefundReason] = useState<string>(''); // 存储退款原因
    const [openRefundDialog, setOpenRefundDialog] = useState<boolean>(false); // 控制退款原因弹窗
    const [selectedItems, setSelectedItems] = useState<SelectedItems>({}); // 存储选中的商品

    // 处理商品选择
    const handleItemSelect = (itemId: string) => {
        // 检查商品是否已退款，已退款的不允许选择
        const item = orderData.buckets.find(b => b.id === itemId);
        if (item && item.status === 8) {
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
                if (item.status !== 8) {
                    newSelected[item.id] = true;
                }
            });
        }
        setSelectedItems(newSelected);
    };

    // 获取可选择的商品（未退款的）
    const getSelectableItems = () => {
        return orderData.buckets.filter(item => item.status !== 8);
    };

    // 获取选中的商品ID列表
    const getSelectedItemIds = (): string[] => {
        return Object.keys(selectedItems).filter(id => selectedItems[id]);
    };

    // 获取选中商品的总金额
    const getSelectedItemsTotal = (): number => {
        return orderData.buckets.reduce((total, item) => {
            if (selectedItems[item.id] && item.status !== 8) { // 只计算未退款的选中商品
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
            selectedItems[id] && orderData.buckets.find(b => b.id === id)?.status !== 8
        );
    };

    // 检查是否有可退款的商品
    const hasRefundableItems = (): boolean => {
        return orderData?.buckets?.some(item => item.status !== 8);
    };

    // 检查是否有退款记录
    const hasRefundHistory = (): boolean => {
        return (orderData.refund_summary?.total_times || 0) > 0;
    };

    const handleOrderDetailCancel = () => {
        if (!refundReason) {
            setOpenRefundDialog(true);
            return;
        }

        const selectedIds = getSelectedItemIds();
        // 检查是否有退款记录
        const hasHistory = hasRefundHistory();

        // 如果有退款记录，则必须传items参数
        // 即使全选也要传，因为这是部分退款（相对于原始订单）
        const shouldSendItems = hasHistory || selectedIds.length > 0;

        const payload: {
            order_id: string;
            reason: string;
            items?: string[];
        } = {
            order_id: orderData.id,
            reason: refundReason,
        };

        if (shouldSendItems && selectedIds.length > 0) {
            payload.items = selectedIds;
        }

        fetchData(
            `/v1/hlj/order/fastCancel`,
            (response) => {
                console.log("退款成功 =>", response);
                onClose();
            },
            'PUT',
            payload,
        ).catch(() => {
            console.log('Failed to process refund.');
        });
    };

    const handleOrderRefund = () => {
        if (!refundReason) {
            setOpenRefundDialog(true);
            return;
        }

        const selectedIds = getSelectedItemIds();
        const hasHistory = hasRefundHistory();

        // 如果有退款记录，则必须传 items
        // 即使全选也要传，因为这是部分退款（相对于原始订单）
        const shouldSendItems = hasHistory || selectedIds.length > 0;

        const payload: {
            order_id: string;
            reason: string;
            items?: string[];
        } = {
            order_id: orderData.id,
            reason: refundReason,
        };

        if (shouldSendItems && selectedIds.length > 0) {
            payload.items = selectedIds;
        }

        fetchData(
            `/v1/hlj/order/fastRefund`,
            (response) => {
                console.log("退款成功 =>", response);
                onClose();
            },
            'PUT',
            payload,
        ).catch(() => {
            console.log('Failed to process refund.');
        });
    };

    const handleCloudPrint = () => {
        const url = `/v1/hlj/device/rpc/reprint/${orderData.identity.order_no}`;
        // @ts-ignore
        fetchData(
            url,
            () => {
                // setSnackbar({ open: true, message: '云打印已提交', severity: 'success' });
                // setPrintOptionsOpen(false);
                console.log("云打印已提交")
            },
            'POST',  // 根据后端接口实际方法调整，常见为 POST
            '',
        ).catch(() => {
            console.log("云打印请求异常")
            // setSnackbar({ open: true, message: '云打印请求异常', severity: 'error' });
        });
    };


    const handlePrint = () => {
        const printContent = document.getElementById("print-section");
        const printWindow = window.open('', '_blank');

        if (printWindow && printContent) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>${dialogTitle}</title>
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
                {dialogTitle} - {orderData.identity.order_no}
                <IconButton onClick={handleCloudPrint} sx={{float: 'right'}}>
                    <PrintIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {/* 订单详情信息 */}
                <Typography variant="h6">{translate('pos.detail.basic')}</Typography>
                <Card variant="outlined" sx={{marginBottom: 2}}>
                    <CardContent>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography>{translate('pos.detail.order_no')}: {orderData.identity.order_no}</Typography>
                            <Typography>{translate('pos.detail.table')}: {orderData.identity.table_no || translate('pos.detail.unset')}</Typography>
                            <Typography>{translate('pos.detail.created')}: {new Date(orderData.stp.created_at * 1000).toLocaleString()}</Typography>
                            <Typography>
                                {translate('pos.detail.status')}: <Chip label={statusLabel} sx={{backgroundColor: statusColor, color: '#fff',}}
                                            size={"small"}/>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* 隐藏的打印清单 */}
                <div id="print-section" style={{display: 'none'}}>
                    <div className="title">{translate('pos.detail.receipt')}</div>
                    <div className="info">
                        <div className="info-item">{translate('pos.detail.order_no')}: {orderData.identity.order_no}</div>
                        <div className="info-item">{translate('pos.detail.table')}: {orderData.identity.table_no || translate('pos.detail.unset')}</div>
                        <div
                            className="info-item">{translate('pos.detail.created')}: {new Date(orderData.stp.created_at * 1000).toLocaleString()}</div>
                        <div className="info-item">{translate('pos.detail.status')}: {statusLabel}</div>
                    </div>
                    <div className="items">
                        <div className="items-header">
                            <span>{translate('pos.detail.product')}</span>
                            <span>{translate('pos.detail.unit_price')}</span>
                            <span>{translate('pos.detail.qty')}</span>
                            <span>{translate('pos.detail.subtotal')}</span>
                            <span>{translate('pos.detail.item_status')}</span>
                        </div>
                        {orderData?.buckets?.map((bucket) => (
                            <div className={`item ${bucket.status === 8 ? 'refunded' : ''}`} key={bucket.id}>
                                <span>{bucket.name}</span>
                                <span>¥{bucket.price.toFixed(2)}</span>
                                <span>{bucket.number}</span>
                                <span>¥{(bucket.price * bucket.number).toFixed(2)}</span>
                                <span>{bucket.status === 8 ? translate('pos.detail.refunded') : translate('pos.detail.normal')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="item-total">
                        {translate('pos.detail.total')}: ¥{orderData.price.pay_price.toFixed(2)}
                    </div>
                </div>

                {/* 商品列表 */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">{translate('pos.detail.items')}</Typography>
                    {hasRefundableItems() && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={areAllItemsSelected()}
                                    indeterminate={hasSelectedItems() && !areAllItemsSelected()}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            }
                            label={translate('pos.detail.select_all')}
                        />
                    )}
                </Box>
                <Card variant="outlined" sx={{marginBottom: 2}}>
                    <CardContent>
                        <List>
                            {orderData && orderData?.buckets && orderData?.buckets.map((bucket) => {
                                const isRefunded = bucket.status === 8;
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
                                                                        label={translate('pos.detail.refunded')}
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
                                                            {translate('pos.detail.subtotal')}: ¥{(bucket.price * bucket.number).toFixed(2)}
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
                                    {translate('pos.detail.selected_amount')}: <strong>¥{getSelectedItemsTotal().toFixed(2)}</strong>
                                </Typography>
                            </Box>
                        )}
                        {!hasRefundableItems() && (
                            <Box mt={2} p={2} textAlign="center" bgcolor="grey30" borderRadius={1}>
                                <Typography variant="body2" color="textSecondary">
                                    {translate('pos.detail.all_refunded')}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* 支付信息 */}
                <Typography variant="h6">{translate('pos.detail.pay_info')}</Typography>
                <Card variant="outlined" sx={{marginBottom: 2}}>
                    <CardContent>
                        <Box display="flex" flexDirection="row" gap={2} justifyContent="space-between">
                            <Box display="flex" flexDirection="column" gap={1} flex="1">
                                <Typography>{translate('pos.detail.pay_amount')}: ¥{orderData.price.pay_price}</Typography>
                                <Typography>{translate('pos.detail.pay_status')}: {orderData.pay.status === 0 ? translate('pos.detail.unpaid') : translate('pos.detail.paid')}</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" gap={1} flex="1">
                                {(() => {
                                    const { name, color } = getPlatformInfo(orderData.pay.method);
                                    return (
                                        <Box>
                                            <Typography>
                                                {translate('pos.detail.pay_method')}: <Chip label={translate(`pos.source.${orderData.pay.method}`, {_: name})} sx={{backgroundColor: color, color: '#fff',}}
                                                                size={"small"}/>
                                            </Typography>
                                        </Box>
                                    );
                                })()}
                                <Typography>{translate('pos.detail.txn')}: {orderData.pay.transaction_id}</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" gap={1} flex="1">
                                <Typography>{translate('pos.detail.refund_times')}: {orderData.refund_summary.total_times || 0}</Typography>
                                <Typography>{translate('pos.detail.refunded_amount')}: ¥{(orderData.refund_summary.total_amount || 0).toFixed(2)}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* 订单流程 */}
                <Typography variant="h6" sx={{flexShrink: 0}}>
                    {translate('pos.detail.workflow')}
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
                    <DialogTitle>{translate('pos.detail.pick_reason')}</DialogTitle>
                    <DialogContent dividers>
                        <RadioGroup value={refundReason} onChange={(e) => setRefundReason(e.target.value)}>
                            {reasonList.map((reason) => (
                                <FormControlLabel key={reason.value} value={reason.value} control={<Radio />} label={translate(`pos.detail.${reason.key}`)} />
                            ))}
                        </RadioGroup>

                        {hasSelectedItems() && (
                            <FormControl component="fieldset" sx={{ mt: 2 }}>
                                <FormLabel component="legend">{translate('pos.detail.refund_type')}</FormLabel>
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        {hasRefundHistory() || !areAllItemsSelected()
                                            ? translate('pos.detail.partial', {count: getSelectedItemIds().length, amount: getSelectedItemsTotal().toFixed(2)})
                                            : translate('pos.detail.full')}
                                    </Typography>
                                </Box>
                            </FormControl>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenRefundDialog(false)} color="primary">{translate('pos.detail.cancel')}</Button>
                        <Button
                            onClick={() => {
                                if (!refundReason) {
                                    alert(translate('pos.detail.need_reason'));
                                    return;
                                }
                                setOpenRefundDialog(false);
                            }}
                            color="secondary"
                            variant="contained"
                        >
                            {translate('pos.detail.confirm')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* 退款原因显示 */}
                {refundReason && (
                    <Typography variant="body2" color="textSecondary" sx={{ marginRight: "auto" }}>
                        {translate('pos.detail.reason')}：
                        <Chip
                            label={reasonLabel(refundReason)}
                            color="warning"
                            variant="outlined"
                            size="small"
                            sx={{ marginLeft: 1, fontWeight: "bold" }}
                        />
                        {hasSelectedItems() && (
                            <Chip
                                label={translate(hasRefundHistory() || !areAllItemsSelected() ? 'pos.detail.partial_tag' : 'pos.detail.full_tag', {amount: getSelectedItemsTotal().toFixed(2)})}
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
                        {refundReason ? (hasRefundHistory() || !areAllItemsSelected() ? translate('pos.detail.cancel_selected') : translate('pos.detail.cancel_now')) : translate('pos.detail.apply_cancel')}
                    </Button>
                )}
                {/* 快速退款订单按钮（仅在符合状态时显示） */}
                {orderData?.status === 1 && openOrderDetailWithReason === OpenReason.FastCancel && reasonDetails.action.length > 0 && hasRefundableItems() && (
                    <Button onClick={handleOrderRefund} variant="contained" color="error">
                        {refundReason ? (hasRefundHistory() || !areAllItemsSelected() ? translate('pos.detail.refund_selected') : translate('pos.detail.refund_now')) : translate('pos.detail.apply_refund')}
                    </Button>
                )}

                {/* 快速退款订单按钮（仅在符合状态时显示） */}
                {orderData?.status === 16 && openOrderDetailWithReason === OpenReason.FastCancel && reasonDetails.action.length > 0 && hasRefundableItems() && (
                    <Button onClick={handleOrderRefund} variant="contained" color="error">
                        {refundReason ? (hasRefundHistory() || !areAllItemsSelected() ? translate('pos.detail.refund_selected') : translate('pos.detail.refund_continue')) : translate('pos.detail.refund_again')}
                    </Button>
                )}

                {/* 关闭按钮 */}
                <Button onClick={onClose} variant="contained" color="primary">
                    {translate('pos.detail.close')}
                </Button>
            </DialogActions>
            {alertComponent}
        </Dialog>
    );
};

export default MyOrderDetail;