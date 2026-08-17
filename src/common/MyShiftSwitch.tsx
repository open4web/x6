import * as React from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import {useFetchData} from './FetchData';
import {useCartContext} from '../dataProvider/MyCartProvider';

const formatShiftTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hours, minutes, secs].map(part => String(part).padStart(2, '0')).join(':');
};

export default function MyShiftSwitch() {
    const {merchantId, ready, setReady, startReady, setStartReady, setShiftOpen} = useCartContext();
    const {fetchData} = useFetchData();
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [starting, setStarting] = React.useState(false);
    const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    React.useEffect(() => {
        if (ready && startReady) {
            let serverStartMs: number;
            if (typeof startReady === 'string') {
                serverStartMs = new Date(startReady).getTime();
            } else if (typeof startReady === 'number' && startReady > 0) {
                serverStartMs = startReady < 1e12 ? startReady * 1000 : startReady;
            } else {
                serverStartMs = Date.now();
            }
            setElapsedTime(Math.max(0, Math.floor((Date.now() - serverStartMs) / 1000)));
        } else if (!ready) {
            setElapsedTime(0);
        }
    }, [ready, startReady]);

    React.useEffect(() => {
        if (ready) {
            intervalRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [ready]);

    const startShift = async () => {
        setStarting(true);
        try {
            await fetchData(
                `/v1/hlj/finance/shift/start/${merchantId}`,
                (res: any) => {
                    const serverStart = res.start || res.data?.start;
                    if (setStartReady) {
                        setStartReady(serverStart);
                    }
                    localStorage.setItem(`shiftReady:${merchantId}`, JSON.stringify(true));
                    if (serverStart) {
                        localStorage.setItem(`shiftReadyTime:${merchantId}`, JSON.stringify(serverStart));
                    }
                    setReady(true);
                    setConfirmOpen(false);
                },
                'POST',
                {},
            );
        } catch (err) {
            console.error('Failed to start shift:', err);
        } finally {
            setStarting(false);
        }
    };

    const handleClick = () => {
        if (ready) {
            setShiftOpen(true);
            return;
        }
        setConfirmOpen(true);
    };

    return (
        <>
            <Button
                variant={ready ? 'contained' : 'outlined'}
                color={ready ? 'success' : 'inherit'}
                onClick={handleClick}
                disableElevation
                sx={{
                    minWidth: ready ? 168 : 112,
                    height: 34,
                    px: 1.5,
                    borderRadius: 5,
                    textTransform: 'none',
                    fontWeight: 700,
                    color: ready ? '#fff' : 'inherit',
                    borderColor: ready ? 'transparent' : 'rgba(255,255,255,0.55)',
                    bgcolor: ready ? '#2e7d32' : 'rgba(255,255,255,0.08)',
                    '&:hover': {
                        bgcolor: ready ? '#256628' : 'rgba(255,255,255,0.16)',
                        borderColor: ready ? 'transparent' : '#fff',
                    },
                }}
            >
                {ready ? (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: '#b9f6ca',
                                boxShadow: '0 0 0 4px rgba(185,246,202,0.28)',
                            }}
                        />
                        <Typography variant="body2" sx={{fontWeight: 700, letterSpacing: 0.2}}>
                            值班中 {formatShiftTime(elapsedTime)}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                        <PlayArrowRoundedIcon sx={{fontSize: 20}} />
                        开始值班
                    </Box>
                )}
            </Button>

            <Dialog open={confirmOpen} onClose={() => !starting && setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{fontWeight: 700}}>开始本班值班？</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        开始后将记录本班次的营业时间和收银数据。结束值班请走交接班，不能用开关随便关掉。
                    </Typography>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 2}}>
                    <Button onClick={() => setConfirmOpen(false)} disabled={starting}>
                        取消
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={startShift}
                        disabled={starting}
                        startIcon={starting ? <CircularProgress size={16} color="inherit" /> : <PlayArrowRoundedIcon />}
                    >
                        开始值班
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
