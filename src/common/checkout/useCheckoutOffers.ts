import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export type CampaignOffer = {
    id: string;
    name: string;
    type: string;
    benefit: number;
    label: string;
};

export type TicketOffer = {
    id: string;
    code: string;
    name: string;
    amount: number;
    threshold: number;
    coupon_type: string;
    overlay: boolean;
    benefit: number;
    expire_at: number;
    usable?: boolean;
    reason?: string;
    gap?: number;
};

const toAmount = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (value && typeof value === 'object') {
        const row = value as { real_price?: number; pay_price?: number; price?: number };
        const n = Number(row.real_price ?? row.pay_price ?? row.price ?? 0);
        return Number.isFinite(n) ? n : 0;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

const authHeaders = () => {
    const cookie = localStorage.getItem('cookie') || '';
    return {
        'Content-Type': 'application/json',
        Cookies: cookie,
        Authorization: cookie,
    };
};

export function useCheckoutOffers(amount: number, storeId?: string) {
    const [campaigns, setCampaigns] = useState<CampaignOffer[]>([]);
    const [tickets, setTickets] = useState<TicketOffer[]>([]);
    const [campaignId, setCampaignId] = useState('');
    const [ticketId, setTicketId] = useState('');
    const [memberId, setMemberId] = useState('');
    const [loading, setLoading] = useState(false);
    const orderAmount = toAmount(amount);

    const reload = useCallback(async (nextMemberIds?: string[]) => {
        if (!orderAmount || orderAmount <= 0) {
            setCampaigns([]);
            setTickets([]);
            return;
        }
        const members = nextMemberIds || (memberId ? [memberId] : []);
        setLoading(true);
        try {
            const { data } = await axios.post('/v1/hlj/active/pos/offers', {
                amount: orderAmount,
                store_id: storeId || localStorage.getItem('current_store_id') || '',
                member_id: members[0] || '',
                account_id: members[1] || members[0] || '',
                member_ids: members.filter(Boolean),
            }, { headers: authHeaders() });
            const payload = data?.tickets || data?.campaigns ? data : (data?.data || {});
            const list = payload?.campaigns || [];
            setCampaigns(list);
            setTickets(payload?.tickets || []);
            setCampaignId((prev) => {
                if (prev && list.some((item: CampaignOffer) => item.id === prev)) return prev;
                return payload?.best_campaign_id || '';
            });
            if (nextMemberIds !== undefined) {
                setTicketId('');
            }
        } catch {
            setCampaigns([]);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    }, [orderAmount, storeId, memberId]);

    useEffect(() => {
        reload();
    }, [orderAmount, storeId]);

    const bindMember = useCallback((id: string | { id?: string; uid?: string; account_id?: string }) => {
        const keys = typeof id === 'string'
            ? [id]
            : [id.uid, id.id, id.account_id].filter(Boolean) as string[];
        setMemberId(keys[0] || '');
        reload(keys);
    }, [reload]);

    const campaign = campaigns.find((item) => item.id === campaignId);
    const ticket = tickets.find((item) => item.id === ticketId);
    const campaignBenefit = ticket && ticket.overlay === false ? 0 : (campaign?.benefit || 0);
    const couponBenefit = ticket?.benefit || 0;
    const totalBenefit = Math.round((campaignBenefit + couponBenefit) * 100) / 100;
    const payAmount = Math.max(0, Math.round((orderAmount - totalBenefit) * 100) / 100);

    const redeem = useCallback(async (orderId: string) => {
        if (!campaignId && !ticketId) return;
        try {
            await axios.post('/v1/hlj/active/pos/redeem', {
                order_id: orderId,
                store_id: storeId || localStorage.getItem('current_store_id') || '',
                member_id: memberId,
                campaign_id: campaignId,
                ticket_id: ticketId,
                order_amount: orderAmount,
                benefit: totalBenefit,
            }, { headers: authHeaders() });
        } catch {
            // 支付已成功时核销失败不阻断
        }
    }, [orderAmount, campaignId, memberId, storeId, ticketId, totalBenefit]);

    return useMemo(() => ({
        loading,
        orderAmount,
        campaigns,
        tickets,
        campaignId,
        setCampaignId,
        ticketId,
        setTicketId,
        bindMember,
        campaign,
        ticket,
        campaignBenefit,
        couponBenefit,
        totalBenefit,
        payAmount,
        redeem,
        reload,
    }), [
        loading, orderAmount, campaigns, tickets, campaignId, ticketId, bindMember,
        campaign, ticket, campaignBenefit, couponBenefit, totalBenefit, payAmount, redeem, reload,
    ]);
}

export type CheckoutOffers = ReturnType<typeof useCheckoutOffers>;
