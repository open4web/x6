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
import {tPos} from '../i18n/t';
import { useFetchData } from "./FetchData";
import PaymentDialog from "./PaymentDialog";

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
    gender?: string;
    level?: string;
    registerTime?: string;
    status?: number;
    statusText?: string;
    [key: string]: any;
}

interface RechargeCardSelectorProps {
    onSuccess?: (data: any) => void;
    onCancel?: () => void;

    modal?: boolean;
    open?: boolean;
    onClose?: () => void;
}

type UserGender = 0 | 1 | 2;

export default function RechargeCardSelector({
                                                 onSuccess,
                                                 onCancel,
                                                 modal = false,
                                                 open,
                                                 onClose,
                                             }: RechargeCardSelectorProps) {
    const { fetchData } = useFetchData();

    const [cardList, setCardList] = useState<RechargeCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<RechargeCard | null>(null);
    const [loadingCards, setLoadingCards] = useState(false);

    const [phone, setPhone] = useState('');
    const [member, setMember] = useState<Member | null>(null);
    const [loadingMember, setLoadingMember] = useState(false);
    const [memberValid, setMemberValid] = useState(false);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberGender, setNewMemberGender] = useState<UserGender>(0);

    const [openPayment, setOpenPayment] = useState(false);
    const [orderPrice, setOrderPrice] = useState(0);
    const [orderID, setOrderID] = useState("");
    const [orderCount, setOrderCount] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [estimatedWait, setEstimatedWait] = useState(0);

    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = modal ? (open ?? internalOpen) : true;

    // 获取充值卡
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
            toast.error(tPos('recharge.cards_failed'));
        } finally {
            setLoadingCards(false);
        }
    };

    // 查询会员
    const fetchMember = async (phoneNumber: string) => {
        if (phoneNumber.length !== 11) {
            setMember(null);
            setMemberValid(false);
            setShowCreateForm(false);
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
                    setShowCreateForm(false);   // 强制隐藏
                } else {
                    setMemberValid(false);
                    setShowCreateForm(true);
                    setNewMemberName('');
                }
            }, "GET", { phone_hex: phoneNumber });
        } catch {
            toast.error(tPos('member.query_failed'));
            setShowCreateForm(true);
        } finally {
            setLoadingMember(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => fetchMember(phone), 500);
        return () => clearTimeout(timer);
    }, [phone, isOpen]);

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
        setShowCreateForm(false);
        setNewMemberName('');
        setOpenPayment(false);
    };

    // ==================== 快速创建会员 ====================
    const handleCreateMember = async () => {
        if (!newMemberName.trim()) {
            toast.warning(tPos('member.create_need_name'));
            return;
        }

        try {
            await fetchData('/v1/hlj/member/account', (res: any) => {
                toast.success(tPos('member.created'));

                // 关键修复：强制隐藏表单
                setShowCreateForm(false);
                setNewMemberName('');

                // 重新查询最新会员信息
                setTimeout(() => {
                    if (phone && phone.length === 11) {
                        fetchMember(phone);
                    }
                }, 600);

            }, "POST", {
                phone: phone,
                name: newMemberName.trim(),
                gender: newMemberGender,
            });
        } catch {
            toast.error(tPos('member.create_failed'));
        }
    };

    const handleConfirmOrder = async () => {
        if (!selectedCard || !member || !memberValid) return;

        const orderAmount = parseFloat(selectedCard.sellPrice || selectedCard.value);
        const cardValue = parseFloat(selectedCard.value);

        const rechargeBucket = {
            id: selectedCard.id,
            name: selectedCard.name,
            price: orderAmount,
            number: 1,
            desc: selectedCard.desc || tPos('recharge.card'),
            kindName: tPos('recharge.virtual'),
            combName: "",
            combID: "",
            combPrice: 0,
            propsOptions: [],
            spiceOptions: [],
            product_type: "topup",
        };

        const newOrderRequest = {
            order_type: 2,
            member_id: member.id,
            store_id: 1,
            total_amount: orderAmount,
            pay_amount: orderAmount,
            value: cardValue,
            buckets: [rechargeBucket],
            phone: phone,
            remark: tPos('recharge.remark', {name: selectedCard.name}),
            at: localStorage.getItem("current_store_id") as string,
            pick: 4,
        };

        try {
            await fetchData('/v1/hlj/order/pos', (response: any) => {
                setOrderPrice(response?.price || orderAmount);
                setOrderID(response?.identity?.order_no || "");
                setOrderCount(response?.orderCount || 0);
                setTotalItems(response?.totalItems || 0);
                setEstimatedWait(response?.estimatedWait || 0);

                toast.success(tPos('recharge.order_ok'));

                handleClose();
                setOpenPayment(true);

                onSuccess?.({ order: response, card: selectedCard, member });
            }, "POST", newOrderRequest);
        } catch {
            toast.error(tPos('recharge.order_failed'));
        }
    };

    const content = (
        <Box>
            <FormControl fullWidth variant="filled" sx={{ mb: 3 }}>
                <InputLabel>{tPos('recharge.phone_label')}</InputLabel>
                <FilledInput
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder={tPos('recharge.phone')}
                />
            </FormControl>

            {loadingMember && <Typography>{tPos('recharge.querying')}</Typography>}

            {member && (
                <Box sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: 2,
                    border: memberValid ? "1px solid #81c784" : "1px solid #e57373"
                }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {tPos('recharge.info')}
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">{tPos('member.name')}</Typography>
                            <Typography variant="body1" fontWeight={600}>{member.name || tPos('recharge.empty')}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">{tPos('member.phone')}</Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {member.phone ? member.phone.slice(-4).padStart(11, '*') : tPos('recharge.none')}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">{tPos('member.balance')}</Typography>
                            <Typography variant="body1" fontWeight={600} color="success.main">
                                ¥{member.balance?.toFixed(2) || '0.00'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">{tPos('member.gender')}</Typography>
                            <Typography variant="body1">{member.gender || tPos('recharge.empty')}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">{tPos('member.level')}</Typography>
                            <Typography variant="body1">{member.level || tPos('recharge.default_level')}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">{tPos('member.register')}</Typography>
                            <Typography variant="body1">
                                {member.registerTime ? new Date(member.registerTime).toLocaleDateString() : tPos('common.unknown')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #ddd' }}>
                        <Typography color={memberValid ? "success.main" : "error.main"} fontWeight={600}>
                            {tPos('recharge.status')}：{memberValid ? `✅ ${tPos('recharge.ok')}` : `❌ ${tPos('recharge.bad')}`}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* 快速添加会员表单 */}
            {showCreateForm && !member && (
                <Box sx={{ mb: 3, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>{tPos('recharge.create_title')}</Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>{tPos('member.name')}</InputLabel>
                        <FilledInput
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder={tPos('recharge.name')}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>{tPos('member.gender')}</Typography>
                        <RadioGroup
                            row
                            value={newMemberGender}
                            onChange={(e) => setNewMemberGender(Number(e.target.value) as UserGender)}
                        >
                            <FormControlLabel value={0} control={<Radio />} label={tPos('recharge.male')} />
                            <FormControlLabel value={1} control={<Radio />} label={tPos('recharge.female')} />
                            <FormControlLabel value={2} control={<Radio />} label={tPos('recharge.other')} />
                        </RadioGroup>
                    </FormControl>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleCreateMember}
                        disabled={!newMemberName.trim()}
                    >
                        {tPos('recharge.create')}
                    </Button>
                </Box>
            )}

            {/* 充值卡列表 */}
            {loadingCards ? (
                <Typography>{tPos('recharge.loading_cards')}</Typography>
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
                                            <Typography>{tPos('recharge.sell')} ¥{card.sellPrice}</Typography>
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
                    <DialogTitle>{tPos('recharge.title')}</DialogTitle>
                    <DialogContent dividers>
                        {content}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>{tPos('recharge.cancel')}</Button>
                        <Button
                            variant="contained"
                            disabled={!selectedCard || !member || !memberValid}
                            onClick={handleConfirmOrder}
                        >
                            {tPos('recharge.confirm')}
                        </Button>
                    </DialogActions>
                </Dialog>

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
                        toast.success(tPos('recharge.pay_ok'));
                        handleClose();
                    }}
                />
            </>
        );
    }

    return (
        <>
            {content}
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