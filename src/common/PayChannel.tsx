import * as React from 'react';
import {useEffect, useState} from 'react';
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
    Dialog,
    DialogActions,
    Button,
    DialogContent, DialogTitle,
} from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {toast} from "react-toastify";
import QRScanner from "./ScanCode";
import {useFetchData} from "./FetchData";
import {useCartContext} from "../dataProvider/MyCartProvider";
import {ChannelType, ScanPayRequest} from "./types";
import NumericKeyboardDialog from "./NumericKeyboardDialog";
import PayCodeDisplay from "./PayCodeInput";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel({children, value, index}: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box sx={{p: 3}}>
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

export default function PayChannel({setCart, price, setOpen, orderID, at}: any) {
    const [value, setValue] = React.useState(0);
    const [code, setCode] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const [cash, setCash] = React.useState(false);
    const {setDrawerOpen, setOrderDrawerOpen} = useCartContext();
    const [isScanning, setIsScanning] = React.useState(true);
    const [isWeChatTab, setIsWeChatTab] = useState(true); // 是否启用扫码枪逻辑
    const {fetchData, alertComponent} = useFetchData();
    // ================= 余额模块 =================
    const [phoneSuffix, setPhoneSuffix] = useState('');
    const [memberList, setMemberList] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [memberOpen, setMemberOpen] = useState(false);
    const [loadingMember, setLoadingMember] = useState(false);


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        setIsWeChatTab(newValue === 0); // 判断是否是 "微信" Tab
        setIsScanning(newValue === 1);
        setCash(newValue === 2);
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
            await fetchData('/v1/pay/scan/pay', () => {
            }, "POST", userData);
            if (setCart) {
                setCart([]);
            }
            setOpen(false);

            // 轮询查询支付状态
            const maxRetries = 2; // 最大查询次数
            const intervalTime = 2000; // 轮询间隔（3秒）
            let attempts = 0;

            const checkOrderStatus = async () => {
                return new Promise<void>((resolve) => { // 确保 resolve 在 Promise 内部
                    const poll = async () => {
                        try {
                            await fetchData('/v1/hlj/order/pos/' + userData.order_id, (response) => {
                                if (response.status === 1) {
                                    toast.success("支付成功", {position: "top-center", autoClose: 3000});
                                    setOrderDrawerOpen(true);
                                    return resolve(); // 成功后终止轮询
                                }
                            }, "GET", {});
                        } catch (error) {
                            console.error("查询订单支付结果失败", error);
                        }

                        attempts++;
                        if (attempts < maxRetries) {
                            setTimeout(poll, intervalTime); // 继续轮询
                        } else {
                            toast.error("支付状态未确认，请稍后在订单记录中查看", {
                                position: "top-center",
                                autoClose: 3000
                            });
                            resolve(); // 结束轮询
                        }
                    };

                    poll(); // 启动轮询
                });
            };

            await checkOrderStatus(); // 启动轮询
        } catch (error) {
            toast.error("支付失败，请重试", {position: "top-center", autoClose: 3000});
        }
    };

    useEffect(() => {
        if (isWeChatTab) {
            const handleScannerInput = (event: KeyboardEvent) => {
                console.log("code ===>", code)
                // 不同的支付渠道支付码长度不一样
                if (code.length === 18) {
                    submitPay(code);
                    setCode(''); // 清空扫码结果
                } else {
                    setCode((prev) => prev + event.key); // 累计扫码输入
                }
            };

            window.addEventListener("keydown", handleScannerInput);
            return () => {
                window.removeEventListener("keydown", handleScannerInput);
            };
        } else {
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
        }
    }, [isWeChatTab, code]);

    const handlePayByCash = async (value: string) => {
        const amount = parseFloat(value);

        if (!amount || amount <= 0) {
            toast.error("请输入正确金额", {position: "top-center"});
            return;
        }

        try {
            await fetchData('/v1/pay/cash/pay', () => {
            }, "POST", {
                order_id: orderID,
                amount: amount, // 👉 元（后端会转分）
                remark: "现金支付",
            });

            // 清空购物车
            if (setCart) {
                setCart([]);
            }

            // 关闭支付弹窗
            setOpen(false);

            toast.success("支付成功", {position: "top-center", autoClose: 2000});

            // 👉 和扫码支付保持一致：轮询订单状态
            const maxRetries = 2;
            const intervalTime = 2000;
            let attempts = 0;

            const checkOrderStatus = async () => {
                return new Promise<void>((resolve) => {
                    const poll = async () => {
                        try {
                            await fetchData('/v1/hlj/order/pos/' + orderID, (response) => {
                                if (response.status === 1) {
                                    setOrderDrawerOpen(true);
                                    return resolve();
                                }
                            }, "GET", {});
                        } catch (error) {
                            console.error("查询订单失败", error);
                        }

                        attempts++;
                        if (attempts < maxRetries) {
                            setTimeout(poll, intervalTime);
                        } else {
                            toast.warning("支付已完成，请在订单中查看", {position: "top-center"});
                            resolve();
                        }
                    };

                    poll();
                });
            };

            await checkOrderStatus();

        } catch (error) {
            toast.error("现金支付失败", {position: "top-center"});
        }
    };

    // ================= 会员查询（新增） =================
    const fetchMemberList = async (suffix: string) => {
        setLoadingMember(true);

        try {
            await fetchData('/v1/hlj/member/search', (res) => {
                setMemberList(res || []);
            }, "GET", {suffix});
        } catch {
            toast.error("会员查询失败");
        } finally {
            setLoadingMember(false);
        }
    };

    useEffect(() => {
        if (value !== 3) return;

        if (phoneSuffix.length !== 4) {
            setMemberList([]);
            return;
        }

        const timer = setTimeout(() => {
            fetchMemberList(phoneSuffix);
        }, 300);

        return () => clearTimeout(timer);
    }, [phoneSuffix, value]);


    return (
        <Box sx={{width: '100%', p: 2, borderRadius: 2, boxShadow: 3}}>
            {alertComponent}
            <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
                <Tabs value={value} onChange={handleChange} aria-label="支付渠道选择">
                    <Tab label="自动" {...a11yProps(0)} />
                    <Tab label="扫码" {...a11yProps(1)} />
                    <Tab label="现金" {...a11yProps(2)} />
                    <Tab label="余额" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel key={0} value={value} index={0}>
                {<PayCodeDisplay
                    value={code}
                    verified={verified}
                    onReset={handleResetInput}
                />}
            </CustomTabPanel>
            <CustomTabPanel key={1} value={value} index={1}>
                <QRScanner
                    onScanSuccess={(scannedCode: string) => {
                        if (isScanning) {
                            setIsScanning(false);
                            submitPay(scannedCode).finally(() => setIsScanning(true));
                        }
                    }}
                    onScanLimitReached={() => {
                        toast.warning("扫描尝试次数已达到限制，请检查设备或刷新页面。", {
                            position: "top-center",
                            autoClose: 5000
                        });
                    }}
                />
            </CustomTabPanel>
            <CustomTabPanel key={2} value={value} index={2}>
                <NumericKeyboardDialog open={cash} setOpen={setCash} onSave={handlePayByCash} title={"请输入现金数额"}
                                       min={1} max={9999} defaultValue={price} confirmText={"确认余额支付"}
                                       clearText={"免单"}/>

            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>

                {/* 输入框 */}
                <FormControl fullWidth variant="filled">
                    <InputLabel>手机号后4位</InputLabel>

                    <FilledInput
                        value={phoneSuffix}
                        onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setPhoneSuffix(v);
                        }}
                    />
                </FormControl>

                {/* loading */}
                {loadingMember && (
                    <Typography sx={{mt: 2}}>查询中...</Typography>
                )}

                {/* list */}
                <Box sx={{mt: 1}}>
                    {memberList.map((m) => (
                        <Box
                            key={m.id}
                            onClick={() => {
                                setSelectedMember(m);
                                setMemberOpen(true);
                            }}
                            sx={{
                                p: 2,
                                mb: 1,
                                border: "0.2px solid #ddd",
                                borderRadius: 0.2,
                                cursor: "pointer",
                                "&:hover": {background: "blue"}
                            }}
                        >
                            <Typography>
                                手机尾号：****{m.phone.slice(-4)}
                            </Typography>
                            <Typography>姓名：{m.name}</Typography>
                            <Typography>余额：¥{m.balance}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* 详情 */}
                <Dialog open={memberOpen} onClose={() => setMemberOpen(false)} fullWidth>
                    <DialogTitle>会员详情</DialogTitle>

                    <DialogContent>
                        {selectedMember && (
                            <>
                                <Typography>姓名：{selectedMember.name}</Typography>
                                <Typography>手机号：{selectedMember.phone}</Typography>
                                <Typography>余额：¥{selectedMember.balance}</Typography>

                                <Box sx={{
                                    mt: 1,
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: selectedMember.balance >= price ? "#e8f5e9" : "#ffebee"
                                }}>
                                    <Typography color={"red"}>订单金额：¥{price}</Typography>
                                    <Box
                                        sx={{
                                            mt: 1,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 2,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            backgroundColor:
                                                selectedMember.balance >= price
                                                    ? "rgba(46, 125, 50, 0.12)"
                                                    : "rgba(211, 47, 47, 0.12)",
                                            color:
                                                selectedMember.balance >= price
                                                    ? "#2e7d32"
                                                    : "#d32f2f",
                                            border:
                                                selectedMember.balance >= price
                                                    ? "1px solid rgba(46, 125, 50, 0.3)"
                                                    : "1px solid rgba(211, 47, 47, 0.3)",
                                        }}
                                    >
                                        {selectedMember.balance >= price ? "✔ 余额充足" : "✖ 余额不足"}
                                    </Box>
                                </Box>
                            </>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setMemberOpen(false)}>取消</Button>

                        <Button
                            variant="contained"
                            disabled={!selectedMember || selectedMember.balance < price}
                            onClick={async () => {
                                try {
                                    await fetchData('/v1/pay/balance/pay', () => {
                                    }, "POST", {
                                        order_id: orderID,
                                        member_id: selectedMember.id,
                                        amount: price,
                                        remark: "余额支付"
                                    });

                                    setCart([]);
                                    setOpen(false);
                                    setMemberOpen(false);

                                    toast.success("支付成功");
                                    setOrderDrawerOpen(true);

                                } catch {
                                    toast.error("支付失败");
                                }
                            }}
                        >
                            余额支付
                        </Button>

                    </DialogActions>
                </Dialog>

            </CustomTabPanel>

        </Box>
    );
}