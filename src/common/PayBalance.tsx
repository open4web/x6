import React, {useEffect, useState} from "react";
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
} from "@mui/material";
import {toast} from "react-toastify";

interface Props {
    value: number;
    index: number;
    price: number;
    orderID: string;
    fetchData: any;
    setCart: any;
    setOpen: any;
    setOrderDrawerOpen: any;
}

function CustomTabPanel({children, value, index}: any) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{p: 3}}>{children}</Box>}
        </div>
    );
}

export default function MemberBalancePay({
                                             value,
                                             index,
                                             price,
                                             orderID,
                                             fetchData,
                                             setCart,
                                             setOpen,
                                             setOrderDrawerOpen
                                         }: Props) {

    const [phoneSuffix, setPhoneSuffix] = useState('');
    const [memberList, setMemberList] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [memberOpen, setMemberOpen] = useState(false);
    const [loadingMember, setLoadingMember] = useState(false);

    // 查询会员
    const fetchMemberList = async (suffix: string) => {
        setLoadingMember(true);
        try {
            await fetchData('/v1/hlj/member/account/search', (res: any) => {
                setMemberList(res || []);
            }, "GET", {suffix});
        } catch {
            toast.error("会员查询失败");
        } finally {
            setLoadingMember(false);
        }
    };

    // 防抖查询
    useEffect(() => {
        if (value !== index) return;

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
        <CustomTabPanel value={value} index={index}>

            {/* 输入框 */}
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

            {/* loading */}
            {loadingMember && (
                <Typography sx={{mt: 2}}>查询中...</Typography>
            )}

            {/* 列表 */}
            <Box sx={{mt: 1}}>
                {memberList.map((m) => (
                    <Box
                        key={m.id}
                        onClick={() => {
                            setSelectedMember(m);
                            setMemberOpen(true);
                        }}
                        sx={{
                            p: 2,
                            mb: 1,
                            border: "0.2px solid #ddd",
                            borderRadius: 0.2,
                            cursor: "pointer",
                            "&:hover": {background: "blue"}
                        }}
                    >
                        <Typography>
                            手机尾号：****{m.phone.slice(-4)}
                        </Typography>
                        <Typography>姓名：{m.name}</Typography>
                        <Typography>余额：¥{m.balance}</Typography>
                    </Box>
                ))}
            </Box>

            {/* 详情弹窗 */}
            <Dialog open={memberOpen} onClose={() => setMemberOpen(false)} fullWidth>
                <DialogTitle>会员详情</DialogTitle>

                <DialogContent>
                    {selectedMember && (
                        <>
                            <Typography>姓名：{selectedMember.name}</Typography>
                            <Typography>手机号：{selectedMember.phone}</Typography>
                            <Typography>余额：¥{selectedMember.balance}</Typography>

                            <Box sx={{
                                mt: 1,
                                p: 1,
                                borderRadius: 1,
                                bgcolor: selectedMember.balance >= price ? "#e8f5e9" : "#ffebee"
                            }}>
                                <Typography color={"red"}>
                                    订单金额：¥{price}
                                </Typography>

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
                    <Button onClick={() => setMemberOpen(false)}>取消</Button>

                    <Button
                        variant="contained"
                        disabled={!selectedMember || selectedMember.balance < price}
                        onClick={async () => {
                            try {
                                await fetchData('/v1/pay/balance/pay', () => {
                                }, "POST", {
                                    order_id: orderID,
                                    account_id: selectedMember.id,
                                    amount: price,
                                    remark: "余额支付"
                                });

                                setCart([]);
                                setOpen(false);
                                setMemberOpen(false);

                                toast.success("支付成功");
                                setOrderDrawerOpen(true);

                            } catch {
                                toast.error("支付失败");
                            }
                        }}
                    >
                        余额支付
                    </Button>

                </DialogActions>
            </Dialog>

        </CustomTabPanel>
    );
}