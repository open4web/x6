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
import MyDataAppBar from "../common/MyData";
import {FormatCurrentTime} from "../utils/time";
import HandoverPage from "../pages/Shift/Handover";
import MyShiftAppBar from "../common/MyShift";

const MyAppBar = (props: any) => {
    const { setShowProductImage, showProductImage, ready, setReady } = useCartContext();
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );

    const handleSwitchClick = () => {
        setShowProductImage(!showProductImage);
    };

    const handleReadyClick = () => {
        setReady(!ready);
    };

    // State to hold current time and date
    const [currentTime, setCurrentTime] = React.useState<string>(() => FormatCurrentTime());

    React.useEffect(() => {

        const intervalId = setInterval(() => {
            setCurrentTime(FormatCurrentTime());
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
                <Switch {...label} defaultChecked color={"warning"} onClick={handleReadyClick} />


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
                    gap: 4,
                    marginRight: "5px"
                }}
            >
                <MyDataAppBar />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginRight: "5px"
                }}
            >
                <MyShiftAppBar />
            </Box>

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
