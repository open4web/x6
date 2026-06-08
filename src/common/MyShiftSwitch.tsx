import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useFetchData } from './FetchData';
import { useCartContext } from "../dataProvider/MyCartProvider";
import Switch from "@mui/material/Switch";

export default function MyShiftSwitch() {
    const {
        merchantId,
        ready,
        setReady,
        startReady,
        setStartReady
    } = useCartContext();

    const { fetchData } = useFetchData();

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

    // ==================== 初始化 elapsedTime（优先使用 startReady） ====================
    React.useEffect(() => {
        if (ready && startReady) {
            let serverStartMs: number;

            if (typeof startReady === 'string') {
                serverStartMs = new Date(startReady).getTime();
            } else if (typeof startReady === 'number') {
                serverStartMs = startReady * 1000;   // 假设是秒级时间戳
            } else {
                serverStartMs = Date.now();
            }

            const secondsElapsed = Math.floor((Date.now() - serverStartMs) / 1000);
            setElapsedTime(Math.max(0, secondsElapsed));
        } else if (!ready) {
            setElapsedTime(0);
        }
    }, [ready, startReady]);

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
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
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

                        const serverStart = res.start || res.data?.start;

                        // 更新 Context 中的 startReady
                        if (setStartReady) {
                            setStartReady(serverStart);
                        }

                        // 保存到 localStorage（带 merchantId 区分）
                        localStorage.setItem(`shiftReady:${merchantId}`, JSON.stringify(newReady));
                        if (serverStart) {
                            localStorage.setItem(`shiftReadyTime:${merchantId}`, JSON.stringify(serverStart));
                        }

                        setReady(newReady);
                    },
                    "POST",
                    {}
                );
            } catch (err) {
                console.error('Failed to start shift:', err);
                return; // 失败不切换状态
            }
        } else {
            // 暂停或继续
            setReady(newReady);
            localStorage.setItem(`shiftReady:${merchantId}`, JSON.stringify(newReady));
        }
    };

    return (
        <>
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
        </>
    );
}

const label = { inputProps: { 'aria-label': 'Switch demo' } };