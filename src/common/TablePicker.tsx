import * as React from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import {useTranslate} from 'react-admin';
import {toast} from 'react-toastify';
import axios from 'axios';
import NumericKeyboardDialog from './NumericKeyboardDialog';
import PaymentDialog from './PaymentDialog';
import MyOrderDetail, {OpenReason} from './MyOrderDetail';
import {useFetchData} from './FetchData';
import {useCartContext} from '../dataProvider/MyCartProvider';
import {Order} from '../pages/home/Components/types';
import {formatElapsed, liveElapsed, readStoreTables, seatLabel, StoreSeat, writeStoreTables} from '../utils/storeCache';

export type TableSaveValue = {
    tableNo: string;
    seatId?: string;
    people?: number;
    intent?: 'open' | 'add' | 'order';
};

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    storeId: string;
    onSave: (value: TableSaveValue) => void;
};

const statusColor: Record<number, string> = {
    0: '#2e7d32',
    1: '#ed6c02',
    2: '#1565c0',
    3: '#9e9e9e',
};

function authHeaders() {
    const cookie = localStorage.getItem('cookie') || '';
    return {'Content-Type': 'application/json', Cookies: cookie, Authorization: cookie};
}

function unwrapOrder(payload: any): Order | null {
    if (!payload) {
        return null;
    }
    if (payload.identity || typeof payload.status === 'number') {
        return payload;
    }
    if (payload.data && (payload.data.identity || typeof payload.data.status === 'number')) {
        return payload.data;
    }
    if (Array.isArray(payload) && payload[0]) {
        return payload[0];
    }
    if (Array.isArray(payload?.data) && payload.data[0]) {
        return payload.data[0];
    }
    return null;
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

function todayRange() {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const day = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    return {
        start: `${day} 00:00:00`,
        end: `${day} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    };
}

export default function TablePicker({open, setOpen, storeId, onSave}: Props) {
    const translate = useTranslate();
    const {fetchData} = useFetchData();
    const {setDrawerOpen} = useCartContext();
    const [store, setStore] = React.useState(() => readStoreTables(storeId));
    const seats = store?.seats || [];
    const hasSeats = seats.length > 0;
    const [tab, setTab] = React.useState(hasSeats ? 0 : 1);
    const [selected, setSelected] = React.useState<StoreSeat | null>(null);
    const [tick, setTick] = React.useState(0);
    const [acting, setActing] = React.useState(false);
    const [payOrder, setPayOrder] = React.useState<Order | null>(null);
    const [detailOrder, setDetailOrder] = React.useState<Order | null>(null);
    const billedSeatRef = React.useRef<StoreSeat | null>(null);

    const applySeats = (list: StoreSeat[], keepId?: string) => {
        const cached = readStoreTables(storeId) || store;
        const next = {
            ...cached,
            id: storeId,
            name: cached?.name || store?.name || '',
            layout: cached?.layout || store?.layout,
            seats: list,
        };
        writeStoreTables(storeId, next);
        setStore(next);
        const id = keepId || selected?.id;
        setSelected(list.find(item => item.id === id) || null);
    };

    React.useEffect(() => {
        if (!open || !storeId) {
            return;
        }
        const cached = readStoreTables(storeId);
        setStore(cached);
        const load = async () => {
            try {
                const response = await axios.get(`/v1/hlj/store/seat/${storeId}`, {headers: authHeaders()});
                applySeats(unwrapSeats(response.data), localStorage.getItem('selectedSeatId') || undefined);
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
        setSelected(seats.find(item => item.id === savedId) || selected || null);
    }, [open, hasSeats]);

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

    const bindSeat = (seat: StoreSeat, intent: TableSaveValue['intent']) => {
        const tableNo = seatLabel(seat);
        localStorage.setItem('selectedSeatId', seat.id);
        localStorage.setItem('ticketNumber', tableNo);
        if (seat.capacity && !localStorage.getItem('peopleNumber')) {
            localStorage.setItem('peopleNumber', String(seat.capacity));
        }
        onSave({tableNo, seatId: seat.id, people: seat.capacity, intent});
        setOpen(false);
        setDrawerOpen(true);
    };

    const patchSeat = async (seat: StoreSeat, status: number) => {
        setActing(true);
        try {
            const response = await axios.put(`/v1/hlj/store/seat/${storeId}`, {
                id: seat.id,
                status,
            }, {headers: authHeaders()});
            const list = unwrapSeats(response.data);
            if (list.length) {
                applySeats(list, seat.id);
            } else {
                applySeats(seats.map(item => item.id === seat.id ? {
                    ...item,
                    status,
                    order_no: status === 0 ? '' : item.order_no,
                    occupied_at: status === 1 ? Math.floor(Date.now() / 1000) : 0,
                    reserved_at: status === 2 ? Math.floor(Date.now() / 1000) : 0,
                } : item), seat.id);
            }
            return true;
        } catch {
            toast.error(translate('pos.common.failed', {text: seatLabel(seat)}), {position: 'top-center', autoClose: 1800});
            return false;
        } finally {
            setActing(false);
        }
    };

    const fetchOrderForSeat = async (seat: StoreSeat) => {
        const tableNo = seatLabel(seat);
        if (seat.order_no) {
            try {
                const response = await axios.get(`/v1/hlj/order/pos/${seat.order_no}`, {headers: authHeaders()});
                const order = unwrapOrder(response.data);
                if (order) {
                    return order;
                }
            } catch {
                // fall through to list lookup
            }
            try {
                const response = await axios.get('/v1/hlj/order/pos?filter=' + JSON.stringify({order_no: seat.order_no}), {
                    headers: authHeaders(),
                });
                const order = unwrapOrder(response.data);
                if (order) {
                    return order;
                }
            } catch {
                // fall through
            }
        }
        const range = todayRange();
        const response = await axios.get('/v1/hlj/order/pos?filter=' + JSON.stringify({
            start_gte: range.start,
            end_lte: range.end,
            onlyMyOrder: 0,
        }), {headers: authHeaders()});
        const list = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        const matched = (list as Order[]).filter(item => {
            const no = String(item?.identity?.table_no || (item as any)?.seat || '');
            return no === tableNo || no === seat.id || no === seat.name || no === (seat.table_no || '');
        });
        return matched.find(item => item.status === 0) || matched[0] || null;
    };

    const checkoutSeat = async (seat: StoreSeat) => {
        setActing(true);
        try {
            const order = await fetchOrderForSeat(seat);
            if (!order?.identity?.order_no) {
                toast.warning(translate('pos.seat.no_order'), {position: 'top-center', autoClose: 1800});
                return;
            }
            billedSeatRef.current = seat;
            setSelected(seat);
            setOpen(false);
            if (order.status === 0) {
                setPayOrder(order);
            } else {
                setDetailOrder(order);
            }
        } catch {
            toast.error(translate('pos.seat.checkout_fail'), {position: 'top-center', autoClose: 1800});
        } finally {
            setActing(false);
        }
    };

    const hintKey = (status: number) => {
        if (status === 1) {
            return 'pos.seat.checkout';
        }
        if (status === 2) {
            return 'pos.seat.seat_in';
        }
        if (status === 0) {
            return 'pos.seat.open';
        }
        return '';
    };

    const status = Number(selected?.status) || 0;

    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
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
                                        gridTemplateColumns: `repeat(${cols}, minmax(96px, 1fr))`,
                                        gap: 1,
                                    }}
                                >
                                    {cells.map(cell => {
                                        const seat = cell.seat;
                                        if (!seat) {
                                            return <Box key={`${cell.x}-${cell.y}`} sx={{minHeight: 92, borderRadius: 1, bgcolor: '#f5f5f5'}} />;
                                        }
                                        const off = seat.status === 3;
                                        const active = selected?.id === seat.id;
                                        const elapsed = seat.status === 1 || seat.status === 2 ? liveElapsed(seat) : 0;
                                        const hint = hintKey(Number(seat.status) || 0);
                                        return (
                                            <Box
                                                key={seat.id}
                                                onClick={() => !off && setSelected(seat)}
                                                sx={{
                                                    minHeight: 92,
                                                    p: 1,
                                                    borderRadius: 1.5,
                                                    cursor: off ? 'not-allowed' : 'pointer',
                                                    bgcolor: statusColor[Number(seat.status) || 0],
                                                    color: '#fff',
                                                    outline: active ? '3px solid #111' : 'none',
                                                    opacity: off ? 0.45 : 1,
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
                                                        {seat.order_no ? ` · ${String(seat.order_no).slice(-6)}` : ''}
                                                    </Typography>
                                                )}
                                                {hint && (
                                                    <Typography variant="caption" sx={{display: 'block', fontWeight: 800, mt: 0.25}}>
                                                        {translate(hint)}
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
                                onSave({tableNo: value, intent: 'order'});
                                setDrawerOpen(true);
                            }}
                            title={translate('pos.cart.table_no')}
                            min={1}
                            max={999}
                            inline
                        />
                    )}
                </DialogContent>
                {tab === 0 && (
                    <DialogActions sx={{flexWrap: 'wrap', gap: 1, px: 2, pb: 2}}>
                        <Button onClick={() => setOpen(false)} disabled={acting}>
                            {translate('pos.keypad.cancel')}
                        </Button>
                        {selected && status === 0 && (
                            <>
                                <Button
                                    variant="outlined"
                                    disabled={acting}
                                    onClick={async () => {
                                        const ok = await patchSeat(selected, 2);
                                        if (ok) {
                                            toast.success(translate('pos.seat.reserved_ok'), {position: 'top-center', autoClose: 1200});
                                        }
                                    }}
                                >
                                    {translate('pos.seat.reserve')}
                                </Button>
                                <Button variant="contained" disabled={acting} onClick={() => bindSeat(selected, 'open')}>
                                    {translate('pos.seat.open')}
                                </Button>
                            </>
                        )}
                        {selected && status === 1 && (
                            <>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    disabled={acting}
                                    onClick={async () => {
                                        const ok = await patchSeat(selected, 0);
                                        if (ok) {
                                            localStorage.removeItem('selectedSeatId');
                                            localStorage.removeItem('ticketNumber');
                                            toast.success(translate('pos.seat.cleared'), {position: 'top-center', autoClose: 1200});
                                        }
                                    }}
                                >
                                    {translate('pos.seat.clear')}
                                </Button>
                                <Button variant="outlined" disabled={acting} onClick={() => bindSeat(selected, 'add')}>
                                    {translate('pos.seat.add')}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    disabled={acting}
                                    onClick={() => checkoutSeat(selected)}
                                    startIcon={acting ? <CircularProgress size={16} color="inherit" /> : undefined}
                                >
                                    {translate('pos.seat.checkout')}
                                </Button>
                            </>
                        )}
                        {selected && status === 2 && (
                            <>
                                <Button
                                    variant="outlined"
                                    disabled={acting}
                                    onClick={async () => {
                                        const ok = await patchSeat(selected, 0);
                                        if (ok) {
                                            toast.success(translate('pos.seat.cleared'), {position: 'top-center', autoClose: 1200});
                                        }
                                    }}
                                >
                                    {translate('pos.seat.cancel_reserve')}
                                </Button>
                                <Button variant="contained" disabled={acting} onClick={() => bindSeat(selected, 'open')}>
                                    {translate('pos.seat.seat_in')}
                                </Button>
                            </>
                        )}
                    </DialogActions>
                )}
            </Dialog>
            {payOrder && (
                <PaymentDialog
                    open={!!payOrder}
                    onClose={() => setPayOrder(null)}
                    price={payOrder?.price?.pay_price || 0}
                    orderID={payOrder.identity?.order_no}
                    fetchData={fetchData}
                    storeId={payOrder?.merchant?.id || storeId}
                    onSuccess={() => {
                        if (billedSeatRef.current) {
                            patchSeat(billedSeatRef.current, 0);
                        }
                        setPayOrder(null);
                    }}
                />
            )}
            {detailOrder && (
                <MyOrderDetail
                    open={!!detailOrder}
                    orderData={detailOrder}
                    onClose={() => setDetailOrder(null)}
                    openOrderDetailWithReason={OpenReason.Default}
                />
            )}
        </>
    );
}
