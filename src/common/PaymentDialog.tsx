// components/PaymentDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    LinearProgress,
    Box,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { FormatNanoseconds } from '../utils/time';
import PayChannel from './PayChannel';

interface PaymentDialogProps {
    open: boolean;
    onClose: () => void;
    price: number;
    orderID: string;
    orderCount?: number;
    totalItems?: number;
    estimatedWait?: number;
    fetchData: any;
    setCart?: (cart: any[]) => void;           // 仅购物车需要
    onSuccess?: () => void;                    // 支付成功后的回调（充值、其他场景都可用）
}

function Transition(props: TransitionProps & { children: React.ReactElement<any, any> }) {
    return <Slide direction="up" {...props} />;
}

export default function PaymentDialog({
                                          open,
                                          onClose,
                                          price,
                                          orderID,
                                          orderCount = 0,
                                          totalItems = 0,
                                          estimatedWait = 0,
                                          fetchData,
                                          setCart,
                                          onSuccess,
                                      }: PaymentDialogProps) {

    const handlePaySuccess = () => {
        setCart?.([]);           // 只在购物车场景清空
        onSuccess?.();           // 通用成功回调
        onClose();
    };

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
        >
            <DialogTitle>
                <Typography variant="h6" align="center">
                    订单号: {orderID}
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary">
                    待支付金额: <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                        ¥{price.toFixed(2)}
                    </span>
                </Typography>

                <LinearProgress
                    variant="buffer"
                    value={totalItems}
                    valueBuffer={30}
                    sx={{ mt: 2 }}
                />

                <Box sx={{ minWidth: 35, mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {Math.round(orderCount)}% 预计等待
                    </Typography>
                </Box>

                <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mt: 1 }}>
                    预计等待时间: <span style={{ color: "#dfff2f", fontWeight: "bold" }}>
                        ⏳{FormatNanoseconds(estimatedWait)}
                    </span>
                </Typography>
            </DialogTitle>

            <DialogContent>
                <PayChannel
                    price={price}
                    orderID={orderID}
                    fetchData={fetchData}
                    setCart={setCart}
                    setOpen={onClose}
                    onSuccess={handlePaySuccess}
                />
            </DialogContent>
        </Dialog>
    );
}