import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import {useTranslate} from 'react-admin';
import {useFetchData} from './FetchData';
import {useCartContext} from '../dataProvider/MyCartProvider';
import {CachedStore, resolvePayChannels, storePlace, storeSeatCounts, unwrapStoreList, writeStores} from '../utils/storeCache';

type SelectStoreProps = {
    refreshAfterSelect?: boolean;
};

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

function StoreOption({store, selected}: {store: CachedStore; selected?: boolean}) {
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

// 选择门店并将选择的门店id存储到本地便于后续作为过滤条件
export default function MerchantSelect({refreshAfterSelect = true}: SelectStoreProps) {
    const translate = useTranslate();
    const {setMerchantId, merchantId} = useCartContext();
    const [storeInfo, setStoreInfo] = React.useState(localStorage.getItem('current_store_id') || '');
    const [stores, setStores] = React.useState<CachedStore[]>([]);
    const handleChange = (event: SelectChangeEvent) => {
        const selectedStoreId = event.target.value;
        localStorage.setItem('current_store_id', selectedStoreId);
        setMerchantId(selectedStoreId);
        setStoreInfo(selectedStoreId);
        console.log('merchantId is ==>', merchantId);
        if (refreshAfterSelect) {
            window.location.replace(window.location.href);
        }
    };
    const {fetchData, alertComponent} = useFetchData();

    React.useEffect(() => {
        fetchData('/v1/hlj/store/list', (response) => {
            const list = unwrapStoreList(response);
            setStores(list);
            writeStores(list);
        });
    }, [fetchData]);

    const current = stores.find(store => store.id === storeInfo);

    return (
        <Box sx={{minWidth: 280, maxWidth: 420}}>
            {alertComponent}
            <FormControl fullWidth>
                <InputLabel id="store-select-label" sx={{color: '#ee8', whiteSpace: 'nowrap'}}>
                    {translate('pos.store.current')}
                </InputLabel>
                <Select
                    labelId="store-select-label"
                    id="store_select"
                    value={storeInfo}
                    label={translate('pos.store.current')}
                    sx={{color: '#FFF'}}
                    onChange={handleChange}
                    renderValue={() => current
                        ? <StoreOption store={current} selected />
                        : storeInfo}
                    MenuProps={{
                        PaperProps: {sx: {minWidth: 340, maxWidth: 460}},
                    }}
                >
                    {stores.map((store) => (
                        <MenuItem
                            key={store.id}
                            value={store.id}
                            sx={{alignItems: 'flex-start', whiteSpace: 'normal', py: 1}}
                        >
                            <StoreOption store={store} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
