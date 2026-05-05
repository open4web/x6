// MemberBalancePay.tsx
import React from 'react';
import { Box } from '@mui/material';
import MemberSelector from './MemberSelector';

interface Props {
    value: number;
    index: number;
    price: number;
    orderID: string;
    fetchData: any;
    setCart: any;
    setOpen: any;
    setOrderDrawerOpen: any;
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
                                             orderID,
                                             fetchData,
                                             setCart,
                                             setOpen,
                                             setOrderDrawerOpen,
                                         }: Props) {
    return (
        <CustomTabPanel value={value} index={index}>
            <MemberSelector
                price={price}
                orderID={orderID}
                fetchData={fetchData}
                onSuccess={() => {
                    setCart([]);
                    setOpen(false);
                    setOrderDrawerOpen(true);
                }}
            />
        </CustomTabPanel>
    );
}