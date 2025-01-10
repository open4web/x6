import * as React from 'react';
import Badge from '@mui/material/Badge';
import PrintIcon from '@mui/icons-material/Print';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle';
import { useFetchData } from './FetchData';
import {useCartContext} from "../dataProvider/MyCartProvider";

export default function MyPrinter() {
    const {  merchantId } = useCartContext();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [printers, setPrinters] = React.useState<
        { name: string; status: boolean; online_status: string, type: string }[]
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
        fetchData('/v1/device/pos/printer', (response) => {
            setPrinters(response || []);
        }, "POST", {"merchant_id": merchantId});
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
                    <PrintIcon color="action" />
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
                <List>
                    {printers.map((printer, index) => {
                        // 根据 type 获取类型名称
                        const typeName = PrinterTypes.find(type => type.id === printer.type)?.name || '未知类型';

                        return (
                            <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                    {typeName} {printer.name} {/* 类型名称与打印机名称之间有空格 */}
                                </Typography>
                                <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                                    <CircleIcon
                                        sx={{
                                            fontSize: 12,
                                            color: printer.status
                                                ? 'green' // 在线为绿色
                                                : printer.online_status === 'Offline'
                                                    ? 'red' // 离线为红色
                                                    : 'orange', // 其他状态为橙色
                                        }}
                                    />
                                </Box>
                            </ListItem>
                        );
                    })}
                </List>
            </Popover>
        </>
    );
}

export const PrinterTypes = [
    { id: '0', name: '前台' },
    { id: '1', name: '后厨' },
    { id: '2', name: '前厅' },
    { id: '3', name: '其他' },
]