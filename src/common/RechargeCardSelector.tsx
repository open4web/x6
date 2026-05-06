// components/RechargeCardSelector.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    CardMedia,
    FormControl,
    FilledInput,
    InputLabel,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useFetchData } from "./FetchData";
import {convertToOrderRequest} from "../utils/time";

interface RechargeCard {
    id: string;
    name: string;
    value: string;
    sellPrice: string;
    desc?: string;
    image?: string;
    fullImage?: string;
    gifts?: string[];
}

interface Member {
    id: string;
    name: string;
    phone: string;
    balance?: number;
    status?: number; // 假设后端返回状态
    statusText?: string;
}

interface RechargeCardSelectorProps {
    onSuccess?: (data: any) => void;
    onCancel?: () => void;

    modal?: boolean;
    open?: boolean;
    onClose?: () => void;
}

export default function RechargeCardSelector({
                                                 onSuccess,
                                                 onCancel,
                                                 modal = false,
                                                 open,
                                                 onClose,
                                             }: RechargeCardSelectorProps) {
    const { fetchData } = useFetchData();

    // 充值卡
    const [cardList, setCardList] = useState<RechargeCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<RechargeCard | null>(null);
    const [loadingCards, setLoadingCards] = useState(false);

    // 会员查询
    const [phone, setPhone] = useState('');
    const [member, setMember] = useState<Member | null>(null);
    const [loadingMember, setLoadingMember] = useState(false);
    const [memberValid, setMemberValid] = useState(false);

    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = modal ? (open ?? internalOpen) : true;

    // 获取充值卡列表
    const fetchRechargeCards = async () => {
        setLoadingCards(true);
        try {
            await fetchData('/v1/hlj/store/charge', (res: any) => {
                const formatted = (res || []).map((item: any) => ({
                    id: item._id || item.id,
                    name: item.name,
                    value: item.value,
                    sellPrice: item.sell_price,
                    desc: item.desc,
                    image: item.image,
                    fullImage: item.full_image,
                    gifts: item.gifts || [],
                }));
                setCardList(formatted);
            }, "GET");
        } catch {
            toast.error("获取充值卡失败");
        } finally {
            setLoadingCards(false);
        }
    };

    // 查询会员（11位手机号）
    const fetchMember = async (phoneNumber: string) => {
        if (phoneNumber.length !== 11) {
            setMember(null);
            setMemberValid(false);
            return;
        }

        setLoadingMember(true);
        try {
            await fetchData('/v1/hlj/member/account/search', (res: any) => {
                const m = res?.[0] || null; // 取第一个匹配的会员
                setMember(m);

                // 判断账号是否正常（可根据实际字段调整）
                const isNormal = m && (m.status === 1 || !m.statusText || m.statusText.includes('正常'));
                setMemberValid(!!isNormal);

                if (!isNormal) {
                    toast.warning("该账号状态异常，请检查");
                }
            }, "GET", { phone: phoneNumber });
        } catch {
            toast.error("会员查询失败");
            setMember(null);
            setMemberValid(false);
        } finally {
            setLoadingMember(false);
        }
    };

    // 防抖查询会员
    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => fetchMember(phone), 500);
        return () => clearTimeout(timer);
    }, [phone, isOpen]);

    // 加载充值卡
    useEffect(() => {
        if (isOpen) fetchRechargeCards();
    }, [isOpen]);

    const handleClose = () => {
        if (modal) onClose?.();
        else setInternalOpen(false);

        setPhone('');
        setMember(null);
        setSelectedCard(null);
        setMemberValid(false);
    };

    const handleConfirmOrder = async () => {
        if (!selectedCard || !member || !memberValid) return;

        const orderAmount = parseFloat(selectedCard.sellPrice || selectedCard.value);

        const newOrderRequest = {
            order_type: 2,                    // 假设 2 为充值订单，根据实际调整
            member_id: member.id,
            store_id: 1,                      // 根据实际情况传入
            total_amount: orderAmount,
            pay_amount: orderAmount,
            items: [{
                product_type: "topup",
                product_id: selectedCard.id,
                name: selectedCard.name,
                price: orderAmount,
                quantity: 1,
            }],
            phone: phone,
            remark: `充值卡：${selectedCard.name}`,
            at: localStorage.getItem("current_store_id") as string,
            pick: 4, // 虚拟卡
            // 可继续补充其他必要字段
        };

        // 增加 seat 和 phone 等信息
        // const newOrderRequest = {
        //     at: localStorage.getItem("current_store_id") as string,
        //     buckets: convertToOrderRequest(cartItems),
        //     seat: localStorage.getItem('ticketNumber'),
        //     phone: localStorage.getItem('phoneNumber'),
        //     people: localStorage.getItem('peopleNumber'),
        //     pick: pick,
        // };

        try {
            await fetchData('/v1/hlj/order/pos', (response: any) => {
                toast.success("订单创建成功！");
                onSuccess?.({ order: response, card: selectedCard, member });
                handleClose();
            }, "POST", newOrderRequest);
        } catch {
            toast.error("下单失败");
        }
    };

    const content = (
        <Box>
            {/* ==================== 手机号输入 ==================== */}
            <FormControl fullWidth variant="filled" sx={{ mb: 3 }}>
                <InputLabel>手机号（11位）</InputLabel>
                <FilledInput
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="请输入11位手机号"
                />
            </FormControl>

            {/* 会员信息展示 */}
            {loadingMember && <Typography>查询会员中...</Typography>}
            {member && (
                <Box sx={{ mb: 3, p: 2, bgcolor: memberValid ? "#e8f5e9" : "#ffebee", borderRadius: 1 }}>
                    <Typography>姓名：{member.name}</Typography>
                    <Typography>手机号：{member.phone}</Typography>
                    <Typography color={memberValid ? "green" : "red"}>
                        账号状态：{memberValid ? "正常" : "异常"}
                    </Typography>
                </Box>
            )}

            {/* ==================== 充值卡列表 ==================== */}
            {loadingCards ? (
                <Typography>加载充值卡中...</Typography>
            ) : (
                <Grid container spacing={3}>
                    {cardList.map((card) => (
                        <Grid item xs={12} sm={6} md={4} key={card.id}>
                            <Card
                                sx={{
                                    border: selectedCard?.id === card.id ? "2px solid #1976d2" : "1px solid #ddd",
                                }}
                            >
                                <CardActionArea onClick={() => setSelectedCard(card)}>
                                    {card.image && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={card.fullImage || card.image}
                                            alt={card.name}
                                        />
                                    )}
                                    <CardContent>
                                        <Typography variant="h6">{card.name}</Typography>
                                        <Typography variant="h4" color="primary">¥{card.value}</Typography>
                                        {card.sellPrice && card.sellPrice !== card.value && (
                                            <Typography>售价 ¥{card.sellPrice}</Typography>
                                        )}
                                        {card.desc && <Typography variant="body2">{card.desc}</Typography>}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );

    if (modal) {
        return (
            <Dialog open={!!isOpen} onClose={handleClose} fullWidth maxWidth="lg">
                <DialogTitle>充值下单</DialogTitle>
                <DialogContent dividers>
                    {content}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button
                        variant="contained"
                        disabled={!selectedCard || !member || !memberValid}
                        onClick={handleConfirmOrder}
                    >
                        确认下单支付
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <>
            {content}
            {/* Inline 模式下的确认按钮可自行添加 */}
        </>
    );
}