// components/MemberSelector.tsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
    InputLabel,
    Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useMemberSearch } from "./useMemberSearch";
import CheckoutOfferBar from "./checkout/CheckoutOfferBar";
import { CheckoutOffers } from "./checkout/useCheckoutOffers";

interface MemberSelectorProps {
    price: number;
    originalPrice?: number;
    orderID: string;
    fetchData: any;
    onSuccess?: () => void;
    onCancel?: () => void;
    offers?: CheckoutOffers;

    // 新增参数
    modal?: boolean;
    open?: boolean;
    onClose?: () => void;
}

export default function MemberSelector({
                                           price,
                                           originalPrice,
                                           orderID,
                                           fetchData,
                                           onSuccess,
                                           onCancel,
                                           offers,
                                           modal = false,
                                           open,
                                           onClose,
                                       }: MemberSelectorProps) {
    const { phoneSuffix, setPhoneSuffix, memberList, loading } = useMemberSearch(fetchData);

    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = modal ? (open ?? internalOpen) : true;

    useEffect(() => {
        if (!offers || !selectedMember || offers.ticketId || !offers.tickets.length) {
            return;
        }
        const origin = originalPrice || price;
        const need = origin - Number(selectedMember.balance || 0);
        const usable = offers.tickets.filter((item) => item.benefit > 0);
        if (!usable.length) {
            return;
        }
        const coverGap = [...usable].sort((a, b) => a.benefit - b.benefit).find((item) => item.benefit >= need);
        const picked = need > 0 ? (coverGap || usable.sort((a, b) => b.benefit - a.benefit)[0]) : usable[0];
        if (picked) {
            offers.setTicketId(picked.id);
        }
    }, [offers?.tickets, selectedMember]);

    const handleClose = () => {
        if (modal) {
            onClose?.();
        } else {
            setInternalOpen(false);
        }
        setSelectedMember(null);
    };

    const handlePay = async () => {
        if (!selectedMember) return;

        try {
            await fetchData('/v1/pay/balance/pay', () => {}, 'POST', {
                order_id: orderID,
                account_id: selectedMember.id,
                amount: price,
                remark: offers?.ticketId ? '余额+优惠券' : (offers?.campaignId ? '余额+活动满减' : '余额支付'),
            });
            await offers?.redeem?.(orderID);

            toast.success('支付成功');
            onSuccess?.();
            handleClose();
        } catch {
            toast.error('支付失败');
        }
    };

    const content = (
        <>
            {/* 查询输入框 */}
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

            {/* Loading */}
            {loading && <Typography sx={{ mt: 2 }}>查询中...</Typography>}

            {/* 会员列表 */}
            <Box sx={{ mt: 1 }}>
                {memberList.map((m) => (
                    <Box
                        key={m.id}
                        onClick={() => {
                            setSelectedMember(m);
                            offers?.bindMember?.({
                                id: m.id,
                                uid: (m as any).uid,
                                account_id: (m as any).account_id || m.id,
                            });
                            if (!modal) setInternalOpen(true);
                        }}
                        sx={{
                            p: 2,
                            mb: 1,
                            border: "0.2px solid #ddd",
                            borderRadius: 0.2,
                            cursor: "pointer",
                            "&:hover": { background: "blue" }
                        }}
                    >
                        <Typography>手机尾号：****{m.phone?.slice(-4)}</Typography>
                        <Typography>姓名：{m.name}</Typography>
                        <Typography>余额：¥{m.balance}</Typography>
                    </Box>
                ))}

                {memberList.length === 0 && phoneSuffix.length === 4 && !loading && (
                    <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                        未找到匹配会员
                    </Typography>
                )}
            </Box>
        </>
    );

    // ====================== 弹窗模式 (modal=true) ======================
    if (modal) {
        return (
            <Dialog open={!!isOpen} onClose={handleClose} fullWidth>
                <DialogTitle>会员余额查询</DialogTitle>
                <DialogContent>
                    {content}

                    {/* 详情弹窗 - 弹窗模式下显示更详细会员信息，不做余额比较 */}
                    <Dialog
                        open={!!selectedMember}
                        onClose={() => setSelectedMember(null)}
                        fullWidth
                    >
                        <DialogTitle>会员详情</DialogTitle>
                        <DialogContent>
                            {selectedMember && (
                                <>
                                    <Typography>姓名：{selectedMember.name}</Typography>
                                    <Typography>手机号：{selectedMember.phone}</Typography>
                                    <Typography>余额：¥{selectedMember.balance}</Typography>
                                    {selectedMember.id && <Typography>会员卡号：{selectedMember.id}</Typography>}
                                    {selectedMember.level && <Typography>会员等级：{selectedMember.level}</Typography>}
                                    {selectedMember.birthday && <Typography>生日：{selectedMember.birthday}</Typography>}
                                    {selectedMember.gender && <Typography>性别：{selectedMember.gender}</Typography>}
                                    {selectedMember.registerTime && <Typography>注册时间：{selectedMember.registerTime}</Typography>}
                                </>
                            )}
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => setSelectedMember(null)}>关闭</Button>
                        </DialogActions>
                    </Dialog>
                </DialogContent>
            </Dialog>
        );
    }

    // ====================== 默认 inline 模式 ======================
    return (
        <>
            {content}

            {/* 详情弹窗 - 保持原有逻辑（有余额比较） */}
            <Dialog open={!!selectedMember} onClose={() => setSelectedMember(null)} fullWidth>
                <DialogTitle>余额支付 · 选择优惠</DialogTitle>
                <DialogContent>
                    {selectedMember && (
                        <>
                            <Typography>姓名：{selectedMember.name}</Typography>
                            <Typography>手机号：{selectedMember.phone}</Typography>
                            <Typography>余额：¥{selectedMember.balance}</Typography>

                            {offers && (
                                <Box sx={{ mt: 2, p: 1.5, border: '1px dashed', borderColor: 'secondary.light', borderRadius: 1 }}>
                                    <CheckoutOfferBar offers={offers} showTickets />
                                </Box>
                            )}

                            <Box sx={{
                                mt: 1,
                                p: 1,
                                borderRadius: 1,
                                bgcolor: selectedMember.balance >= price ? "#e8f5e9" : "#ffebee"
                            }}>
                                {originalPrice && originalPrice > price ? (
                                    <Typography color={"red"}>
                                        原价 ¥{originalPrice.toFixed(2)}，实付 ¥{price.toFixed(2)}
                                    </Typography>
                                ) : (
                                    <Typography color={"red"}>
                                        订单金额：¥{price}
                                    </Typography>
                                )}

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
                                    }}
                                >
                                    {selectedMember.balance >= price ? "✔ 余额充足" : "✖ 余额不足"}
                                </Box>
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setSelectedMember(null)}>取消</Button>
                    <Button
                        variant="contained"
                        disabled={!selectedMember || selectedMember.balance < price}
                        onClick={handlePay}
                    >
                        确认余额支付
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}