import * as React from 'react';
import axios from 'axios';
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
import {tPos} from '../i18n/t';
import {isAbsentPrinterError} from '../utils/requestError';

const PRINTER_LIST_PATH = '/v1/hlj/device/pos/printer';

export const PrinterTypes = [
    { id: '0', name: '前台' },
    { id: '1', name: '后厨' },
    { id: '2', name: '前厅' },
    { id: '3', name: '其他' },
];

type PrinterPhase = 'loading' | 'ready' | 'absent';

export default function MyPrinter() {
    const { merchantId } = useCartContext();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [printers, setPrinters] = React.useState<
        { name: string; status: boolean; online_status: string; type: string }[]
    >([]);
    const [phase, setPhase] = React.useState<PrinterPhase>('loading');
    const [hintOpen, setHintOpen] = React.useState(false);
    const { fetchData, alertComponent } = useFetchData();
    const noneLabel = tPos('printer.none');
    const unavailable = phase === 'absent';

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (phase !== 'ready') {
            return;
        }
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl) && phase === 'ready';
    const id = open ? 'printer-popover' : undefined;

    React.useEffect(() => {
        let alive = true;
        setAnchorEl(null);
        setPhase('loading');
        setHintOpen(false);
        // 门店未选定前不查打印机：之前会带 merchant_id: null 去请求，得到误导性的“暂无打印机”。
        if (!merchantId) {
            setPrinters([]);
            return () => {
                alive = false;
            };
        }
        fetchData(PRINTER_LIST_PATH, (response) => {
            if (!alive) {
                return;
            }
            const list = Array.isArray(response) ? response : [];
            setPrinters(list);
            setPhase(list.length === 0 ? 'absent' : 'ready');
            setHintOpen(false);
            if (list.length === 0) {
                setAnchorEl(null);
            }
        }, "POST", { "merchant_id": merchantId }, true).catch((error) => {
            if (!alive) {
                return;
            }
            const absent = isAbsentPrinterError({
                status: axios.isAxiosError(error) ? error.response?.status : 0,
                url: PRINTER_LIST_PATH,
                body: axios.isAxiosError(error) ? error.response?.data : undefined,
                message: error instanceof Error ? error.message : '',
            });
            if (!absent) {
                return;
            }
            setPrinters([]);
            setPhase('absent');
            setAnchorEl(null);
            setHintOpen(true);
        });
        return () => {
            alive = false;
        };
    }, [fetchData, merchantId]);

    React.useEffect(() => {
        if (!hintOpen) {
            return undefined;
        }
        const timer = window.setTimeout(() => setHintOpen(false), 2200);
        return () => window.clearTimeout(timer);
    }, [hintOpen]);

    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: unavailable ? 'not-allowed' : phase === 'ready' ? 'pointer' : 'default',
                    opacity: unavailable ? 0.38 : 1,
                    '&:hover > .printer-missing-tip, &:focus-within > .printer-missing-tip': {
                        opacity: 1,
                        visibility: 'visible',
                    },
                }}
                onClick={handleClick}
                aria-disabled={unavailable || undefined}
                aria-label={unavailable ? noneLabel : undefined}
            >
                {alertComponent}
                <Badge
                    badgeContent={printers.length}
                    color="success"
                    variant="dot"
                    invisible={printers.length === 0}
                >
                    <PrintIcon color="inherit" />
                </Badge>
                {unavailable ? (
                    <Box
                        className="printer-missing-tip"
                        role="tooltip"
                        sx={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: 'rgba(33,33,33,0.92)',
                            color: '#fff',
                            fontSize: 12,
                            lineHeight: 1.4,
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            opacity: 0,
                            visibility: 'hidden',
                            zIndex: 2,
                        }}
                    >
                        {noneLabel}
                    </Box>
                ) : null}
            </Box>
            {hintOpen ? (
                <Box
                    role="status"
                    sx={{
                        position: 'fixed',
                        left: '50%',
                        bottom: 24,
                        transform: 'translateX(-50%)',
                        zIndex: 1500,
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        bgcolor: 'rgba(33,33,33,0.92)',
                        color: '#fff',
                        fontSize: 14,
                        lineHeight: 1.4,
                        pointerEvents: 'none',
                    }}
                >
                    {noneLabel}
                </Box>
            ) : null}
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