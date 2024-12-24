import * as React from 'react';
import {useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {FilledInput, FormControl, IconButton, InputAdornment, InputLabel} from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {ChannelType, ScanPayRequest} from "./types";
import {toast} from "react-toastify";
import QRScanner from "./ScanCode";
import {useFetchData} from "./FetchData";
import {useCartContext} from "../dataProvider/MyCartProvider";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface PayResp {
    time_end?: string;
    out_trade_no: string;
    transaction_id: string;
    open_id: string;
    total_fee: string;
    result_code: string;
}

function CustomTabPanel({children, value, index, ...other}: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 5, borderRadius: "3px"}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function PayChannel({setCart, price, setOpen, orderID}: any) {
    const [value, setValue] = React.useState(0);
    const [code, setCode] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const {setDrawerOpen, setOrderDrawerOpen} = useCartContext();
    const [isScanning, setIsScanning] = React.useState(true); // 控制是否启用扫描
    const fetchData = useFetchData();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleResetInput = () => setCode('');

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const trimmedValue = inputValue.slice(-18); // 保留最多18位字符
        setCode(trimmedValue);
        setVerified(trimmedValue.length === 18);
    };

    const submitPay = async (scannedCode: string) => {
        const userData: ScanPayRequest = {
            channel: ChannelType.WeChatPay,
            order_id: orderID,
            desc: '一碗粉',
            amount: price,
            at: localStorage.getItem("current_store_id") as string,
            code: scannedCode,
        };

        try {
            await fetchData('/v1/pay/scan/pay', () => {}, "POST", userData);
            setCart([]); // 清空购物车
            setOpen(false); // 关闭支付弹窗
            setOrderDrawerOpen(true); // 打开订单弹窗
            toast.success("支付成功", {position: "top-center", autoClose: 3000});
        } catch (error) {
            toast.error("支付失败，请重试", {position: "top-center", autoClose: 3000});
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

    const payCodeInput = (
        <FormControl sx={{m: 2, width: '45ch'}} variant="filled">
            <InputLabel htmlFor="filled-adornment-code">支付授权码</InputLabel>
            <FilledInput
                id="filled-adornment-code"
                value={code}
                onChange={handleCodeChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={handleResetInput} edge="end">
                            {verified ? <VerifiedIcon color="success"/> : <RestartAltIcon/>}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    );

    return (
        <Box sx={{width: '100%', borderRadius: "6px"}}>
            <Box sx={{borderBottom: 2, borderColor: 'divider'}}>
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
                    {payCodeInput}
                </CustomTabPanel>
            ))}
            <CustomTabPanel value={value} index={4}>
                <QRScanner
                    onScanSuccess={(scannedCode: string) => {
                        if (isScanning) {
                            setIsScanning(false); // 暂时停止扫描，避免重复触发
                            submitPay(scannedCode).finally(() => setIsScanning(true)); // 支付完成后允许再次扫描
                        }
                    }}
                    onScanLimitReached={() => {
                        toast.warning("扫描尝试次数已达到限制，请重新加载页面或检查设备。", {position: "top-center", autoClose: 5000});
                    }}
                />
            </CustomTabPanel>
        </Box>
    );
}