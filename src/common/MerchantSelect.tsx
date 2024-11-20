import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
import { redirect } from "react-router";

type SelectStoreProps = {
    refreshAfterSelect?: boolean;
};

const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('login_id');
    localStorage.removeItem('Cookie');
};


// 选择门店并将选择的门店id存储到本地便于后续作为过滤条件
export default function MerchantSelect({ refreshAfterSelect = true }: SelectStoreProps) {
    const [storeInfo, setStoreInfo] = React.useState(localStorage.getItem("current_store_id") || '');
    const [stores, setStores] = React.useState<{ id: string; name: string }[]>([]);
    const cookie = localStorage.getItem("cookie") || "";

    const handleChange = (event: SelectChangeEvent) => {
        const selectedStoreId = event.target.value;
        localStorage.setItem('current_store_id', selectedStoreId);
        setStoreInfo(selectedStoreId);
        if (refreshAfterSelect) {
            // Replace instead of reloading, which reloads without affecting history stack
            window.location.replace(window.location.href);
        }
    };

    const fetchStoreList = React.useCallback(async () => {
        try {
            const response = await axios.get('/v1/store/list', {
                headers: {
                    'Content-Type': 'application/json',
                    Cookies: cookie,
                }
            });

            if (response.status === 200) {
                console.log("Stores fetched:", response.data);
                setStores(response.data);
            } else if (response.status === 401) {
                logout()
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    }, [cookie]);

    React.useEffect(() => {
        fetchStoreList();
    }, [fetchStoreList]);

    return (
        <Box sx={{ minWidth: 240 }}>
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