import {maxLength, minLength, number, required, TextInput, useTranslate,} from 'react-admin'
import LockIcon from '@mui/icons-material/Lock';

import {Avatar, Box, Button, CircularProgress,} from '@mui/material';
import * as React from "react";

const validatePhone = [required(), number(), minLength(11), maxLength(11)];
const validatePassword = [required(), minLength(6), maxLength(18)];

interface LoginCardProps {
    loading: boolean;
    color: string;
}

const fieldSx = {
    '& .MuiInputBase-root': {
        minHeight: 64,
        fontSize: 22,
        borderRadius: 2,
    },
    '& .MuiInputLabel-root': {
        fontSize: 18,
    },
};

const LoginCard: React.FC<LoginCardProps> = ({ loading, color }) => {
    const translate = useTranslate();

    return (
        <Box>
            <Box sx={{display: "flex", alignItems: "center", gap: 1.5, mb: 2}}>
                <Avatar sx={{bgcolor: color, width: 48, height: 48}}>
                    <LockIcon/>
                </Avatar>
                <Box sx={{color: "text.secondary", fontSize: 16}}>
                    {translate('pos.login.subtitle', {_: '触控屏收银登录'})}
                </Box>
            </Box>
            <Box>
                <TextInput
                    autoFocus
                    size="medium"
                    source="phone"
                    label={translate("pos.auth.phone")}
                    disabled={loading}
                    validate={validatePhone}
                    fullWidth
                    name="phone"
                    sx={fieldSx}
                    inputProps={{inputMode: "numeric", autoComplete: "username"}}
                />
                <TextInput
                    source="password"
                    label={translate("ra.auth.password")}
                    type="password"
                    disabled={loading}
                    validate={validatePassword}
                    fullWidth
                    name="password"
                    sx={fieldSx}
                    inputProps={{autoComplete: "current-password"}}
                />
            </Box>
            <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                fullWidth
                sx={{minHeight: 64, mt: 1, fontSize: 20, fontWeight: 800, borderRadius: 2}}
            >
                {loading && <CircularProgress size={24} thickness={2} sx={{mr: 1.5, color: "inherit"}}/>}
                {translate("ra.auth.sign_in")}
            </Button>
        </Box>
    )
}

export default LoginCard;
