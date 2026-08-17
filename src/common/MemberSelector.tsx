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
import {tPos} from '../i18n/t';
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
                remark: offers?.ticketId ? tPos('pay.remark_coupon') : (offers?.campaignId ? tPos('pay.remark_campaign') : tPos('pay.remark_balance')),
            });
            await offers?.redeem?.(orderID);

            toast.success(tPos('pay.success'));
            onSuccess?.();
            handleClose();
        } catch {
            toast.error(tPos('pay.failed'));
        }
    };

    const content = (
        <>
            {/* 查询输入框 */}
            <FormControl fullWidth variant="filled">
                <InputLabel>{tPos('member.suffix')}</InputLabel>
                <FilledInput
                    value={phoneSuffix}
                    onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setPhoneSuffix(v);
                    }}
                />
            </FormControl>

            {/* Loading */}
            {loading && <Typography sx={{ mt: 2 }}>{tPos('member.querying')}</Typography>}

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
                        <Typography>{tPos('member.phone_tail')}：****{m.phone?.slice(-4)}</Typography>
                        <Typography>{tPos('member.name')}：{m.name}</Typography>
                        <Typography>{tPos('member.balance')}：¥{m.balance}</Typography>
                    </Box>
                ))}

                {memberList.length === 0 && phoneSuffix.length === 4 && !loading && (
                    <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                        {tPos('member.not_found')}
                    </Typography>
                )}
            </Box>
        </>
    );

    // ====================== 弹窗模式 (modal=true) ======================
    if (modal) {
        return (
            <Dialog open={!!isOpen} onClose={handleClose} fullWidth>
                <DialogTitle>{tPos('member.query_title')}</DialogTitle>
                <DialogContent>
                    {content}

                    {/* 详情弹窗 - 弹窗模式下显示更详细会员信息，不做余额比较 */}
                    <Dialog
                        open={!!selectedMember}
                        onClose={() => setSelectedMember(null)}
                        fullWidth
                    >
                        <DialogTitle>{tPos('member.detail')}</DialogTitle>
                        <DialogContent>
                            {selectedMember && (
                                <>
                                    <Typography>{tPos('member.name')}：{selectedMember.name}</Typography>
                                    <Typography>{tPos('member.phone')}：{selectedMember.phone}</Typography>
                                    <Typography>{tPos('member.balance')}：¥{selectedMember.balance}</Typography>
                                    {selectedMember.id && <Typography>{tPos('member.card')}：{selectedMember.id}</Typography>}
                                    {selectedMember.level && <Typography>{tPos('member.level')}：{selectedMember.level}</Typography>}
                                    {selectedMember.birthday && <Typography>{tPos('member.birthday')}：{selectedMember.birthday}</Typography>}
                                    {selectedMember.gender && <Typography>{tPos('member.gender')}：{selectedMember.gender}</Typography>}
                                    {selectedMember.registerTime && <Typography>{tPos('member.register')}：{selectedMember.registerTime}</Typography>}
                                </>
                            )}
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => setSelectedMember(null)}>{tPos('member.close')}</Button>
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
                <DialogTitle>{tPos('member.offer_title')}</DialogTitle>
                <DialogContent>
                    {selectedMember && (
                        <>
                            <Typography>{tPos('member.name')}：{selectedMember.name}</Typography>
                            <Typography>{tPos('member.phone')}：{selectedMember.phone}</Typography>
                            <Typography>{tPos('member.balance')}：¥{selectedMember.balance}</Typography>

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
                                        {tPos('member.original_pay', {origin: originalPrice.toFixed(2), pay: price.toFixed(2)})}
                                    </Typography>
                                ) : (
                                    <Typography color={"red"}>
                                        {tPos('member.order_amount')}：¥{price}
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
                                    {selectedMember.balance >= price ? `✔ ${tPos('member.enough')}` : `✖ ${tPos('member.short')}`}
                                </Box>
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setSelectedMember(null)}>{tPos('member.cancel')}</Button>
                    <Button
                        variant="contained"
                        disabled={!selectedMember || selectedMember.balance < price}
                        onClick={handlePay}
                    >
                        {tPos('pay.confirm_balance')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}