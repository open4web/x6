import {useEffect} from 'react';
import axios from 'axios';
import {useCartContext} from '../dataProvider/MyCartProvider';

const POLL_INTERVAL_MS = 1500;
const MAX_ATTEMPTS = 20;

function unwrapOrder(payload: any) {
    if (!payload) {
        return null;
    }
    if (payload.identity || typeof payload.status === 'number') {
        return payload;
    }
    if (payload.data && (payload.data.identity || typeof payload.data.status === 'number')) {
        return payload.data;
    }
    return null;
}

async function fetchOrderSilent(orderID: string) {
    const cookie = localStorage.getItem('cookie') || '';
    const response = await axios({
        method: 'GET',
        url: `/v1/hlj/order/pos/${orderID}`,
        headers: {
            'Content-Type': 'application/json',
            Cookies: cookie,
            Authorization: cookie,
        },
    });
    return unwrapOrder(response.data);
}

function isPaid(order: any, _orderID: string) {
    if (!order || typeof order.status !== 'number') {
        return false;
    }
    return order.status >= 1 && order.status < 6;
}

const LIST_POLL_INTERVAL_MS = 1000;
const LIST_MAX_ATTEMPTS = 20;

function unwrapOrderList(payload: any): any[] {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }
    if (payload?.identity || typeof payload?.status === 'number') {
        return [payload];
    }
    return [];
}

async function fetchOrderListSilent(orderNo: string) {
    const cookie = localStorage.getItem('cookie') || '';
    const response = await axios({
        method: 'GET',
        url: '/v1/hlj/order/pos?filter=' + JSON.stringify({order_no: orderNo}),
        headers: {
            'Content-Type': 'application/json',
            Cookies: cookie,
            Authorization: cookie,
        },
    });
    return unwrapOrderList(response.data);
}

function listHasOrder(list: any[], orderNo: string) {
    return list.some(order => order?.identity?.order_no === orderNo || order?.id === orderNo);
}

export function OrderListWatcher() {
    const {
        syncingOrderNo,
        markOrderListReady,
        setOrderSyncProgress,
    } = useCartContext();

    useEffect(() => {
        if (!syncingOrderNo) {
            return;
        }

        let cancelled = false;
        let attempts = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const tick = async () => {
            if (cancelled) {
                return;
            }
            try {
                const list = await fetchOrderListSilent(syncingOrderNo);
                if (!cancelled && listHasOrder(list, syncingOrderNo)) {
                    markOrderListReady(syncingOrderNo);
                    return;
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    return;
                }
            }

            attempts += 1;
            if (!cancelled) {
                setOrderSyncProgress(Math.min(92, attempts * 8));
            }
            if (!cancelled && attempts < LIST_MAX_ATTEMPTS) {
                timer = setTimeout(tick, LIST_POLL_INTERVAL_MS);
            } else if (!cancelled) {
                markOrderListReady(syncingOrderNo);
            }
        };

        tick();

        return () => {
            cancelled = true;
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [syncingOrderNo, markOrderListReady, setOrderSyncProgress]);

    return null;
}

export function PaymentWatcher() {
    const {watchingOrderNo, notifyOrderPaid} = useCartContext();

    useEffect(() => {
        if (!watchingOrderNo) {
            return;
        }

        let cancelled = false;
        let attempts = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const tick = async () => {
            if (cancelled) {
                return;
            }
            try {
                const order = await fetchOrderSilent(watchingOrderNo);
                if (!cancelled && isPaid(order, watchingOrderNo)) {
                    notifyOrderPaid(order?.identity?.order_no || watchingOrderNo);
                    return;
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    return;
                }
            }

            attempts += 1;
            if (!cancelled && attempts < MAX_ATTEMPTS) {
                timer = setTimeout(tick, POLL_INTERVAL_MS);
            }
        };

        tick();

        return () => {
            cancelled = true;
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [watchingOrderNo, notifyOrderPaid]);

    return null;
}

export const useOrderPolling = (_fetchData: any, _setOrderDrawerOpen: any) => {
    const {startPaymentWatch} = useCartContext();
    return {
        pollOrder: async (orderID: string) => {
            startPaymentWatch(orderID);
        },
    };
};
