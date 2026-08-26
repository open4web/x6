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
import {orderWsUrl, readAuthToken} from '../utils/authToken';
import {readStoreTables, resolvePayChannels} from '../utils/storeCache';

type PayTabKey = 'auto' | 'scan' | 'cash' | 'balance';

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
    const {merchantId, setOrderDrawerOpen, startPaymentWatch, notifyOrderPaid} = useCartContext();
    const storeId = merchantId || localStorage.getItem('current_store_id') || '';
    const channels = resolvePayChannels(readStoreTables(storeId));
    const tabs = React.useMemo(() => {
        const list: {key: PayTabKey; icon: string; labelKey: string}[] = [];
        if (channels.wechat) {
            list.push({key: 'auto', icon: '🤖', labelKey: 'pos.pay.auto'});
            list.push({key: 'scan', icon: '📷', labelKey: 'pos.pay.scan'});
        }
        if (channels.cash) {
            list.push({key: 'cash', icon: '💵', labelKey: 'pos.pay.cash'});
        }
        if (channels.balance) {
            list.push({key: 'balance', icon: '💰', labelKey: 'pos.pay.balance'});
        }
        if (!list.length) {
            list.push({key: 'cash', icon: '💵', labelKey: 'pos.pay.cash'});
        }
        return list;
    }, [channels]);
    const cashIndex = Math.max(0, tabs.findIndex(tab => tab.key === 'cash'));
    const [value, setValue] = React.useState(cashIndex);
    const currentKey = tabs[value]?.key || 'cash';
    const [code, setCode] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const [cash, setCash] = React.useState(currentKey === 'cash');
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

        const token = readAuthToken();
        const ws = new WebSocket(orderWsUrl('/v1/hlj/order/ws'));
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('支付监听 WebSocket 已连接');
            if (token) {
                ws.send(JSON.stringify({
                    type: 'auth',
                    token,
                    authorization: `Bearer ${token}`,
                }));
            }
            ws.send(JSON.stringify({
                type: 'subscribe',
                order_id: orderID,
                token,
                authorization: token ? `Bearer ${token}` : '',
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
            // setTimeout(connectPaymentWS, 3000);
        };

        ws.onerror = (err) => console.error('支付 WebSocket 错误', err);
    };

    // useEffect(() => {
    //     connectPaymentWS();
    //
    //     return () => {
    //         if (wsRef.current) {
    //             wsRef.current.close();
    //         }
    //     };
    // }, [orderID]);

    React.useEffect(() => {
        if (value >= tabs.length) {
            setValue(0);
        }
    }, [tabs.length, value]);

    React.useEffect(() => {
        setIsWeChatTab(currentKey === 'auto');
        setIsScanning(currentKey === 'scan');
        setCash(currentKey === 'cash');
    }, [currentKey]);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
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
        if (currentKey !== 'balance') return;

        if (phoneSuffix.length !== 4) {
            setMemberList([]);
            return;
        }

        const timer = setTimeout(() => {
            fetchMemberList(phoneSuffix);
        }, 300);

        return () => clearTimeout(timer);
    }, [phoneSuffix, currentKey]);


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
                    {tabs.map((tab, index) => (
                        <Tab
                            key={tab.key}
                            icon={tab.icon}
                            iconPosition="start"
                            label={translate(tab.labelKey)}
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
            </Box>
            {tabs.map((tab, index) => (
                <CustomTabPanel key={tab.key} value={value} index={index}>
                    {tab.key === 'auto' && (
                        <PayCodeDisplay value={code} verified={verified} onReset={handleResetInput} />
                    )}
                    {tab.key === 'scan' && (
                        <QRScanner
                            onScanSuccess={(scannedCode: string) => {
                                if (isScanning) {
                                    setIsScanning(false);
                                    submitPay(scannedCode).finally(() => setIsScanning(true));
                                }
                            }}
                            onScanLimitReached={() => {
                                toast.warning(translate('pos.pay.scan_limit'), {
                                    position: 'top-center',
                                    autoClose: 5000,
                                });
                            }}
                        />
                    )}
                    {tab.key === 'cash' && (
                        <NumericKeyboardDialog
                            open={cash}
                            setOpen={setCash}
                            onSave={handlePayByCash}
                            title={translate('pos.pay.enter_cash')}
                            min={1}
                            max={999}
                            defaultValue={price}
                            confirmText={translate('pos.pay.confirm_cash')}
                            type="money"
                            clearText={translate('pos.pay.free')}
                            inline
                        />
                    )}
                    {tab.key === 'balance' && (
                        <MemberBalancePay
                            value={value}
                            index={index}
                            price={price}
                            originalPrice={originalPrice || price}
                            orderID={orderID}
                            fetchData={fetchData}
                            setCart={setCart}
                            setOpen={setOpen}
                            setOrderDrawerOpen={setOrderDrawerOpen}
                            offers={offers}
                        />
                    )}
                </CustomTabPanel>
            ))}

        </Box>
    );
}