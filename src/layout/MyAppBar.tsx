import * as React from 'react';
import { AppBar } from 'react-admin';
import {
    Box,
    useMediaQuery,
    Theme,
    Badge,
} from '@mui/material';
import MerchantSelect from "../common/MerchantSelect";
import { useCartContext } from "../dataProvider/MyCartProvider";
import Switch from "@mui/material/Switch";
import MyPrinter from "../common/MyPrinter";

const MyAppBar = (props: any) => {
    const { setShowProductImage, showProductImage } = useCartContext();
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );

    const handleSwitchClick = () => {
        setShowProductImage(!showProductImage);
    };

    // State to hold current time and date
    const [currentTime, setCurrentTime] = React.useState<string>(() => formatCurrentTime());

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(formatCurrentTime());
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <AppBar
            {...props}
            color="primary"
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <MerchantSelect />
                <Switch {...label} defaultChecked color={"error"} onClick={handleSwitchClick} />
                <Box
                    sx={{
                        marginLeft: 1,
                        color: 'white',
                        fontSize: '1rem',
                        whiteSpace: 'nowrap', // Prevent wrapping
                    }}
                >
                    {currentTime}
                </Box>
            </Box>
            {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <MyPrinter />
            </Box>
        </AppBar>
    );
};

export default MyAppBar;

const label = { inputProps: { 'aria-label': 'Switch demo' } };

// Utility function to format date and time
function formatCurrentTime() {
    const now = new Date();

    // Get weekday in Chinese
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];

    // Determine morning or evening
    const hours = now.getHours();
    const timeOfDay = hours < 12 ? '早上' : hours < 18 ? '下午' : '晚上';

    // Format date and time
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const date = String(now.getDate()).padStart(2, '0');
    const hour = String(hours).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    return `${year}年${month}月${date}日 ${hour}:${minute}:${second} ${timeOfDay} ${weekday}`;
}