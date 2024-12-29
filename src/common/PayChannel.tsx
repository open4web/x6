import * as React from 'react';
import { useEffect } from 'react';
import {
    Tabs,
    Tab,
    Typography,
    Box,
    FormControl,
    InputLabel,
    FilledInput,
    InputAdornment,
    IconButton,
} from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { toast } from "react-toastify";
import QRScanner from "./ScanCode";
import { useFetchData } from "./FetchData";
import { useCartContext } from "../dataProvider/MyCartProvider";
import { ChannelType, ScanPayRequest } from "./types";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

export default function PayChannel({ setCart, price, setOpen, orderID, at }: any) {
    const [value, setValue] = React.useState(0);
    const [code, setCode] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const { setDrawerOpen, setOrderDrawerOpen } = useCartContext();
    const [isScanning, setIsScanning] = React.useState(true);
    const fetchData = useFetchData();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleResetInput = () => setCode('');

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.slice(-18); // Keep the last 18 characters
        setCode(inputValue);
        setVerified(inputValue.length === 18);
    };

    const submitPay = async (scannedCode: string) => {
        const userData: ScanPayRequest = {
            channel: ChannelType.WeChatPay,
            order_id: orderID,
            desc: '商品支付',
            amount: price,
            at: at,
            code: scannedCode,
        };

        try {
            await fetchData('/v1/pay/scan/pay', () => {}, "POST", userData);
            if (setCart) {
                setCart([]);
            }
            setOpen(false);
            setOrderDrawerOpen(true);
            toast.success("支付成功", { position: "top-center", autoClose: 3000 });
        } catch (error) {
            toast.error("支付失败，请重试", { position: "top-center", autoClose: 3000 });
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (code.length === 18) {
            submitPay(code).then(() => {
                setCode('');
                setVerified(false);
            });
        }

        interval = setInterval(() => {
            setCode('');
            setVerified(false);
        }, 15000);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [code]);

    const PayCodeInput = (
        <FormControl sx={{ m: 2, width: '100%' }} variant="filled">
            <InputLabel htmlFor="filled-adornment-code">支付授权码</InputLabel>
            <FilledInput
                id="filled-adornment-code"
                value={code}
                onChange={handleCodeChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={handleResetInput} edge="end">
                            {verified ? <VerifiedIcon color="success" /> : <RestartAltIcon />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    );

    return (
        <Box sx={{ width: '100%', p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={value} onChange={handleChange} aria-label="支付渠道选择">
                    <Tab label="自动" {...a11yProps(0)} />
                    <Tab label="微信" {...a11yProps(1)} />
                    <Tab label="卡拉卡" {...a11yProps(2)} />
                    <Tab label="支付宝" {...a11yProps(3)} />
                    <Tab label="扫码" {...a11yProps(4)} />
                </Tabs>
            </Box>
            {[0, 1, 2, 3].map(index => (
                <CustomTabPanel key={index} value={value} index={index}>
                    {PayCodeInput}
                </CustomTabPanel>
            ))}
            <CustomTabPanel value={value} index={4}>
                <QRScanner
                    onScanSuccess={(scannedCode: string) => {
                        if (isScanning) {
                            setIsScanning(false);
                            submitPay(scannedCode).finally(() => setIsScanning(true));
                        }
                    }}
                    onScanLimitReached={() => {
                        toast.warning("扫描尝试次数已达到限制，请检查设备或刷新页面。", { position: "top-center", autoClose: 5000 });
                    }}
                />
            </CustomTabPanel>
        </Box>
    );
}