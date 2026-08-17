import React from 'react';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { CheckoutOffers } from './useCheckoutOffers';

export default function CheckoutOfferBar({
    offers,
    showTickets = false,
}: {
    offers: CheckoutOffers;
    showTickets?: boolean;
}) {
    const {
        campaigns, tickets, campaignId, setCampaignId, ticketId, setTicketId,
        campaignBenefit, couponBenefit, loading, orderAmount,
    } = offers;

    if (!campaigns.length && !showTickets && !tickets.length) {
        return null;
    }

    return (
        <Box sx={{ mb: 1.5 }}>
            {campaigns.length > 0 && (
                <>
                    <Typography variant="caption" color="text.secondary">门店活动</Typography>
                    <Box display="flex" gap={0.75} flexWrap="wrap" mt={0.5} mb={1}>
                        <Chip
                            size="small"
                            label="不使用"
                            variant={campaignId ? 'outlined' : 'filled'}
                            onClick={() => setCampaignId('')}
                        />
                        {campaigns.map((item) => (
                            <Chip
                                key={item.id}
                                size="small"
                                color={campaignId === item.id ? 'primary' : 'default'}
                                label={`${item.label} · ${item.name} -¥${item.benefit.toFixed(2)}`}
                                onClick={() => setCampaignId(item.id)}
                            />
                        ))}
                    </Box>
                </>
            )}
            {showTickets && (
                <>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>使用优惠券</Typography>
                    {loading && <Typography variant="caption" color="text.secondary">正在查询会员券…</Typography>}
                    {!loading && tickets.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            没有查到该会员名下的未使用券。请到后台「用户券」核对：已发给这个会员、状态是未使用、还没过期。
                        </Typography>
                    )}
                    {tickets.map((item) => {
                        const selected = ticketId === item.id;
                        const disabled = item.usable === false || item.benefit <= 0;
                        const thresholdText = item.threshold > 0 ? `满${item.threshold}元可用` : '无门槛';
                        const reasonText = item.reason === '未满门槛'
                            ? `当前订单¥${(orderAmount || 0).toFixed(2)}，还差¥${(item.gap || Math.max(0, item.threshold - (orderAmount || 0))).toFixed(2)}`
                            : (item.reason || '');
                        return (
                            <Paper
                                key={item.id}
                                onClick={() => !disabled && setTicketId(selected ? '' : item.id)}
                                elevation={0}
                                sx={{
                                    mt: 1,
                                    p: 1.25,
                                    border: '1px solid',
                                    borderColor: selected ? 'secondary.main' : 'divider',
                                    bgcolor: selected ? 'rgba(156, 39, 176, 0.06)' : 'background.paper',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                    opacity: disabled ? 0.5 : 1,
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography fontWeight={600}>{item.name || `券 ${item.code}`}</Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {thresholdText} · {item.code}
                                        </Typography>
                                        {reasonText && (
                                            <Typography variant="caption" color="error">
                                                {reasonText}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Typography color={disabled ? 'text.secondary' : 'secondary'} fontWeight={700}>
                                        {item.benefit > 0 ? `-¥${item.benefit.toFixed(2)}` : (item.reason || '不可用')}
                                    </Typography>
                                </Box>
                            </Paper>
                        );
                    })}
                </>
            )}
            {(campaignBenefit > 0 || couponBenefit > 0) && (
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    已优惠 ¥{(campaignBenefit + couponBenefit).toFixed(2)}
                    {campaignBenefit > 0 ? `（活动 ¥${campaignBenefit.toFixed(2)}）` : ''}
                    {couponBenefit > 0 ? `（券 ¥${couponBenefit.toFixed(2)}）` : ''}
                </Typography>
            )}
        </Box>
    );
}
