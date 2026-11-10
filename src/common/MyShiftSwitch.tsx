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
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {useTranslate} from 'react-admin';
import {useFetchData} from './FetchData';
import {useCartContext} from '../dataProvider/MyCartProvider';
import {
    DutyBand,
    clearLocalDuty,
    dutyPhase,
    dutyUserId,
    elapsedSeconds,
    formatDutyClock,
    parseStartMs,
    readDutyPayload,
    writeLocalDuty,
} from './shiftDuty';

const BAND_CHROME: Record<DutyBand, {bg: string; hover: string; fg: string; dot: string}> = {
    green: {bg: '#2e7d32', hover: '#256628', fg: '#fff', dot: '#b9f6ca'},
    yellow: {bg: '#f9a825', hover: '#f57f17', fg: '#3e2723', dot: '#3e2723'},
    red: {bg: '#c62828', hover: '#b71c1c', fg: '#fff', dot: '#ffcdd2'},
};

export default function MyShiftSwitch() {
    const translate = useTranslate();
    const {merchantId, ready, setReady, startReady, setStartReady, shiftOpen, setShiftOpen} = useCartContext();
    const {fetchData} = useFetchData();
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [overtimeOpen, setOvertimeOpen] = React.useState(false);
    const [starting, setStarting] = React.useState(false);
    const [settled, setSettled] = React.useState(false);
    const syncRef = React.useRef(0);
    const promptedRef = React.useRef(false);
    const startMs = parseStartMs(startReady);
    const onDuty = ready && startMs > 0;
    const liveElapsed = onDuty ? elapsedSeconds(startMs, Date.now()) : 0;
    const phase = dutyPhase(liveElapsed);
    const chrome = BAND_CHROME[phase.band];
    const bandKey = phase.band === 'green'
        ? 'pos.shift.band_green'
        : phase.band === 'yellow'
            ? 'pos.shift.band_yellow'
            : 'pos.shift.band_red';

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
        setSettled(false);
        promptedRef.current = false;
        setOvertimeOpen(false);
        if (!merchantId) {
            applyDuty(false, 0);
            setSettled(true);
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
                if (duty) {
                    applyDuty(duty.ready, duty.start);
                }
                setSettled(true);
            })
            .catch(() => {
                if (cancelled || ticket !== syncRef.current) {
                    return;
                }
                // 读不到服务端时保留本机缓存，避免一次网络失败把正在值班的计时清掉。
                setSettled(true);
            });
        return () => {
            cancelled = true;
        };
    }, [merchantId, fetchData, applyDuty]);

    React.useEffect(() => {
        if (!onDuty) {
            if (overtimeOpen) {
                setOvertimeOpen(false);
            }
            return;
        }
        if (!settled) {
            return;
        }
        const elapsed = elapsedSeconds(startMs, Date.now());
        if (elapsed < 12 * 3600) {
            promptedRef.current = false;
            if (overtimeOpen) {
                setOvertimeOpen(false);
            }
            return;
        }
        // 交接班抽屉开着时不叠这层提示，关掉抽屉后仍会引导。
        if (promptedRef.current || shiftOpen) {
            return;
        }
        promptedRef.current = true;
        setOvertimeOpen(true);
    }, [settled, onDuty, startMs, elapsedTime, shiftOpen, overtimeOpen]);

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

    const dismissOvertime = () => {
        promptedRef.current = true;
        setOvertimeOpen(false);
    };

    const goHandover = () => {
        promptedRef.current = true;
        setOvertimeOpen(false);
        setShiftOpen(true);
    };

    const clock = formatDutyClock(liveElapsed);

    return (
        <>
            <Button
                variant={onDuty ? 'contained' : 'outlined'}
                color="inherit"
                onClick={handleClick}
                disableElevation
                aria-label={onDuty ? `${translate('pos.shift.on_duty')} ${clock} ${translate(bandKey)}` : undefined}
                sx={{
                    minWidth: onDuty ? 168 : 112,
                    height: 34,
                    px: 1.5,
                    borderRadius: 5,
                    textTransform: 'none',
                    fontWeight: 700,
                    color: onDuty ? chrome.fg : 'inherit',
                    borderColor: onDuty ? 'transparent' : 'rgba(255,255,255,0.55)',
                    bgcolor: onDuty ? chrome.bg : 'rgba(255,255,255,0.08)',
                    animation: onDuty && phase.band === 'red' ? 'dutyAlarm 1.6s ease-in-out infinite' : 'none',
                    '@keyframes dutyAlarm': {
                        '0%, 100%': {boxShadow: '0 0 0 0 rgba(198,40,40,0)'},
                        '50%': {boxShadow: '0 0 0 4px rgba(198,40,40,0.55)'},
                    },
                    '&:hover': {
                        bgcolor: onDuty ? chrome.hover : 'rgba(255,255,255,0.16)',
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
                                bgcolor: chrome.dot,
                                boxShadow: `0 0 0 4px ${chrome.dot}47`,
                            }}
                        />
                        <Typography variant="body2" sx={{fontWeight: 700, letterSpacing: 0.2, color: 'inherit', whiteSpace: 'nowrap'}}>
                            {translate('pos.shift.on_duty')} {clock}
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

            <Dialog open={overtimeOpen} onClose={dismissOvertime} maxWidth="xs" fullWidth>
                <DialogTitle sx={{fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, pr: 2}}>
                    <WarningAmberRoundedIcon color="error" />
                    {translate('pos.shift.overtime_title')}
                </DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        {translate('pos.shift.overtime_body', {time: clock})}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 2, gap: 1}}>
                    <Button onClick={dismissOvertime} sx={{minHeight: 44}}>
                        {translate('pos.shift.overtime_later')}
                    </Button>
                    <Button variant="contained" color="error" onClick={goHandover} autoFocus sx={{minHeight: 44, fontWeight: 700}}>
                        {translate('pos.shift.overtime_go')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
