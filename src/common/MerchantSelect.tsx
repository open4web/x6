import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import {useTranslate} from 'react-admin';
import {StoreOption} from './StoreOption';
import {useStoreGate} from './StoreGate';

type SelectStoreProps = {
    refreshAfterSelect?: boolean;
};

// 选择门店并将选择的门店id存储到本地便于后续作为过滤条件
export default function MerchantSelect({refreshAfterSelect = true}: SelectStoreProps) {
    const translate = useTranslate();
    // 门店列表由 StoreGate 统一拉取并校验权限，这里只负责展示和切换。
    const {stores, storeId, chooseStore} = useStoreGate();
    const storeInfo = storeId;
    const handleChange = (event: SelectChangeEvent) => {
        const selectedStoreId = event.target.value;
        if (!selectedStoreId || selectedStoreId === storeId) {
            return;
        }
        chooseStore(selectedStoreId);
        if (refreshAfterSelect) {
            window.location.replace(window.location.href);
        }
    };

    const current = stores.find(store => store.id === storeInfo);

    return (
        <Box sx={{minWidth: 280, maxWidth: 420}}>
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
