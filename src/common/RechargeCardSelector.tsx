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
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useFetchData } from "./FetchData";
import PaymentDialog from "./PaymentDialog";   // ← 确保已创建这个组件

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
    status?: number;
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

    // 新增：快速添加会员相关状态
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberGender, setNewMemberGender] = useState<'男' | '女' | '其他'>('男');

    // 支付弹窗相关
    const [openPayment, setOpenPayment] = useState(false);
    const [orderPrice, setOrderPrice] = useState(0);
    const [orderID, setOrderID] = useState("");
    const [orderCount, setOrderCount] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [estimatedWait, setEstimatedWait] = useState(0);

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
            setShowCreateForm(false)
            return;
        }

        setLoadingMember(true);
        try {
            await fetchData('/v1/hlj/member/account/search', (res: any) => {
                const m = res?.[0] || null;
                setMember(m);

                if (m) {
                    const isNormal = m.status === 1 || !m.statusText || m.statusText.includes('正常');
                    setMemberValid(!!isNormal);
                    setShowCreateForm(false);
                } else {
                    setMemberValid(false);
                    setShowCreateForm(true);        // ← 查不到时显示创建表单
                    setNewMemberName('');
                }

            }, "GET", { phone_hex: phoneNumber });
        } catch {
            toast.error("会员查询失败");
            setMember(null);
            setMemberValid(false);
            setShowCreateForm(true);
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
        setOpenPayment(false);
    };

    // ==================== 快速创建会员 ====================
    const handleCreateMember = async () => {
        if (!newMemberName.trim()) {
            toast.warning("请输入姓名");
            return;
        }

        try {
            await fetchData('/v1/hlj/member/account', (res: any) => {
                toast.success("会员创建成功！");
                setMember(res);
                setMemberValid(true);
                setShowCreateForm(false);
            }, "POST", {
                phone: phone,
                name: newMemberName.trim(),
                gender: newMemberGender,
                // 可根据后端需求增加更多字段
            });
        } catch {
            toast.error("创建会员失败");
        }
    };

    const handleConfirmOrder = async () => {
        if (!selectedCard || !member || !memberValid) return;

        const orderAmount = parseFloat(selectedCard.sellPrice || selectedCard.value);
        const cardValue = parseFloat(selectedCard.value);   // ← 新增

        // ==================== 新增：构造 buckets ====================
        const rechargeBucket = {
            id: selectedCard.id,
            name: selectedCard.name,
            price: orderAmount,
            number: 1,                    // quantity → number（后端常用字段）
            desc: selectedCard.desc || "充值卡",
            kindName: "虚拟产品",         // 关键标识
            combName: "",
            combID: "",
            combPrice: 0,
            propsOptions: [],
            spiceOptions: [],
            product_type: "topup",        // 可选：标识为充值类型
        };

        const newOrderRequest = {
            order_type: 2,                    // 充值订单
            member_id: member.id,
            store_id: 1,
            total_amount: orderAmount,
            pay_amount: orderAmount,
            value: cardValue,
            // ==================== 重点添加 buckets ====================
            buckets: [rechargeBucket],
            phone: phone,
            remark: `充值卡：${selectedCard.name}`,
            at: localStorage.getItem("current_store_id") as string,
            pick: 4, // 虚拟商品
        };

        try {
            await fetchData('/v1/hlj/order/pos', (response: any) => {
                setOrderPrice(response?.price || orderAmount);
                setOrderID(response?.identity?.order_no || "");
                setOrderCount(response?.orderCount || 0);
                setTotalItems(response?.totalItems || 0);
                setEstimatedWait(response?.estimatedWait || 0);

                toast.success("订单创建成功！");

                // 先关闭充值选择弹窗
                handleClose();
                // 再打开支付弹窗
                setOpenPayment(true);

                onSuccess?.({ order: response, card: selectedCard, member });
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
                    <Typography color={"green"}>姓名：{member.name}</Typography>
                    <Typography color={"green"}>手机号：{member.phone}</Typography>
                    <Typography color={memberValid ? "green" : "red"}>
                        账号状态：{memberValid ? "正常" : "异常"}
                    </Typography>
                </Box>
            )}

            {/* ==================== 快速添加会员表单 ==================== */}
            {showCreateForm && !member && (
                <Box sx={{ mb: 3, p: 3, border: '1px solid #ddd', borderRadius: 2, bgcolor: 'inherit' }}>
                    <Typography variant="h6" gutterBottom>未找到会员，请新建</Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>姓名</InputLabel>
                        <FilledInput
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="请输入会员姓名"
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>性别</Typography>
                        <RadioGroup
                            row
                            value={newMemberGender}
                            onChange={(e) => setNewMemberGender(e.target.value as '男' | '女' | '其他')}
                        >
                            <FormControlLabel value="男" control={<Radio />} label="男" />
                            <FormControlLabel value="女" control={<Radio />} label="女" />
                            <FormControlLabel value="其他" control={<Radio />} label="其他" />
                        </RadioGroup>
                    </FormControl>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleCreateMember}
                        disabled={!newMemberName.trim()}
                    >
                        快速创建会员
                    </Button>
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
            <>
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

                {/* ==================== 支付渠道弹窗 ==================== */}
                <PaymentDialog
                    open={openPayment}
                    onClose={() => setOpenPayment(false)}
                    price={orderPrice}
                    orderID={orderID}
                    orderCount={orderCount}
                    totalItems={totalItems}
                    estimatedWait={estimatedWait}
                    fetchData={fetchData}
                    onSuccess={() => {
                        toast.success("充值支付成功！");
                        handleClose();
                    }}
                />
            </>
        );
    }

    return (
        <>
            {content}

            {/* Inline 模式下的支付弹窗 */}
            <PaymentDialog
                open={openPayment}
                onClose={() => setOpenPayment(false)}
                price={orderPrice}
                orderID={orderID}
                orderCount={orderCount}
                totalItems={totalItems}
                estimatedWait={estimatedWait}
                fetchData={fetchData}
            />
        </>
    );
}