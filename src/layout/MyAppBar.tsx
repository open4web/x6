import * as React from 'react';
import { AppBar } from 'react-admin';
import {
    Box,
    useMediaQuery,
    Theme,
} from '@mui/material';
import MerchantSelect from "../common/MerchantSelect";
import MyPrinter from "../common/MyPrinter";
import MyDataAppBar from "../common/MyData";
import { FormatCurrentTime } from "../utils/time";
import MyShiftAppBar from "../common/MyShift";
import MyShiftSwitch from "../common/MyShiftSwitch";
import Version from "../common/Version"
import AppearanceMenu from "./AppearanceMenu";

const MyAppBar = (props: any) => {
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );

    const [currentTime, setCurrentTime] = React.useState<string>(() => FormatCurrentTime());

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(FormatCurrentTime());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <AppBar {...props} color="primary">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MerchantSelect />
                <MyShiftSwitch/>
                <MyShiftAppBar />
                <Box sx={{ ml: 1, color: 'white', fontSize: '1rem', whiteSpace: 'nowrap', opacity: 0.92 }}>
                    {currentTime}
                </Box>
            </Box>

            {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: "5px" }}>
                <MyDataAppBar />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AppearanceMenu />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MyPrinter />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Version />
            </Box>
        </AppBar>
    );
};

export default MyAppBar;