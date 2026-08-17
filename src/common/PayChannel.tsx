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
import MemberBalancePay from './MemberBalancePay';
import {useTranslate} from 'react-admin';

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

export default function PayChannel({setCart, price, setOpen, orderID, at, offers, onSuccess, originalPrice}: any) {
    const translate = useTranslate();
    const [value, setValue] = React.useState(0);
    const [code, setCode] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const [cash, setCash] = React.useState(false);
    const {setDrawerOpen, setOrderDrawerOpen, startPaymentWatch, notifyOrderPaid} = useCartContext();
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
                const paid = msg.order_id === orderID &&
                    (msg.status === 1 || msg.type === 'payment_success' || msg.pay_status === 'success');
                if (!paid) {
                    return;
                }
                if (setCart) {
                    setCart([]);
                }
                setOpen(false);
                notifyOrderPaid(orderID);
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
                desc: translate('pos.pay.desc'),
                amount: price,
                at,
                code: scannedCode,
            });
            await offers?.redeem?.(orderID);
            onSuccess?.();

            if (setCart) {
                setCart([]);
            }
            setOpen(false);
            startPaymentWatch(orderID);

        } catch {
            toast.error(translate('pos.pay.failed'));
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
            toast.error(translate('pos.pay.invalid_amount'), {position: "top-center"});
            return;
        }

        try {
            await fetchData('/v1/pay/cash/pay', () => {
            }, "POST", {
                order_id: orderID,
                amount: amount,
                remark: translate('pos.pay.cash_remark'),
            });
            await offers?.redeem?.(orderID);
            onSuccess?.();

            // 清空购物车
            if (setCart) {
                setCart([]);
            }

            // 关闭支付弹窗
            setOpen(false);

            startPaymentWatch(orderID);

        } catch (error) {
            toast.error(translate('pos.pay.cash_failed'), {position: "top-center"});
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
            toast.error(translate('pos.pay.member_query_failed'));
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
                    aria-label={translate('pos.pay.channel')}
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
                    <Tab icon="🤖" iconPosition="start" label={translate('pos.pay.auto')} {...a11yProps(0)} />
                    <Tab icon="📷" iconPosition="start" label={translate('pos.pay.scan')} {...a11yProps(1)} />
                    <Tab icon="💵" iconPosition="start" label={translate('pos.pay.cash')} {...a11yProps(2)} />
                    <Tab icon="💰" iconPosition="start" label={translate('pos.pay.balance')} {...a11yProps(3)} />
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
                        toast.warning(translate('pos.pay.scan_limit'), {
                            position: "top-center",
                            autoClose: 5000
                        });
                    }}
                />
            </CustomTabPanel>
            <CustomTabPanel key={2} value={value} index={2}>
                <NumericKeyboardDialog open={cash} setOpen={setCash} onSave={handlePayByCash} title={translate('pos.pay.enter_cash')}
                                       min={1} max={999} defaultValue={price} confirmText={translate('pos.pay.confirm_cash')}
                                       type="money"
                                       clearText={translate('pos.pay.free')}
                                       inline={true}
                />

            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <MemberBalancePay
                    value={value}
                    index={3}
                    price={price}
                    originalPrice={originalPrice || price}
                    orderID={orderID}
                    fetchData={fetchData}
                    setCart={setCart}
                    setOpen={setOpen}
                    setOrderDrawerOpen={setOrderDrawerOpen}
                    offers={offers}
                />
            </CustomTabPanel>

        </Box>
    );
}