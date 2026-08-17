import * as React from 'react';
import {
    Avatar,
    Card,
    CardActionArea,
    Grid,
    Stack,
    Typography,
    Box
} from '@mui/material';
import { useNotify, useTranslate } from "react-admin";
import {tPos} from '../../i18n/t';

interface Merchant {
    merchant_id: string;
    name: string;
    logo: string;
    status: string;

    is_admin?: boolean;
    is_owner?: boolean;
    enabled?: boolean;
    verified?: boolean;
}

interface Props {
    merchants: Merchant[];
    onSelect: (m: Merchant) => void;
}

const MerchantSelector: React.FC<Props> = ({ merchants, onSelect }) => {
    const notify = useNotify();
    const translate = useTranslate();

    // 🔥 清缓存 + 重试
    const handleRetry = () => {
        const itemsToRemove = [
            'token',
            'permissions',
            'toolbar',
            'otp_verified',
            'user_id',
            'code',
            'otp_url',
            'step',
            'username',
            'merchants',
            'mchStatus',
            'avatar',
        ];

        itemsToRemove.forEach(item => localStorage.removeItem(item));
        window.location.reload();
    };

    // 🔥 角色映射
    const getRole = (m: Merchant) => {
        if (m.is_owner) {
            return { label: `👑 ${translate('pos.login.role_owner')}`, color: "#a855f7" };
        }
        if (m.is_admin) {
            return { label: `🛠 ${translate('pos.login.role_admin')}`, color: "#38bdf8" };
        }
        return { label: `😐 ${translate('pos.login.role_user')}`, color: "#94a3b8" };
    };

    // 🔥 排序（Owner > Admin > 普通）
    const sortedMerchants = [...(merchants || [])].sort((a, b) => {
        if (a.is_owner) return -1;
        if (b.is_owner) return 1;
        if (a.is_admin) return -1;
        if (b.is_admin) return 1;
        return 0;
    });

    // ❌ 无商户
    if (!sortedMerchants || sortedMerchants.length === 0) {
        return (
            <Box
                sx={{
                    background: "#0f172a",
                    borderRadius: 3,
                    padding: 3,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: "#f87171",
                        fontWeight: 600,
                        mb: 2,
                    }}
                >
                    {translate('pos.login.no_merchant')}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: "#94a3b8",
                        mb: 3,
                    }}
                >
                    {translate('pos.login.no_merchant_hint')}
                </Typography>

                <CardActionArea onClick={handleRetry}>
                    <Card
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background: "#1e293b",
                            color: "#e2e8f0",
                            border: "1px solid #ef4444",
                            transition: "0.2s",

                            "&:hover": {
                                boxShadow: "0 0 12px rgba(239,68,68,0.6)",
                                transform: "translateY(-2px)",
                            }
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: "#ef4444",
                                fontWeight: 600,
                            }}
                        >
                            🔄 {translate('pos.login.retry')}
                        </Typography>
                    </Card>
                </CardActionArea>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                background: "#0f172a",
                borderRadius: 3,
                padding: 2,
            }}
        >
            {/* 标题 */}
            <Typography
                variant="h6"
                sx={{
                    color: "#38bdf8",
                    fontWeight: 600,
                    mb: 2,
                    textAlign: "center",
                    letterSpacing: 1
                }}
            >
                {translate('pos.login.pick_merchant')}
            </Typography>

            <Grid container spacing={2}>
                {sortedMerchants.map((m) => {
                    const role = getRole(m);

                    return (
                        <Grid item xs={12} key={m.merchant_id}>
                            <CardActionArea
                                onClick={() => {
                                    if (m.enabled === false) {
                                        notify(tPos('common.server'), { type: "warning" });
                                        return;
                                    }
                                    onSelect(m);
                                }}
                            >
                                <Card
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        p: 2,
                                        borderRadius: 2,

                                        background: m.enabled === false ? "#111827" : "#1e293b",
                                        color: m.enabled === false ? "#6b7280" : "#e2e8f0",

                                        transition: "0.2s",
                                        border: m.is_owner
                                            ? "1px solid #a855f7"
                                            : "1px solid transparent",

                                        opacity: m.enabled === false ? 0.5 : 1,
                                        cursor: m.enabled === false ? "not-allowed" : "pointer",

                                        "&:hover": m.enabled !== false
                                            ? {
                                                boxShadow: m.is_owner
                                                    ? "0 0 16px rgba(168,85,247,0.7)"
                                                    : "0 0 12px rgba(56,189,248,0.5)",
                                                transform: "translateY(-2px)",
                                                border: m.is_owner
                                                    ? "1px solid #a855f7"
                                                    : "1px solid #38bdf8"
                                            }
                                            : {}
                                    }}
                                >
                                    <Avatar
                                        src={m.logo}
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            mr: 2,
                                            border: "2px solid #38bdf8"
                                        }}
                                    />

                                    <Stack spacing={0.5}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {m.name}
                                        </Typography>

                                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                                            {translate('pos.login.merchant_id')}: {m.merchant_id}
                                        </Typography>

                                        {/* 状态 */}
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: m.status === "已验证" || m.verified
                                                    ? "#22c55e"
                                                    : "#ef4444"
                                            }}
                                        >
                                            {m.status === "已验证" || m.verified
                                                ? translate('pos.login.status_ok')
                                                : (m.status && m.status !== "未验证"
                                                    ? m.status
                                                    : translate('pos.login.status_no'))}

                                        </Typography>

                                        {/* 🔥 角色 */}
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: role.color,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {role.label}
                                        </Typography>
                                    </Stack>
                                </Card>
                            </CardActionArea>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default MerchantSelector;