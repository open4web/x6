import * as React from 'react';
import { AppBar } from 'react-admin';
import {
    Box,
    useMediaQuery,
    Theme,
    Badge,
    Typography,
} from '@mui/material';
import MerchantSelect from "../common/MerchantSelect";
import { useCartContext } from "../dataProvider/MyCartProvider";
import Switch from "@mui/material/Switch";
import MyPrinter from "../common/MyPrinter";
import MyDataAppBar from "../common/MyData";
import { FormatCurrentTime } from "../utils/time";
import MyShiftAppBar from "../common/MyShift";
import {useFetchData} from "../common/FetchData";

const MyAppBar = (props: any) => {
    const {
        setShowProductImage,
        showProductImage,
        ready,
        setReady,
        // 如果你的 Context 里已经有了 shiftStartTime，可以直接从这里拿
        // shiftStartTime, setShiftStartTime
        merchantId,
    } = useCartContext();
    const { fetchData } = useFetchData();

    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );

    const handleSwitchClick = () => {
        setShowProductImage(!showProductImage);
    };

    // ==================== 新增：Shift Ready 计时逻辑 ====================
    const [elapsedTime, setElapsedTime] = React.useState<number>(0); // 秒数
    const [isRunning, setIsRunning] = React.useState<boolean>(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // 格式化成 “0时0分30秒”
    const formatShiftTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}时${minutes}分${secs}秒`;
    };

    // 启动/暂停计时器
    React.useEffect(() => {
        if (ready && !isRunning) {
            // 开始或恢复计时
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else if (!ready && isRunning) {
            // 暂停计时
            setIsRunning(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [ready, isRunning]);

    // 首次点击 ready = true 时，向后端发送开始请求
    const handleReadyClick = async () => {
        const newReady = !ready;

        if (newReady && elapsedTime === 0) {
            // 首次开启班次
            try {
                // 示例 fetch 调用（根据你的项目风格调整）
                await fetchData('/v1/hlj/finance/shift/start/' + merchantId, (res: any) => {
                    console.log('Shift started on backend:', res.data);
                    // 如果后端返回了开始时间戳，可以据此初始化 elapsedTime
                    const serverStartTime = new Date(res.start).getTime();
                    setElapsedTime(Math.floor((Date.now() - serverStartTime) / 1000));

                }, "POST", {});
            } catch (err) {
                console.error('Failed to start shift:', err);
                // 可根据需要回滚 setReady
                return; // 失败不切换状态
            }
        }

        setReady(newReady);
    };

    // 当前时间显示（原有逻辑）
    const [currentTime, setCurrentTime] = React.useState<string>(() => FormatCurrentTime());

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(FormatCurrentTime());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <AppBar {...props} color="primary">
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <MerchantSelect />

                <Switch {...label} defaultChecked color="error" onClick={handleSwitchClick} />

                {/* Ready 开关 + 时间统计 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Switch
                        {...label}
                        checked={ready}
                        color="warning"
                        onClick={handleReadyClick}
                    />
                    {ready && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                minWidth: '120px',
                            }}
                        >
                            {formatShiftTime(elapsedTime)}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        marginLeft: 1,
                        color: 'white',
                        fontSize: '1rem',
                        whiteSpace: 'nowrap',
                    }}
                >
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