import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Box, Tab, Tabs,} from "@mui/material";
import {toast} from "react-toastify";
import QRScanner from "./ScanCode";
import {useFetchData} from "./FetchData";
import {useCartContext} from "../dataProvider/MyCartProvider";
import {ChannelType} from "./types";
import NumericKeyboardDialog from "./NumericKeyboardDialog";
import PayCodeDisplay from "./PayCodeInput";
import {useOrderPolling} from "./OrderPulling";
import MemberBalancePay from './MemberBalancePay';

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
    const [loadingMember, setLoadingMember] = useState(false);

    // ==================== WebSocket 监听支付结果 ====================
    const wsRef = useRef<WebSocket | null>(null);

    const connectPaymentWS = () => {
        if (wsRef.current) return;

        const ws = new WebSocket('/v1/hlj/order/ws');   // 或你的支付专用 ws 地址
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('支付监听 WebSocket 已连接');
            // 可选：订阅当前订单
            ws.send(JSON.stringify({
                type: 'subscribe',
                order_id: orderID
            }));
        };

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                console.log('支付 WS 消息:', msg);
                setOrderDrawerOpen(true);
                // 清空当前已完成的订单的购物车
                setCart([]);
                // 关闭购物车框
                setOpen(false);
                if (msg.order_id === orderID &&
                    (msg.status === 1 || msg.type === 'payment_success' || msg.pay_status === 'success')) {

                    // playSuccess();

                    toast.success("支付成功！", {
                        position: "top-center",
                        autoClose: 2000,
                    });

                    setCart([]);
                    setOpen(false);
                    setOrderDrawerOpen(true);   // 打开订单详情抽屉

                    // 可选：关闭当前支付弹窗
                    // setOpen(false);
                }
            } catch (err) {
                console.error('支付 WS 解析失败', err);
            }
        };

        ws.onclose = () => {
            console.log('支付 WebSocket 断开');
            wsRef.current = null;
            // 可自动重连
            setTimeout(connectPaymentWS, 3000);
        };

        ws.onerror = (err) => console.error('支付 WebSocket 错误', err);
    };

    // 组件加载时连接 WS
    useEffect(() => {
        connectPaymentWS();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [orderID]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        setIsWeChatTab(newValue === 0); // 判断是否是 "微信" Tab
        setIsScanning(newValue === 1);
        setCash(newValue === 2);
    };

    const handleResetInput = () => setCode('');
    const submitPay = async (scannedCode: string) => {

        // if (payingRef.current) return;
        // payingRef.current = true;

        try {
            await fetchData('/v1/pay/scan/pay', () => {
            }, "POST", {
                channel: ChannelType.WeChatPay,
                order_id: orderID,
                desc: '商品支付',
                amount: price,
                at,
                code: scannedCode,
            });

            setCart([]);
            setOpen(false);

            // ✅ 核心：统一调用
            // await pollOrder(orderID);

        } catch {
            toast.error("支付失败");
        } finally {
            // payingRef.current = false;
        }
    };

    useEffect(() => {
        if (isWeChatTab && price > 0) {
            const handleScannerInput = (event: KeyboardEvent) => {
                console.log("event.key ===>", event.key)
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
    }, [isWeChatTab, code, price]);

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

            // ✅ 统一轮询

            // await pollOrder(orderID);

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
        <Box sx={{width: '100%', p: 1, borderRadius: 1, boxShadow: 2}}>
            {alertComponent}
            <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 1}}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="支付渠道选择"
                    variant="fullWidth"
                    sx={{
                        minHeight: 64, // 🔥 增大整体高度（触屏友好）
                        "& .MuiTab-root": {
                            minHeight: 64,
                            fontSize: 20, // 大一号
                            fontWeight: 600,
                            textTransform: "none",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 3,
                            marginTop: "10px",
                            "& .MuiTab-wrapper": {
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1,
                            }
                        }
                    }}
                >
                    <Tab icon="🤖" iconPosition="start" label="自动" {...a11yProps(0)} />
                    <Tab icon="📷" iconPosition="start" label="扫码" {...a11yProps(1)} />
                    <Tab icon="💵" iconPosition="start" label="现金" {...a11yProps(2)} />
                    <Tab icon="💰" iconPosition="start" label="余额" {...a11yProps(3)} />
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
                                       min={1} max={999} defaultValue={price} confirmText={"确认余额支付"}
                                       type="money"
                                       clearText={"免单"}
                                       inline={true}
                />

            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <MemberBalancePay
                    value={value}
                    index={3}
                    price={price}
                    orderID={orderID}
                    fetchData={fetchData}
                    setCart={setCart}
                    setOpen={setOpen}
                    setOrderDrawerOpen={setOrderDrawerOpen}
                />
            </CustomTabPanel>

        </Box>
    );
}