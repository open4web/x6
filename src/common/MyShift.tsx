import * as React from 'react';
import Box from '@mui/material/Box';
import {useCartContext} from "../dataProvider/MyCartProvider";
import HandshakeIcon from '@mui/icons-material/Handshake';

export default function MyShiftAppBar() {
    const {shiftOpen, setShiftOpen} = useCartContext();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setShiftOpen(!shiftOpen)
    };
    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
            }}
            onClick={handleClick}
        >
            <HandshakeIcon color="inherit"/>
        </Box>
    );
}