import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import {useTranslate} from 'react-admin';
import {CachedStore, resolvePayChannels, storePlace, storeSeatCounts} from '../utils/storeCache';

const statusColor: Record<number, 'default' | 'success' | 'info'> = {
    0: 'default',
    1: 'success',
    2: 'info',
};

function statusKey(status?: number) {
    if (status === 0 || status === 1 || status === 2) {
        return `pos.store.status_${status}`;
    }
    return 'pos.store.status_unknown';
}

export function StoreOption({store, selected}: {store: CachedStore; selected?: boolean}) {
    const translate = useTranslate();
    const place = storePlace(store);
    const seats = storeSeatCounts(store.seats);
    const pays = resolvePayChannels(store);
    const meta = [
        store.hours,
        store.phone,
        seats.total > 0 ? translate('pos.store.seats', {count: seats.total, _: '%{count} tables'}) : '',
        seats.busy > 0 ? translate('pos.store.busy', {count: seats.busy, _: '%{count} busy'}) : '',
        seats.reserved > 0 ? translate('pos.store.reserved', {count: seats.reserved, _: '%{count} held'}) : '',
        seats.total > 0 && seats.busy === 0 && seats.reserved === 0
            ? translate('pos.store.free', {_: 'Free'})
            : '',
    ].filter(Boolean);

    const payLabels = [
        pays.cash ? translate('pos.store.pay_cash', {_: 'Cash'}) : '',
        pays.wechat ? translate('pos.store.pay_wechat', {_: 'WeChat'}) : '',
        pays.lakala ? translate('pos.store.pay_lakala', {_: 'Lakala'}) : '',
        pays.balance ? translate('pos.store.pay_balance', {_: 'Balance'}) : '',
    ].filter(Boolean);

    return (
        <Box sx={{py: 0.25, minWidth: 0, width: '100%'}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0}}>
                <Typography
                    component="span"
                    sx={{
                        fontWeight: 700,
                        color: selected ? 'inherit' : '#0f172a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {store.name}
                </Typography>
                <Chip
                    size="small"
                    label={translate(statusKey(store.status), {_: 'Unknown'})}
                    color={selected ? 'default' : (statusColor[store.status ?? -1] || 'default')}
                    sx={selected ? {height: 20, color: '#fff', bgcolor: 'rgba(255,255,255,0.18)', '& .MuiChip-label': {px: 0.75}} : {height: 20}}
                />
                {store.category && (
                    <Typography component="span" variant="caption" sx={{color: selected ? 'rgba(255,255,255,0.75)' : '#64748b', flexShrink: 0}}>
                        {store.category}
                    </Typography>
                )}
            </Box>
            {!selected && place && (
                <Typography variant="body2" sx={{color: '#334155', mt: 0.25}}>
                    {place}
                </Typography>
            )}
            {!selected && meta.length > 0 && (
                <Typography variant="caption" sx={{display: 'block', color: '#64748b', mt: 0.25}}>
                    {meta.join(' · ')}
                </Typography>
            )}
            {!selected && payLabels.length > 0 && (
                <Box sx={{display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap'}}>
                    {payLabels.map(label => (
                        <Chip key={label} size="small" variant="outlined" label={label} sx={{height: 20}} />
                    ))}
                </Box>
            )}
        </Box>
    );
}
