import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useEffect} from "react";
import axios from "axios";

export default function SelectStore() {
    const [storeInfo, setStoreInfo] = React.useState(localStorage.getItem("current_store_id") || '');
    const [stores, setStores] = React.useState();


    const handleChange = (event: SelectChangeEvent) => {
        console.log("change as ==>", event.target.value)
        localStorage.setItem('current_store_id', event.target.value);
        // 刷新页面
        setStoreInfo(event.target.value as string);
        // 刷新当前页面
        window.location.reload();
    };


    const fetchStoreList = async () => {
        try {
            const response = await axios.post('/v1/hlj/store/pos/list', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // 检查状态码
            if (response.status === 200) {
                console.log("Request was successful. Response data:", response.data);
                setStores(response.data)
            } else {
                console.error('Request failed with status code:', response.status);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    useEffect(() => {
        // const val = localStorage.getItem("current_store_id")
        fetchStoreList().then(r => {
            console.log("load done");
        })
    }, []);

    // @ts-ignore
    return (
        <Box sx={{ minWidth: 240 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" sx={{color: "#ee8"}}>当前门店</InputLabel>
                <Select
                    labelId="store_select"
                    id="store_select"
                    value={storeInfo}
                    label="storeInfo"
                    sx={{color: "#FFF"}}
                    onChange={handleChange}
                >
                    {
                        // @ts-ignore
                        stores?.map((option) => (
                        // 使用 map 方法遍历选项数组，渲染 MenuItem 元素
                        <MenuItem key={option?.id} value={option?.id}>
                            {option.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}