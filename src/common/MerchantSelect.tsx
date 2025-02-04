import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useFetchData} from "./FetchData";
import {useCartContext} from "../dataProvider/MyCartProvider";

type SelectStoreProps = {
    refreshAfterSelect?: boolean;
};

// 选择门店并将选择的门店id存储到本地便于后续作为过滤条件
export default function MerchantSelect({ refreshAfterSelect = true }: SelectStoreProps) {
    const { setMerchantId, merchantId } = useCartContext();
    const [storeInfo, setStoreInfo] = React.useState(localStorage.getItem("current_store_id") || '');
    const [stores, setStores] = React.useState<{ id: string; name: string }[]>([]);
    const handleChange = (event: SelectChangeEvent) => {
        const selectedStoreId = event.target.value;
        localStorage.setItem('current_store_id', selectedStoreId);
        setMerchantId(selectedStoreId)
        setStoreInfo(selectedStoreId);
        console.log("merchantId is ==>", merchantId)
        if (refreshAfterSelect) {
            // Replace instead of reloading, which reloads without affecting history stack
            window.location.replace(window.location.href);
        }
    };
    const { fetchData, alertComponent } = useFetchData();

    React.useEffect(() => {
        fetchData('/v1/store/list', (response) => setStores(response));
    }, [fetchData]);

    return (
        <Box sx={{ minWidth: 240 }}>
            {alertComponent}
            <FormControl fullWidth>
                <InputLabel id="store-select-label" sx={{ color: "#ee8" }}>当前门店</InputLabel>
                <Select
                    labelId="store-select-label"
                    id="store_select"
                    value={storeInfo}
                    label="storeInfo"
                    sx={{ color: "#FFF" }}
                    onChange={handleChange}
                >
                    {stores.map((store) => (
                        <MenuItem key={store.id} value={store.id}>
                            {store.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}