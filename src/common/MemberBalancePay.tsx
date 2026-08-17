// MemberBalancePay.tsx
import React from 'react';
import { Box } from '@mui/material';
import MemberSelector from './MemberSelector';
import {useCartContext} from '../dataProvider/MyCartProvider';

interface Props {
    value: number;
    index: number;
    price: number;
    originalPrice?: number;
    orderID: string;
    fetchData: any;
    setCart: any;
    setOpen: any;
    setOrderDrawerOpen: any;
    offers?: any;
}

function CustomTabPanel({ children, value, index }: any) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function MemberBalancePay({
                                             value,
                                             index,
                                             price,
                                             originalPrice,
                                             orderID,
                                             fetchData,
                                             setCart,
                                             setOpen,
                                             setOrderDrawerOpen,
                                             offers,
                                         }: Props) {
    const {startPaymentWatch} = useCartContext();
    return (
        <CustomTabPanel value={value} index={index}>
            <MemberSelector
                price={price}
                originalPrice={originalPrice}
                orderID={orderID}
                fetchData={fetchData}
                offers={offers}
                onSuccess={async () => {
                    if (setCart) {
                        setCart([]);
                    }
                    setOpen(false);
                    startPaymentWatch(orderID);
                }}
            />
        </CustomTabPanel>
    );
}