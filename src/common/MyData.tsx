import * as React from 'react';
import Badge from '@mui/material/Badge';
import PrintIcon from '@mui/icons-material/Print';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import Paper from '@mui/material/Paper';
import { useFetchData } from './FetchData';
import { useCartContext } from "../dataProvider/MyCartProvider";
import {Chip} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export const PrinterTypes = [
    { id: '0', name: '前台' },
    { id: '1', name: '后厨' },
    { id: '2', name: '前厅' },
    { id: '3', name: '其他' },
];

export default function MyDataAppBar() {
    const { merchantId } = useCartContext();
    const { dataDrawerOpen, setDataDrawerOpen } = useCartContext();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [printers, setPrinters] = React.useState<
        { name: string; status: boolean; online_status: string; type: string }[]
    >([]);
    const { fetchData, alertComponent } = useFetchData();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        // setAnchorEl(event.currentTarget);
        setDataDrawerOpen(!dataDrawerOpen)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'printer-popover' : undefined;

    // React.useEffect(() => {
    //     const localMerchantId = localStorage.getItem('current_store_id');
    //     fetchData('/v1/device/pos/printer', (response) => {
    //         setPrinters(response || []);
    //     }, "POST", { "merchant_id": localMerchantId });
    // }, [fetchData, merchantId]);

    return (
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
                onClick={handleClick}
            >
                {alertComponent}
                <Badge badgeContent={printers.length} color="success" variant="dot">
                    <TrendingUpIcon color="inherit" />
                </Badge>
            </Box>
    );
}