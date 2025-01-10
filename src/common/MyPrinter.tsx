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

export const PrinterTypes = [
    { id: '0', name: '前台' },
    { id: '1', name: '后厨' },
    { id: '2', name: '前厅' },
    { id: '3', name: '其他' },
];

export default function MyPrinter() {
    const { merchantId } = useCartContext();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [printers, setPrinters] = React.useState<
        { name: string; status: boolean; online_status: string; type: string }[]
    >([]);
    const { fetchData, alertComponent } = useFetchData();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'printer-popover' : undefined;

    React.useEffect(() => {
        const localMerchantId = localStorage.getItem('current_store_id');
        fetchData('/v1/device/pos/printer', (response) => {
            setPrinters(response || []);
        }, "POST", { "merchant_id": localMerchantId });
    }, [fetchData, merchantId]);

    return (
        <>
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
                    <PrintIcon color="inherit" />
                </Badge>
            </Box>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Paper sx={{ width: '320px', padding: 2 }}>
                    <List>
                        {printers.map((printer, index) => {
                            // 根据 type 获取类型名称
                            const typeName = PrinterTypes.find(type => type.id === printer.type)?.name || '未知类型';

                            return (
                                <ListItem
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 1, // 增加间距
                                    }}
                                >
                                    {/* 类型使用 Chip 标签显示 */}
                                    <Chip
                                        label={typeName}
                                        sx={{
                                            backgroundColor: '#f0f0f0',
                                            color: '#333',
                                            fontSize: '0.8rem',
                                            height: 24,
                                        }}
                                    />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            flexGrow: 1, // 使名称占据剩余空间
                                        }}
                                    >
                                        {printer.name}
                                    </Typography>
                                    <SignalWifiStatusbar4BarIcon
                                        sx={{
                                            fontSize: 12,
                                            color: printer.online_status === 'Offline'
                                                    ? 'red'
                                                    : 'green',
                                        }}

                                    />
                                    <CircleIcon
                                        sx={{
                                            fontSize: 12,
                                            color: printer.status
                                                ? 'green' : 'orange',
                                        }}

                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            </Popover>
        </>
    );
}