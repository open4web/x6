import * as React from 'react';
import { AppBar } from 'react-admin';
import {
    Box,
    useMediaQuery,
    Theme,
    Typography,
} from '@mui/material';
import MerchantSelect from "../common/MerchantSelect";
import { useCartContext } from "../dataProvider/MyCartProvider";
import Switch from "@mui/material/Switch";
import MyPrinter from "../common/MyPrinter";
import MyDataAppBar from "../common/MyData";
import { FormatCurrentTime } from "../utils/time";
import MyShiftAppBar from "../common/MyShift";
import { useFetchData } from "../common/FetchData";
import MyShiftSwitch from "../common/MyShiftSwitch";

const MyAppBar = (props: any) => {
    const {
        setShowProductImage,
        showProductImage,
        ready,
        setReady,
        merchantId,
    } = useCartContext();

    const { fetchData } = useFetchData();

    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );

    const handleSwitchClick = () => {
        setShowProductImage(!showProductImage);
    };



    // 当前时间
    const [currentTime, setCurrentTime] = React.useState<string>(() => FormatCurrentTime());

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(FormatCurrentTime());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <AppBar {...props} color="primary">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MerchantSelect />

                {/*<Switch {...label} defaultChecked color="error" onClick={handleSwitchClick} />*/}

                {/* Ready 开关 + 计时显示 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MyShiftSwitch/>
                </Box>

                <Box sx={{ marginLeft: 1, color: 'white', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                    {currentTime}
                </Box>
            </Box>

            {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: "5px" }}>
                <MyDataAppBar />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: "5px" }}>
                <MyShiftAppBar />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MyPrinter />
            </Box>
        </AppBar>
    );
};

export default MyAppBar;

const label = { inputProps: { 'aria-label': 'Switch demo' } };