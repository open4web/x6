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
} from '@mui/material';
import { toast } from 'react-toastify';
import {useFetchData} from "./FetchData";

interface RechargeCard {
    id: string;
    name: string;
    value: string;           // 面额（如 "100"）
    sellPrice: string;       // 实际售价
    desc?: string;
    image?: string;
    fullImage?: string;
    gifts?: string[];
    sales?: number;
    type?: number;
    status?: number;
    // ... 其他字段可继续扩展
}

interface RechargeCardSelectorProps {
    // fetchData: any;
    onSuccess?: (selectedCard: RechargeCard) => void;
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
    const [cardList, setCardList] = useState<RechargeCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState<RechargeCard | null>(null);
    const [internalOpen, setInternalOpen] = useState(false);
    const {fetchData, alertComponent} = useFetchData();
    const isOpen = modal ? (open ?? internalOpen) : true;

    // 获取充值卡列表
    const fetchRechargeCards = async () => {
        setLoading(true);
        try {
            await fetchData('/v1/hlj/store/charge', (res: any) => {
                // 适配后端字段
                const formatted = (res || []).map((item: any) => ({
                    id: item._id || item.id,
                    name: item.name,
                    value: item.value,
                    sellPrice: item.sell_price,
                    desc: item.desc,
                    image: item.image,
                    fullImage: item.full_image,
                    gifts: item.gifts || [],
                    sales: item.sales,
                    type: item.type,
                    status: item.status,
                }));
                setCardList(formatted);
            }, "GET");
        } catch (err) {
            toast.error("获取充值卡列表失败");
            setCardList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchRechargeCards();
        }
    }, [isOpen]);

    const handleClose = () => {
        if (modal) onClose?.();
        else setInternalOpen(false);
        setSelectedCard(null);
    };

    const handleConfirmRecharge = async () => {
        if (!selectedCard) return;

        try {
            await fetchData('/v1/hlj/store/charge/pay', () => {}, "POST", {
                card_id: selectedCard.id,
                // 可根据需要增加其他参数
            });

            toast.success(`已成功购买 ${selectedCard.name} ¥${selectedCard.value}`);
            onSuccess?.(selectedCard);
            handleClose();
        } catch {
            toast.error("充值失败");
        }
    };

    const content = (
        <Box>
            {loading ? (
                <Typography sx={{ mt: 4, textAlign: 'center' }}>加载充值卡中...</Typography>
            ) : (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {cardList.map((card) => (
                        <Grid item xs={12} sm={6} md={4} key={card.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    border: selectedCard?.id === card.id ? "2px solid #1976d2" : "1px solid #e0e0e0",
                                    transition: "all 0.2s",
                                }}
                            >
                                <CardActionArea onClick={() => setSelectedCard(card)}>
                                    {/* 图片展示 */}
                                    {card.image && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={card.fullImage || card.image}
                                            alt={card.name}
                                            sx={{ objectFit: 'contain', p: 1, bgcolor: '#f8f8f8' }}
                                        />
                                    )}

                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            {card.name}
                                        </Typography>

                                        <Typography variant="h4" color="primary" sx={{ my: 1 }}>
                                            ¥{card.value}
                                        </Typography>

                                        {card.sellPrice && card.sellPrice !== card.value && (
                                            <Typography variant="body2" color="text.secondary">
                                                售价 ¥{card.sellPrice}
                                            </Typography>
                                        )}

                                        {card.desc && (
                                            <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                                                {card.desc}
                                            </Typography>
                                        )}

                                        {card.gifts && card.gifts.length > 0 && (
                                            <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                                                赠品：{card.gifts.join("、")}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {!loading && cardList.length === 0 && (
                <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                    暂无可用充值卡
                </Typography>
            )}
        </Box>
    );

    // ====================== 弹窗模式 ======================
    if (modal) {
        return (
            <Dialog open={!!isOpen} onClose={handleClose} fullWidth maxWidth="lg">
                <DialogTitle>选择充值卡</DialogTitle>
                <DialogContent dividers>
                    {content}
                </DialogContent>

                {/* 确认充值弹窗 */}
                <Dialog open={!!selectedCard} onClose={() => setSelectedCard(null)} fullWidth maxWidth="sm">
                    <DialogTitle>确认充值信息</DialogTitle>
                    <DialogContent>
                        {selectedCard && (
                            <Box sx={{ mt: 2 }}>
                                <Typography><strong>充值卡名称：</strong>{selectedCard.name}</Typography>
                                <Typography><strong>面额：</strong>¥{selectedCard.value}</Typography>
                                {selectedCard.sellPrice && selectedCard.sellPrice !== selectedCard.value && (
                                    <Typography><strong>实际支付：</strong>¥{selectedCard.sellPrice}</Typography>
                                )}
                                {selectedCard.desc && <Typography><strong>描述：</strong>{selectedCard.desc}</Typography>}
                                {selectedCard.gifts && selectedCard.gifts.length > 0 && (
                                    <Typography><strong>赠送：</strong>{selectedCard.gifts.join("、")}</Typography>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedCard(null)}>取消</Button>
                        <Button variant="contained" onClick={handleConfirmRecharge}>
                            确认充值
                        </Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
        );
    }

    // ====================== Inline 模式 ======================
    return (
        <>
            {content}

            <Dialog open={!!selectedCard} onClose={() => setSelectedCard(null)} fullWidth>
                <DialogTitle>确认充值</DialogTitle>
                <DialogContent>
                    {selectedCard && (
                        <Box sx={{ mt: 2 }}>
                            <Typography><strong>名称：</strong>{selectedCard.name}</Typography>
                            <Typography><strong>面额：</strong>¥{selectedCard.value}</Typography>
                            {selectedCard.sellPrice !== selectedCard.value && (
                                <Typography><strong>支付金额：</strong>¥{selectedCard.sellPrice}</Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedCard(null)}>取消</Button>
                    <Button variant="contained" onClick={handleConfirmRecharge}>
                        确认充值
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}