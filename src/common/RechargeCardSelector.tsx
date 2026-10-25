// components/RechargeCardSelector.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    FormControl,
    FilledInput,
    InputLabel,
} from '@mui/material';
import { toast } from 'react-toastify';
import {tPos} from '../i18n/t';
import { useFetchData } from "./FetchData";
import PaymentDialog from "./PaymentDialog";
import {playPosSound} from '../utils/touchSound';

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

const keyButtonSx = {
    minHeight: {xs: 60, sm: 68},
    p: 0,
    fontSize: 28,
    fontWeight: 800,
    borderRadius: 2,
    lineHeight: 1,
    touchAction: 'manipulation',
};

const money = (value?: string | number) => {
    const amount = parseFloat(String(value ?? ''));
    return Number.isFinite(amount) ? amount : 0;
};

const phoneGroups = (digits: string) => [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7, 11)];

const samePrice = (face: string, sell?: string) => Math.abs(money(face) - money(sell || face)) < 0.001;

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
            }, "GET", undefined, true);
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
            }, "GET", { phone_hex: phoneNumber }, true);
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
        setNewMemberGender(0);
        setOpenPayment(false);
    };

    const pushDigit = (digit: string) => {
        playPosSound('key');
        setPhone((prev) => (prev + digit).replace(/\D/g, '').slice(0, 11));
    };

    const popDigit = () => {
        playPosSound('key');
        setPhone((prev) => prev.slice(0, -1));
    };

    const clearPhone = () => {
        playPosSound('tap');
        setPhone('');
    };

    const onPhoneKey = (event: React.KeyboardEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            return;
        }
        if (/^\d$/.test(event.key)) {
            event.preventDefault();
            pushDigit(event.key);
            return;
        }
        if (event.key === 'Backspace') {
            event.preventDefault();
            popDigit();
        }
    };

    // ==================== 快速创建会员 ====================
    const handleCreateMember = async () => {
        if (!newMemberName.trim()) {
            playPosSound('warn');
            toast.warning(tPos('member.create_need_name'));
            return;
        }

        try {
            await fetchData('/v1/hlj/member/account', (res: any) => {
                playPosSound('ok');
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
            }, true);
        } catch {
            toast.error(tPos('member.create_failed'));
        }
    };

    const handleConfirmOrder = async () => {
        if (!selectedCard || !member || !memberValid) {
            playPosSound('warn');
            return;
        }

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

                playPosSound('ok');
                toast.success(tPos('recharge.order_ok'));

                handleClose();
                setOpenPayment(true);

                onSuccess?.({ order: response, card: selectedCard, member });
            }, "POST", newOrderRequest, true);
        } catch {
            toast.error(tPos('recharge.order_failed'));
        }
    };

    const payAmount = selectedCard ? money(selectedCard.sellPrice || selectedCard.value) : 0;
    const creditAmount = selectedCard ? money(selectedCard.value) : 0;
    const balanceAmount = Number(member?.balance);
    const balanceText = Number.isFinite(balanceAmount) ? balanceAmount.toFixed(2) : '0.00';
    const canOrder = Boolean(selectedCard && member && memberValid);
    const genderOptions: {value: UserGender; label: string}[] = [
        {value: 0, label: tPos('recharge.male')},
        {value: 1, label: tPos('recharge.female')},
        {value: 2, label: tPos('recharge.other')},
    ];

    const footer = (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, width: '100%'}}>
            <Box sx={{flex: 1, minWidth: 0}}>
                <Typography variant="caption" color="text.secondary" noWrap>
                    {selectedCard ? selectedCard.name : tPos('recharge.pick_card')}
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap'}}>
                    <Typography sx={{fontSize: {xs: 28, sm: 34}, fontWeight: 800, color: '#d32f2f', lineHeight: 1}}>
                        {tPos('pay.pay_amount')} ¥{payAmount.toFixed(2)}
                    </Typography>
                    {selectedCard && !samePrice(selectedCard.value, selectedCard.sellPrice) && (
                        <Typography color="text.secondary" sx={{fontWeight: 700}}>
                            {tPos('recharge.credit')} ¥{creditAmount.toFixed(2)}
                        </Typography>
                    )}
                </Box>
            </Box>
            <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                    playPosSound('tap');
                    handleClose();
                }}
                sx={{minHeight: 64, minWidth: 96, fontSize: 18, fontWeight: 700}}
            >
                {tPos('recharge.cancel')}
            </Button>
            <Button
                variant="contained"
                color="success"
                disabled={!canOrder}
                onClick={handleConfirmOrder}
                sx={{minHeight: 64, minWidth: {xs: 140, sm: 188}, fontSize: 18, fontWeight: 800}}
            >
                {tPos('recharge.confirm')}
            </Button>
        </Box>
    );

    const content = (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {xs: '1fr', md: 'minmax(300px, 360px) minmax(0, 1fr)'},
                gap: 2,
                alignItems: 'start',
            }}
        >
            <Box>
                <Typography variant="caption" color="text.secondary">
                    {tPos('recharge.phone_label')}
                </Typography>
                <Box
                    sx={{
                        mt: 0.75,
                        mb: 1.5,
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: phone.length === 11 ? 'primary.main' : 'divider',
                        bgcolor: 'action.hover',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1.25,
                    }}
                >
                    {phoneGroups(phone).map((group, index) => (
                        <Typography
                            key={index}
                            sx={{
                                minWidth: index === 0 ? 72 : 96,
                                textAlign: 'center',
                                fontSize: {xs: 28, sm: 34},
                                fontWeight: 800,
                                letterSpacing: 1,
                                lineHeight: 1.1,
                                color: group ? 'text.primary' : 'text.disabled',
                            }}
                        >
                            {group || '·'.repeat(index === 0 ? 3 : 4)}
                        </Typography>
                    ))}
                </Box>
                <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.25}}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => {
                        const muted = key === 'C' || key === '⌫';
                        return (
                            <Button
                                key={key}
                                variant={muted ? 'outlined' : 'contained'}
                                color={muted ? 'inherit' : 'primary'}
                                disableElevation
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                    if (key === '⌫') {
                                        popDigit();
                                        return;
                                    }
                                    if (key === 'C') {
                                        clearPhone();
                                        return;
                                    }
                                    pushDigit(key);
                                }}
                                sx={{...keyButtonSx, fontSize: muted ? 22 : 30}}
                            >
                                {key === 'C' ? tPos('keypad.clear') : key}
                            </Button>
                        );
                    })}
                </Box>

                {loadingMember && (
                    <Box sx={{mt: 2, display: 'flex', alignItems: 'center', gap: 1}}>
                        <CircularProgress size={18} />
                        <Typography>{tPos('recharge.querying')}</Typography>
                    </Box>
                )}

                {member && (
                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: memberValid ? '#a5d6a7' : '#ef9a9a',
                            bgcolor: memberValid ? '#f1f8e9' : '#ffebee',
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1}}>
                            <Typography sx={{fontSize: 22, fontWeight: 800}} noWrap>
                                {member.name || tPos('recharge.empty')}
                            </Typography>
                            <Chip
                                size="small"
                                label={memberValid ? tPos('recharge.ok') : tPos('recharge.bad')}
                                color={memberValid ? 'success' : 'error'}
                            />
                        </Box>
                        <Typography sx={{mt: 0.5, fontSize: 28, fontWeight: 800, color: 'success.main', lineHeight: 1.1}}>
                            {tPos('member.balance')} ¥{balanceText}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                            {member.phone ? member.phone.slice(-4).padStart(11, '*') : tPos('recharge.none')}
                            {' · '}
                            {member.level || tPos('recharge.default_level')}
                            {' · '}
                            {member.gender || tPos('recharge.empty')}
                        </Typography>
                    </Box>
                )}

                {showCreateForm && !member && (
                    <Box sx={{mt: 2, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider'}}>
                        <Typography sx={{fontWeight: 800, mb: 1.5}}>{tPos('recharge.create_title')}</Typography>
                        <FormControl fullWidth variant="filled" sx={{mb: 1.5}}>
                            <InputLabel>{tPos('member.name')}</InputLabel>
                            <FilledInput
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                placeholder={tPos('recharge.name')}
                                inputProps={{style: {fontSize: 20, fontWeight: 700}}}
                            />
                        </FormControl>
                        <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 1.5}}>
                            {genderOptions.map((item) => (
                                <Button
                                    key={item.value}
                                    variant={newMemberGender === item.value ? 'contained' : 'outlined'}
                                    color={newMemberGender === item.value ? 'primary' : 'inherit'}
                                    onClick={() => {
                                        playPosSound('tap');
                                        setNewMemberGender(item.value);
                                    }}
                                    sx={{minHeight: 52, fontSize: 18, fontWeight: 800}}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleCreateMember}
                            disabled={!newMemberName.trim()}
                            sx={{minHeight: 56, fontSize: 18, fontWeight: 800}}
                        >
                            {tPos('recharge.create')}
                        </Button>
                    </Box>
                )}
            </Box>

            <Box>
                {loadingCards ? (
                    <Box sx={{py: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1}}>
                        <CircularProgress size={22} />
                        <Typography>{tPos('recharge.loading_cards')}</Typography>
                    </Box>
                ) : cardList.length === 0 ? (
                    <Typography color="text.secondary" sx={{py: 6, textAlign: 'center'}}>
                        {tPos('recharge.empty_cards')}
                    </Typography>
                ) : (
                    <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'}, gap: 1.25}}>
                        {cardList.map((card) => {
                            const selected = selectedCard?.id === card.id;
                            const discounted = !samePrice(card.value, card.sellPrice);
                            return (
                                <Button
                                    key={card.id}
                                    variant="outlined"
                                    color={selected ? 'primary' : 'inherit'}
                                    onClick={() => {
                                        playPosSound(selected ? 'tap' : 'add');
                                        setSelectedCard(selected ? null : card);
                                    }}
                                    sx={{
                                        minHeight: 148,
                                        p: 1.75,
                                        borderWidth: 2,
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        textAlign: 'left',
                                        textTransform: 'none',
                                        bgcolor: selected ? 'rgba(25,118,210,0.08)' : 'background.paper',
                                    }}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, width: '100%'}}>
                                        {(card.fullImage || card.image) && (
                                            <Box
                                                component="img"
                                                src={card.fullImage || card.image}
                                                alt=""
                                                sx={{width: 44, height: 44, borderRadius: 1, objectFit: 'cover', flex: 'none'}}
                                            />
                                        )}
                                        <Typography noWrap sx={{fontSize: 18, fontWeight: 800, color: 'text.primary'}}>
                                            {card.name}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {tPos('pay.pay_amount')}
                                        </Typography>
                                        <Typography sx={{fontSize: 32, fontWeight: 800, color: '#d32f2f', lineHeight: 1.05}}>
                                            ¥{money(card.sellPrice || card.value).toFixed(2)}
                                        </Typography>
                                    </Box>
                                    {discounted && (
                                        <Typography variant="body2" color="text.secondary">
                                            {tPos('recharge.credit')} ¥{money(card.value).toFixed(2)}
                                        </Typography>
                                    )}
                                    {!!card.gifts?.length && (
                                        <Typography variant="body2" color="text.secondary" noWrap sx={{width: '100%'}}>
                                            {tPos('recharge.gifts')} {card.gifts.join('、')}
                                        </Typography>
                                    )}
                                    {card.desc && (
                                        <Typography variant="body2" color="text.secondary" noWrap sx={{width: '100%'}}>
                                            {card.desc}
                                        </Typography>
                                    )}
                                </Button>
                            );
                        })}
                    </Box>
                )}
            </Box>
        </Box>
    );

    const payment = (
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
    );

    if (modal) {
        return (
            <>
                <Dialog
                    open={!!isOpen}
                    onClose={handleClose}
                    onKeyDown={onPhoneKey}
                    fullWidth
                    maxWidth="lg"
                >
                    <DialogTitle sx={{fontWeight: 800, fontSize: 22}}>{tPos('recharge.title')}</DialogTitle>
                    <DialogContent dividers>{content}</DialogContent>
                    <DialogActions sx={{px: 2.5, py: 1.75}}>{footer}</DialogActions>
                </Dialog>
                {payment}
            </>
        );
    }

    return (
        <Box>
            {content}
            <Box sx={{mt: 2}}>{footer}</Box>
            {payment}
        </Box>
    );
}