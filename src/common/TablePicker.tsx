import * as React from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import {useTranslate} from 'react-admin';
import NumericKeyboardDialog from './NumericKeyboardDialog';
import {formatElapsed, liveElapsed, readStoreTables, seatLabel, StoreSeat, writeStoreTables} from '../utils/storeCache';
import axios from 'axios';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    storeId: string;
    onSave: (value: {tableNo: string; seatId?: string; people?: number}) => void;
};

const statusColor: Record<number, string> = {
    0: '#2e7d32',
    1: '#ed6c02',
    2: '#1565c0',
    3: '#9e9e9e',
};

export default function TablePicker({open, setOpen, storeId, onSave}: Props) {
    const translate = useTranslate();
    const [store, setStore] = React.useState(() => readStoreTables(storeId));
    const seats = store?.seats || [];
    const hasSeats = seats.length > 0;
    const [tab, setTab] = React.useState(hasSeats ? 0 : 1);
    const [selected, setSelected] = React.useState<StoreSeat | null>(null);
    const [tick, setTick] = React.useState(0);

    React.useEffect(() => {
        if (!open || !storeId) {
            return;
        }
        const cached = readStoreTables(storeId);
        setStore(cached);
        const load = async () => {
            try {
                const cookie = localStorage.getItem('cookie') || '';
                const response = await axios.get(`/v1/hlj/store/seat/${storeId}`, {
                    headers: {'Content-Type': 'application/json', Cookies: cookie, Authorization: cookie},
                });
                const list = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                const next = {
                    id: storeId,
                    name: cached?.name || '',
                    layout: cached?.layout,
                    seats: list,
                };
                writeStoreTables(storeId, next);
                setStore(next);
            } catch {
                setStore(cached);
            }
        };
        load();
        const timer = window.setInterval(() => setTick(value => value + 1), 1000);
        return () => window.clearInterval(timer);
    }, [open, storeId]);

    React.useEffect(() => {
        if (!open) {
            return;
        }
        setTab(hasSeats ? 0 : 1);
        const savedId = localStorage.getItem('selectedSeatId');
        setSelected(seats.find(item => item.id === savedId) || null);
    }, [open, hasSeats, seats]);

    const cols = Math.max(1, store?.layout?.cols || 6);
    const rows = Math.max(1, store?.layout?.rows || Math.ceil(seats.length / cols) || 1);

    const cells = React.useMemo(() => {
        return Array.from({length: cols * rows}, (_, index) => {
            const x = (index % cols) + 1;
            const y = Math.floor(index / cols) + 1;
            const seat = seats.find((item, seatIndex) => {
                const sx = Number(item.x) || ((seatIndex % cols) + 1);
                const sy = Number(item.y) || (Math.floor(seatIndex / cols) + 1);
                return sx === x && sy === y;
            });
            return {x, y, seat};
        });
    }, [seats, cols, rows, tick]);

    const confirmSeat = () => {
        if (!selected) {
            return;
        }
        const tableNo = seatLabel(selected);
        localStorage.setItem('selectedSeatId', selected.id);
        localStorage.setItem('ticketNumber', tableNo);
        onSave({tableNo, seatId: selected.id, people: selected.capacity});
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
            <DialogTitle>{translate('pos.cart.pick_table')}</DialogTitle>
            <DialogContent>
                <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{mb: 1.5}}>
                    <Tab label={translate('pos.cart.pick_seat')} disabled={!hasSeats} />
                    <Tab label={translate('pos.cart.table_no')} />
                </Tabs>

                {tab === 0 && (
                    <>
                        <Box sx={{display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap'}}>
                            {[
                                {id: 0, key: 'empty'},
                                {id: 1, key: 'busy'},
                                {id: 2, key: 'reserved'},
                                {id: 3, key: 'disabled'},
                            ].map(item => (
                                <Chip
                                    key={item.id}
                                    size="small"
                                    label={translate(`pos.seat.${item.key}`)}
                                    sx={{bgcolor: statusColor[item.id], color: '#fff', fontWeight: 700}}
                                />
                            ))}
                        </Box>
                        {!hasSeats ? (
                            <Typography color="text.secondary">{translate('pos.seat.none')}</Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${cols}, minmax(88px, 1fr))`,
                                    gap: 1,
                                }}
                            >
                                {cells.map(cell => {
                                    const seat = cell.seat;
                                    if (!seat) {
                                        return <Box key={`${cell.x}-${cell.y}`} sx={{minHeight: 84, borderRadius: 1, bgcolor: '#f5f5f5'}} />;
                                    }
                                    const disabled = seat.status === 3 || seat.status === 2;
                                    const active = selected?.id === seat.id;
                                    const elapsed = seat.status === 1 || seat.status === 2 ? liveElapsed(seat) : 0;
                                    return (
                                        <Box
                                            key={seat.id}
                                            onClick={() => !disabled && seat.status !== 3 && setSelected(seat)}
                                            sx={{
                                                minHeight: 84,
                                                p: 1,
                                                borderRadius: 1.5,
                                                cursor: disabled ? 'not-allowed' : 'pointer',
                                                bgcolor: statusColor[Number(seat.status) || 0],
                                                color: '#fff',
                                                outline: active ? '3px solid #111' : 'none',
                                                opacity: seat.status === 3 ? 0.45 : 1,
                                            }}
                                        >
                                            <Typography sx={{fontWeight: 800, fontSize: '1rem'}} noWrap>
                                                {seatLabel(seat)}
                                            </Typography>
                                            <Typography variant="caption" sx={{display: 'block', opacity: 0.92}}>
                                                {translate('pos.seat.capacity', {count: seat.capacity || 2})}
                                                {seat.area ? ` · ${seat.area}` : ''}
                                            </Typography>
                                            {(seat.status === 1 || seat.status === 2) && (
                                                <Typography variant="caption" sx={{display: 'block', fontWeight: 700}}>
                                                    {formatElapsed(elapsed)}
                                                </Typography>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </>
                )}

                {tab === 1 && (
                    <NumericKeyboardDialog
                        open={open}
                        setOpen={setOpen}
                        onSave={(value) => {
                            localStorage.removeItem('selectedSeatId');
                            localStorage.setItem('ticketNumber', value);
                            onSave({tableNo: value});
                        }}
                        title={translate('pos.cart.table_no')}
                        min={1}
                        max={999}
                        inline
                    />
                )}
            </DialogContent>
            {tab === 0 && (
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>{translate('pos.keypad.cancel')}</Button>
                    <Button variant="contained" disabled={!selected} onClick={confirmSeat}>
                        {translate('pos.cart.confirm_seat')}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}
