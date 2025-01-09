import * as React from 'react';
import {AppBar} from 'react-admin';
import {
    Box,
    useMediaQuery,
    Theme,
} from '@mui/material';
import MerchantSelect from "../common/MerchantSelect";
import {useCartContext} from "../dataProvider/MyCartProvider";
import Switch from "@mui/material/Switch";

const MyAppBar = (props: any) => {
    const {  setShowProductImage, showProductImage } = useCartContext();
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );

    const handleSwitchClick = () => {
        setShowProductImage(!showProductImage)
    };

    return (
        <AppBar
            {...props}
            color="primary"
        >
            <MerchantSelect />
            <Switch {...label} defaultChecked color={"error"} onClick={handleSwitchClick}/>
            {/* 避免右上角的按键挤到左上角*/}
            {isLargeEnough && <Box component="span" sx={{flex: 1}}/>}
        </AppBar>
    );
};

export default MyAppBar;


const label = { inputProps: { 'aria-label': 'Switch demo' } };
