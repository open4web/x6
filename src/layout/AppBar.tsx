import * as React from 'react';
import {AppBar, Logout, UserMenu, useTranslate} from 'react-admin';
import {
    Box,
    useMediaQuery,
    Theme,
} from '@mui/material';
import Logo from './Logo';
import {AppBarToolbar} from './AppBarToolbar';

const CustomAppBar = (props: any) => {
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );
    return (
        <AppBar
            {...props}
            color="secondary"
            // toolbar={<AppBarToolbar />}
            userMenu={<AppBarToolbar/>}
            // elevation={1}
            // userMenu={<CustomUserMenu />}
        >

            {/*<MyAppBadge/>*/}
            {isLargeEnough && <Logo/>}
            {isLargeEnough && <Box component="span" sx={{flex: 1}}/>}
        </AppBar>
    );
};

export default CustomAppBar;
