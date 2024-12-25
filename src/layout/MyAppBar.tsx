import * as React from 'react';
import {AppBar} from 'react-admin';
import {
    Box,
    useMediaQuery,
    Theme,
} from '@mui/material';
import MerchantSelect from "../common/MerchantSelect";

const MyAppBar = (props: any) => {
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );
    return (
        <AppBar
            {...props}
            color="success"
        >
            <MerchantSelect/>
            {/* 避免右上角的按键挤到左上角*/}
            {isLargeEnough && <Box component="span" sx={{flex: 1}}/>}
        </AppBar>
    );
};

export default MyAppBar;
