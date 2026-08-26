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
import {useTranslate} from 'react-admin';

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
    const translate = useTranslate();
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
                    {translate('pos.pay.order_no')}: {orderID}
                </Typography>
                {offers.totalBenefit > 0 ? (
                    <Typography variant="subtitle1" align="center" color="text.secondary">
                        {translate('pos.pay.original')} <span style={{ textDecoration: 'line-through' }}>¥{price.toFixed(2)}</span>
                        {' '}{translate('pos.pay.pay_amount')} <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>¥{payAmount.toFixed(2)}</span>
                    </Typography>
                ) : (
                    <Typography variant="subtitle1" align="center" color="text.secondary">
                        {translate('pos.pay.wait_pay')}: <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>¥{price.toFixed(2)}</span>
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
                        {translate('pos.pay.eta_pct', {pct: Math.round(orderCount)})}
                    </Typography>
                </Box>

                <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mt: 1 }}>
                    {translate('pos.pay.eta')}: <span style={{ color: '#dfff2f', fontWeight: 'bold' }}>
                        ⏳{FormatNanoseconds(estimatedWait, {
                            sec: translate('pos.time.sec'),
                            min: translate('pos.time.min'),
                            hour: translate('pos.time.hour'),
                            day: translate('pos.time.day'),
                        })}
                    </span>
                </Typography>
            </DialogTitle>

            <DialogContent>
                <CheckoutOfferBar offers={offers} showTickets={offers.tickets.length > 0} />
                {open ? (
                    <PayChannel
                        key={orderID}
                        price={payAmount}
                        originalPrice={price}
                        orderID={orderID}
                        fetchData={fetchData}
                        setCart={setCart}
                        setOpen={onClose}
                        onSuccess={handlePaySuccess}
                        offers={offers}
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
