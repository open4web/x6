import * as React from 'react';
import {Box, Button, Dialog, DialogContent, DialogTitle, Stack, Typography} from '@mui/material';
import {useTranslate} from 'react-admin';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useCartContext} from '../dataProvider/MyCartProvider';
import {
    formatElapsed,
    readStoreTables,
    seatLabel,
    StoreSeat,
    writeStoreTables,
} from '../utils/storeCache';
import {
    extraAfterDelay,
    holdKey,
    holdPhase,
    occupiedStartSec,
    pruneHoldExtras,
    readHoldExtras,
    SEATS_CHANGED,
    secondsUntilClear,
    writeHoldExtra,
} from '../utils/seatHold';
import {playPosSound} from '../utils/touchSound';

type PromptRow = {
    seat: StoreSeat;
    start: number;
    extra: number;
    left: number;
    table: string;
    elapsed: string;
};

function authHeaders() {
    const cookie = localStorage.getItem('cookie') || '';
    return {'Content-Type': 'application/json', Cookies: cookie, Authorization: cookie};
}

function unwrapSeats(payload: any): StoreSeat[] {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }
    return [];
}

export default function SeatHoldWatch() {
    const translate = useTranslate();
    const {merchantId} = useCartContext();
    const storeId = merchantId || localStorage.getItem('current_store_id') || '';
    const [prompts, setPrompts] = React.useState<PromptRow[]>([]);
    const seatsRef = React.useRef<StoreSeat[]>([]);
    const layoutRef = React.useRef<string | undefined>(undefined);
    const clearingRef = React.useRef<Set<string>>(new Set());
    const retryAtRef = React.useRef<Map<string, number>>(new Map());
    const warnedRef = React.useRef<Set<string>>(new Set());
    const storeIdRef = React.useRef(storeId);
    storeIdRef.current = storeId;

    const rememberSeats = React.useCallback((list: StoreSeat[]) => {
        const id = storeIdRef.current;
        seatsRef.current = list;
        const cached = readStoreTables(id);
        layoutRef.current = cached?.layout?.qr_display;
        if (id && cached) {
            writeStoreTables(id, {...cached, id, seats: list});
        }
    }, []);

    const refresh = React.useCallback(async () => {
        const id = storeIdRef.current;
        if (!id) {
            seatsRef.current = [];
            return;
        }
        try {
            const response = await axios.get(`/v1/hlj/store/seat/${id}`, {headers: authHeaders()});
            rememberSeats(unwrapSeats(response.data));
            const cached = readStoreTables(id);
            layoutRef.current = cached?.layout?.qr_display;
        } catch {
            const cached = readStoreTables(id);
            seatsRef.current = cached?.seats || [];
            layoutRef.current = cached?.layout?.qr_display;
        }
    }, [rememberSeats]);

    const clearSeat = React.useCallback(async (seat: StoreSeat) => {
        const id = storeIdRef.current;
        if (!id || !seat.id || clearingRef.current.has(seat.id)) {
            return;
        }
        const retryAt = retryAtRef.current.get(seat.id) || 0;
        if (retryAt > Date.now()) {
            return;
        }
        clearingRef.current.add(seat.id);
        const table = seatLabel(seat, layoutRef.current) || seat.name || seat.table_no || seat.id;
        try {
            const response = await axios.put(`/v1/hlj/store/seat/${id}`, {
                id: seat.id,
                status: 0,
            }, {headers: authHeaders()});
            const list = unwrapSeats(response.data);
            if (list.length) {
                rememberSeats(list);
            } else {
                rememberSeats(seatsRef.current.map(item => item.id === seat.id ? {
                    ...item,
                    status: 0,
                    occupied_at: 0,
                    reserved_at: 0,
                    order_no: '',
                    people: 0,
                    elapsed: 0,
                } : item));
            }
            if (localStorage.getItem('selectedSeatId') === seat.id) {
                localStorage.removeItem('selectedSeatId');
                localStorage.removeItem('ticketNumber');
            }
            window.dispatchEvent(new Event(SEATS_CHANGED));
            retryAtRef.current.delete(seat.id);
            toast.success(translate('pos.seat.auto_cleared', {table}), {position: 'top-center', autoClose: 2200});
        } catch {
            clearingRef.current.delete(seat.id);
            retryAtRef.current.set(seat.id, Date.now() + 15000);
        }
    }, [rememberSeats, translate]);

    const evaluate = React.useCallback(() => {
        const id = storeIdRef.current;
        if (!id) {
            setPrompts([]);
            return;
        }
        const now = Math.floor(Date.now() / 1000);
        const extras = readHoldExtras(id);
        const live = new Set<string>();
        const occupied = new Set<string>();
        const next: PromptRow[] = [];
        let playWarn = false;
        seatsRef.current.forEach(seat => {
            if (Number(seat.status) === 1 && seat.id) {
                occupied.add(seat.id);
            }
            const start = occupiedStartSec(seat);
            if (!start || !seat.id) {
                return;
            }
            const key = holdKey(seat.id, start);
            live.add(key);
            const extra = extras[key] || 0;
            const phase = holdPhase(start, extra, now);
            if (phase === 'clear') {
                void clearSeat(seat);
                return;
            }
            if (phase !== 'prompt') {
                return;
            }
            if (!warnedRef.current.has(key)) {
                warnedRef.current.add(key);
                playWarn = true;
            }
            next.push({
                seat,
                start,
                extra,
                left: secondsUntilClear(start, extra, now),
                table: seatLabel(seat, layoutRef.current) || seat.name || seat.table_no || seat.id,
                elapsed: formatElapsed(Math.max(0, now - start)),
            });
        });
        clearingRef.current.forEach(seatId => {
            if (!occupied.has(seatId)) {
                clearingRef.current.delete(seatId);
            }
        });
        pruneHoldExtras(id, live);
        if (playWarn) {
            playPosSound('warn');
        }
        setPrompts(prev => {
            if (!next.length && !prev.length) {
                return prev;
            }
            return next;
        });
    }, [clearSeat]);

    const evaluateRef = React.useRef(evaluate);
    const refreshRef = React.useRef(refresh);
    evaluateRef.current = evaluate;
    refreshRef.current = refresh;

    React.useEffect(() => {
        clearingRef.current.clear();
        retryAtRef.current.clear();
        warnedRef.current.clear();
        seatsRef.current = [];
        setPrompts([]);
        if (!storeId) {
            return;
        }
        let stopped = false;
        const run = () => {
            if (!stopped) {
                evaluateRef.current();
            }
        };
        void refreshRef.current().then(run);
        const poll = window.setInterval(() => {
            void refreshRef.current().then(run);
        }, 15000);
        const tick = window.setInterval(run, 1000);
        const onChange = () => {
            void refreshRef.current().then(run);
        };
        window.addEventListener(SEATS_CHANGED, onChange);
        return () => {
            stopped = true;
            window.clearInterval(poll);
            window.clearInterval(tick);
            window.removeEventListener(SEATS_CHANGED, onChange);
        };
    }, [storeId]);

    const delaySeat = (row: PromptRow) => {
        const id = storeIdRef.current;
        const now = Math.floor(Date.now() / 1000);
        const extra = extraAfterDelay(row.start, row.extra, now);
        writeHoldExtra(id, row.seat.id, row.start, extra);
        warnedRef.current.delete(holdKey(row.seat.id, row.start));
        toast.success(translate('pos.seat.delay_ok'), {position: 'top-center', autoClose: 1400});
        evaluate();
    };

    return (
        <Dialog
            open={prompts.length > 0}
            onClose={() => {}}
            hideBackdrop
            disableEnforceFocus
            disableAutoFocus
            disableScrollLock
            disableEscapeKeyDown
            fullWidth
            maxWidth="sm"
            sx={{pointerEvents: 'none', '& .MuiDialog-container': {alignItems: 'flex-start'}}}
            PaperProps={{sx: {pointerEvents: 'auto', mt: 8}}}
        >
            <DialogTitle sx={{fontWeight: 800, fontSize: 28}}>
                {translate('pos.seat.overtime')}
            </DialogTitle>
            <DialogContent sx={{maxHeight: '70vh'}}>
                <Stack spacing={2} sx={{pb: 1}}>
                    {prompts.map(row => (
                        <Box key={row.seat.id} sx={{p: 2, borderRadius: 2, bgcolor: '#ffb300', color: '#1a1a1a'}}>
                            <Typography sx={{fontWeight: 800, fontSize: 22}}>
                                {translate('pos.seat.overtime_line', {table: row.table, time: row.elapsed})}
                            </Typography>
                            <Typography sx={{my: 1, fontWeight: 700}}>
                                {translate('pos.seat.overtime_hint', {sec: row.left})}
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={() => delaySeat(row)}
                                sx={{
                                    minHeight: 64,
                                    fontSize: 20,
                                    fontWeight: 800,
                                    bgcolor: '#111',
                                    color: '#fff',
                                    '&:hover': {bgcolor: '#000'},
                                }}
                            >
                                {translate('pos.seat.delay')}
                            </Button>
                        </Box>
                    ))}
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
