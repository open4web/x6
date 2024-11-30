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

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// 定义 TypeScript 接口
interface PayResp {
    time_end?: string; // 注意在 TypeScript 中，可选属性需要添加 "?"
    out_trade_no: string;
    transaction_id: string;
    open_id: string;
    total_fee: string;
    result_code: string;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

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

// @ts-ignore
export default function PayChannel({setCart, price, setOpen, orderID}) {
    const [value, setValue] = React.useState(0);
    const [code, setCode] = React.useState('');
    const [verified, setVerified] = React.useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleResetInput = () => {
        setCode('')
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleCodeChange = (event: { target: { value: string | any[]; }; }) => {
        let inputValue = event.target.value;

        let newValue: string = inputValue as string;
        setCode(newValue);
        if (code.length > 18) {
            // 如果超过18个字符，则只保留后面的部分
            const newCode = code.slice(-18);
            setCode(newCode)
        }

        if (newValue.length === 18) {
            setVerified(true)
        } else {
            setVerified(false)
        }
    };

    const submitPay = async () => {

        console.log("code is from scan=>", code)
        // 定义一个 UserData 对象
        const userData: ScanPayRequest = {
            channel: ChannelType.WeChatPay,
            order_id: orderID,
            desc: '一碗粉',
            amount: price,
            at: localStorage.getItem("current_store_id") as string,
            code: code,
        };

        const fetchData = useFetchData()
        fetchData('/v1/pay/scan/pay', (response) => {
            // 访问返回的数据
            const responseData: PayResp = response.data;
            console.log("Out Trade No:", responseData.out_trade_no);
            console.log("Transaction ID:", responseData.transaction_id);
            // 清空购物车
            // @ts-ignore
            setCart([]);

            // 当支付完成后就退出支付渠道选择弹窗
            setOpen(false)

            // 更新订单小票
            // 做一个动画专场
            // 将已经支付的订单收集到一个位置，方便后续查看
        }, "POST", userData);
    }

    useEffect(() => {
        // code 是异步更新的，因此在这里检测其真实的值
        if (code.length === 18) {
            // 在组件挂载后将焦点定位到输入框
            setValue(0);
            // setVerified(true)
            submitPay().then(r => {
                console.log("pay success")
                setCode('')
                setVerified(false)
            });
        }

        const interval = setInterval(() => {
            // 刷新页面
            // setValue()
            setCode('')
            setVerified(false)
        }, 15000); // 刷新间隔，这里设置为每60秒刷新一次

        return () => clearInterval(interval); // 组件销毁时清除定时器
    }, [code, verified]);


    function payCodeInput() {
        return <FormControl sx={{m: 2, width: '45ch', alignContent: "center"}} variant="filled">
            <InputLabel htmlFor="filled-adornment-password">支付授权码</InputLabel>
            <FilledInput
                id="code"
                name={"code"}
                type={'text'}
                onChange={handleCodeChange}
                value={code}
                autoComplete={"false"}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleResetInput}
                            onMouseDown={handleMouseDown}
                            edge="end"
                        >
                            {verified ? <VerifiedIcon color={"success"}/> : <RestartAltIcon/>}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>;
    }

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
            <CustomTabPanel value={value} index={0}>
                {payCodeInput()}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                {payCodeInput()}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                {payCodeInput()}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                {payCodeInput()}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
                {
                    <QRScanner
                        onScanSuccess={(scannedCode: string) => {
                            console.log("Scanned QR Code:", scannedCode);
                            setCode(scannedCode); // 更新 code 状态
                            submitPay();          // 调用支付逻辑
                        }}
                        onScanLimitReached={() => {
                            // 提示用户并处理限制达到的情况
                            toast.warning("扫描尝试次数已达到限制，请重新加载页面或检查设备。", {
                                position: "top-center",
                                autoClose: 5000,
                            });
                        }}
                    />
                }
            </CustomTabPanel>
        </Box>
    );
}