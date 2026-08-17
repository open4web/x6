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
import { useCheckoutOffers } from './checkout/useCheckoutOffers';
import CheckoutOfferBar from './checkout/CheckoutOfferBar';

interface PaymentDialogProps {
    open: boolean;
    onClose: () => void;
    price: number;
    orderID: string;
    orderCount?: number;
    totalItems?: number;
    estimatedWait?: number;
    fetchData: any;
    setCart?: (cart: any[]) => void;
    onSuccess?: () => void;
    storeId?: string;
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
    storeId,
}: PaymentDialogProps) {
    const offers = useCheckoutOffers(price, storeId);
    const payAmount = offers.payAmount;

    const handlePaySuccess = async () => {
        setCart?.([]);
        onSuccess?.();
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
                {offers.totalBenefit > 0 ? (
                    <Typography variant="subtitle1" align="center" color="text.secondary">
                        原价 <span style={{ textDecoration: 'line-through' }}>¥{price.toFixed(2)}</span>
                        {' '}实付 <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>¥{payAmount.toFixed(2)}</span>
                    </Typography>
                ) : (
                    <Typography variant="subtitle1" align="center" color="text.secondary">
                        待支付金额: <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>¥{price.toFixed(2)}</span>
                    </Typography>
                )}

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
                    预计等待时间: <span style={{ color: '#dfff2f', fontWeight: 'bold' }}>
                        ⏳{FormatNanoseconds(estimatedWait)}
                    </span>
                </Typography>
            </DialogTitle>

            <DialogContent>
                <CheckoutOfferBar offers={offers} showTickets={offers.tickets.length > 0} />
                <PayChannel
                    price={payAmount}
                    originalPrice={price}
                    orderID={orderID}
                    fetchData={fetchData}
                    setCart={setCart}
                    setOpen={onClose}
                    onSuccess={handlePaySuccess}
                    offers={offers}
                />
            </DialogContent>
        </Dialog>
    );
}
