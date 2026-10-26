// components/PaymentDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
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
    seat?: string;
    people?: string;
    seatNote?: string;
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
    estimatedWait = 0,
    seat = '',
    people = '',
    seatNote = '',
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
            maxWidth="md"
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
        >
            <DialogTitle>
                <Typography variant="body2" align="center" color="text.secondary">
                    {translate('pos.pay.order_no')}: {orderID}
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1.3fr 1fr',
                        gap: 1.25,
                        mt: 1.5,
                    }}
                >
                    <Box sx={{p: 1.5, borderRadius: 2, bgcolor: 'action.hover', minWidth: 0}}>
                        <Typography variant="caption" color="text.secondary">
                            {translate('pos.pay.wait_pay')}
                        </Typography>
                        <Typography sx={{fontSize: {xs: 32, sm: 40}, fontWeight: 800, color: '#d32f2f', lineHeight: 1.05}}>
                            ¥{payAmount.toFixed(2)}
                        </Typography>
                        {offers.totalBenefit > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{textDecoration: 'line-through'}}>
                                {translate('pos.pay.original')} ¥{price.toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{p: 1.5, borderRadius: 2, bgcolor: 'action.hover', minWidth: 0}}>
                        <Typography variant="caption" color="text.secondary">
                            {translate('pos.pay.seat', {_: '座位号'})}
                        </Typography>
                        <Typography noWrap sx={{fontSize: {xs: 28, sm: 36}, fontWeight: 800, lineHeight: 1.1}}>
                            {seat || seatNote || '—'}
                        </Typography>
                        {people ? (
                            <Typography variant="body2" color="text.secondary">
                                {translate('pos.cart.people')} {people}
                            </Typography>
                        ) : null}
                    </Box>
                </Box>

                {(orderCount > 0 || estimatedWait > 0) && (
                    <Box
                        sx={{
                            mt: 1.5,
                            px: 2,
                            py: 1.25,
                            borderRadius: 2,
                            textAlign: 'center',
                            bgcolor: '#ffb300',
                            color: '#3e2723',
                        }}
                    >
                        <Typography sx={{fontSize: {xs: 22, sm: 28}, fontWeight: 800, lineHeight: 1.15, color: 'inherit'}}>
                            {translate('pos.pay.eta')}: {FormatNanoseconds(estimatedWait, {
                                sec: translate('pos.time.sec'),
                                min: translate('pos.time.min'),
                                hour: translate('pos.time.hour'),
                                day: translate('pos.time.day'),
                            })}
                        </Typography>
                        <Typography sx={{mt: 0.25, fontSize: {xs: 16, sm: 20}, fontWeight: 700, color: 'inherit'}}>
                            {translate('pos.pay.ahead', {count: Math.max(0, Math.round(orderCount))})}
                        </Typography>
                    </Box>
                )}
            </DialogTitle>

            <DialogContent>
                <CheckoutOfferBar offers={offers} showTickets={offers.tickets.length > 0} />
                {open ? (
                    <PayChannel
                        key={orderID}
                        price={payAmount}
                        originalPrice={price}
                        orderID={orderID}
                        seat={seat}
                        at={storeId}
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
