import React from "react";
import {
    Box,
    FormControl,
    InputLabel,
    FilledInput,
    InputAdornment,
    IconButton,
    Typography,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {useTranslate} from 'react-admin';

interface Props {
    value: string;
    verified: boolean;
    onReset: () => void;
    label?: string;
}

export default function PayCodeDisplay({
                                           value,
                                           verified,
                                           onReset,
                                           label,
                                       }: Props) {
    const translate = useTranslate();
    const fieldLabel = label || translate('pos.pay.auth_code');
    return (
        <Box sx={{ m: 2 }}>

            <FormControl fullWidth variant="filled">

                <InputLabel>{fieldLabel}</InputLabel>

                <FilledInput
                    value={value}
                    readOnly
                    disableUnderline
                    sx={{
                        fontSize: 18,
                        letterSpacing: "2px",
                        fontWeight: 600,
                        backgroundColor: verified
                            ? "rgba(46, 125, 50, 0.08)"
                            : "rgba(0,0,0,0.04)",
                        borderRadius: 2,
                    }}
                    endAdornment={
                        <InputAdornment position="end">

                            {/* 状态 */}
                            {verified ? (
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "success.main",
                                    fontWeight: 600,
                                    mr: 1
                                }}>
                                    ✔ {translate('pos.pay.recognized')}
                                </Box>
                            ) : (
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "text.secondary",
                                    fontSize: 12,
                                    mr: 1
                                }}>
                                    {translate('pos.pay.waiting')}
                                </Box>
                            )}

                            {/* 重置 */}
                            <IconButton
                                onClick={onReset}
                                edge="end"
                                sx={{
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.08)"
                                    }
                                }}
                            >
                                {verified
                                    ? <VerifiedIcon color="success" />
                                    : <RestartAltIcon />
                                }
                            </IconButton>

                        </InputAdornment>
                    }
                />
            </FormControl>

            {/* 提示 */}
            <Box sx={{ mt: 1, px: 1 }}>
                <Typography
                    variant="caption"
                    color={verified ? "success.main" : "text.secondary"}
                >
                    {verified
                        ? translate('pos.pay.scan_ok')
                        : translate('pos.pay.scan_hint')
                    }
                </Typography>
            </Box>

        </Box>
    );
}