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
import {useTranslate} from 'react-admin';
import {useFetchData} from './FetchData';
import {useCartContext} from '../dataProvider/MyCartProvider';
import {
    clearLocalDuty,
    dutyUserId,
    elapsedSeconds,
    parseStartMs,
    readDutyPayload,
    writeLocalDuty,
} from './shiftDuty';

const formatShiftTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hours, minutes, secs].map(part => String(part).padStart(2, '0')).join(':');
};

export default function MyShiftSwitch() {
    const translate = useTranslate();
    const {merchantId, ready, setReady, startReady, setStartReady, setShiftOpen} = useCartContext();
    const {fetchData} = useFetchData();
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [starting, setStarting] = React.useState(false);
    const syncRef = React.useRef(0);
    const startMs = parseStartMs(startReady);
    const onDuty = ready && startMs > 0;

    const applyDuty = React.useCallback((nextReady: boolean, start: number) => {
        const userId = dutyUserId();
        if (nextReady && start > 0) {
            writeLocalDuty(userId, merchantId, start);
            setStartReady(start);
            setReady(true);
            return;
        }
        clearLocalDuty(userId, merchantId);
        setStartReady(0);
        setReady(false);
    }, [merchantId, setReady, setStartReady]);

    React.useEffect(() => {
        if (!onDuty) {
            setElapsedTime(0);
            return;
        }
        const tick = () => setElapsedTime(elapsedSeconds(startMs, Date.now()));
        tick();
        const timer = window.setInterval(tick, 1000);
        return () => window.clearInterval(timer);
    }, [onDuty, startMs]);

    React.useEffect(() => {
        if (!merchantId) {
            applyDuty(false, 0);
            return;
        }
        const ticket = ++syncRef.current;
        let cancelled = false;
        fetchData(`/v1/hlj/finance/shift/state/${merchantId}`, () => undefined, 'GET', {}, true)
            .then((body) => {
                if (cancelled || ticket !== syncRef.current) {
                    return;
                }
                const duty = readDutyPayload(body);
                if (!duty) {
                    return;
                }
                applyDuty(duty.ready, duty.start);
            })
            .catch(() => {
                // 读不到服务端时保留本机缓存，避免一次网络失败把正在值班的计时清掉。
            });
        return () => {
            cancelled = true;
        };
    }, [merchantId, fetchData, applyDuty]);

    const startShift = async () => {
        const ticket = ++syncRef.current;
        setStarting(true);
        try {
            const body = await fetchData(
                `/v1/hlj/finance/shift/start/${merchantId}`,
                () => undefined,
                'POST',
                {},
            );
            if (ticket !== syncRef.current) {
                return;
            }
            const duty = readDutyPayload(body);
            if (!duty?.start) {
                applyDuty(false, 0);
                return;
            }
            applyDuty(true, duty.start);
            setConfirmOpen(false);
        } catch (err) {
            console.error('Failed to start shift:', err);
        } finally {
            setStarting(false);
        }
    };

    const handleClick = () => {
        if (onDuty) {
            setShiftOpen(true);
            return;
        }
        setConfirmOpen(true);
    };

    return (
        <>
            <Button
                variant={onDuty ? 'contained' : 'outlined'}
                color={onDuty ? 'success' : 'inherit'}
                onClick={handleClick}
                disableElevation
                sx={{
                    minWidth: onDuty ? 168 : 112,
                    height: 34,
                    px: 1.5,
                    borderRadius: 5,
                    textTransform: 'none',
                    fontWeight: 700,
                    color: onDuty ? '#fff' : 'inherit',
                    borderColor: onDuty ? 'transparent' : 'rgba(255,255,255,0.55)',
                    bgcolor: onDuty ? '#2e7d32' : 'rgba(255,255,255,0.08)',
                    '&:hover': {
                        bgcolor: onDuty ? '#256628' : 'rgba(255,255,255,0.16)',
                        borderColor: onDuty ? 'transparent' : '#fff',
                    },
                }}
            >
                {onDuty ? (
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
                            {translate('pos.shift.on_duty')} {formatShiftTime(elapsedTime)}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                        <PlayArrowRoundedIcon sx={{fontSize: 20}} />
                        {translate('pos.shift.start')}
                    </Box>
                )}
            </Button>

            <Dialog open={confirmOpen} onClose={() => !starting && setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{fontWeight: 700}}>{translate('pos.shift.confirm_title')}</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        {translate('pos.shift.confirm_body')}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 2}}>
                    <Button onClick={() => setConfirmOpen(false)} disabled={starting}>
                        {translate('pos.shift.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={startShift}
                        disabled={starting}
                        startIcon={starting ? <CircularProgress size={16} color="inherit" /> : <PlayArrowRoundedIcon />}
                    >
                        {translate('pos.shift.start')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
