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

    // ==================== Shift Ready 计时逻辑 ====================
    const [elapsedTime, setElapsedTime] = React.useState<number>(0);
    const [isRunning, setIsRunning] = React.useState<boolean>(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const formatShiftTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}时${minutes}分${secs}秒`;
    };

    // 计时器
    React.useEffect(() => {
        if (ready && !isRunning) {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else if (!ready && isRunning) {
            setIsRunning(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [ready]);

    // 处理 Ready 开关
    const handleReadyClick = async () => {
        const newReady = !ready;

        if (newReady && elapsedTime === 0) {
            // 首次启动班次
            try {
                await fetchData(
                    `/v1/hlj/finance/shift/start/${merchantId}`,
                    (res: any) => {
                        console.log('Shift started:', res);

                        // ==================== 关键修复 ====================
                        let serverStartMs: number;

                        if (typeof res.start === 'string') {
                            serverStartMs = new Date(res.start).getTime();
                        } else if (typeof res.start === 'number') {
                            // 后端大概率返回秒级时间戳 → 转成毫秒
                            serverStartMs = res.start * 1000;
                        } else {
                            serverStartMs = Date.now(); // fallback
                        }

                        const secondsElapsed = Math.floor((Date.now() - serverStartMs) / 1000);
                        setElapsedTime(Math.max(0, secondsElapsed)); // 防止负数
                    },
                    "POST",
                    {}
                );
            } catch (err) {
                console.error('Failed to start shift:', err);
                return; // 失败不切换状态
            }
        }

        setReady(newReady);
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
                    <Switch
                        {...label}
                        checked={ready}
                        color="error"
                        onClick={handleReadyClick}
                    />
                    {ready && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                minWidth: '130px',
                            }}
                        >
                            {formatShiftTime(elapsedTime)}
                        </Typography>
                    )}
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