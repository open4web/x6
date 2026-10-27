import {maxLength, minLength, number, required, TextInput, useTranslate,} from 'react-admin'
import LockIcon from '@mui/icons-material/Lock';
import {Avatar, Box, Button, Checkbox, CircularProgress, FormControlLabel,} from '@mui/material';
import {Controller, useFormContext} from 'react-hook-form';
import {useState} from 'react';
import {LoginInput, LoginSubmitResult} from './types';
import {clearRememberedLogin, formatRememberUntil, maskPhone, readRememberedLogin} from './rememberLogin';

const validatePhone = [required(), number(), minLength(11), maxLength(11)];
const validatePassword = [required(), minLength(6), maxLength(18)];

interface LoginCardProps {
    loading: boolean;
    color: string;
    onLogin: (auth: LoginInput) => Promise<LoginSubmitResult>;
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

const LoginCard = ({ loading, color, onLogin }: LoginCardProps) => {
    const translate = useTranslate();
    const { control } = useFormContext();
    const [remembered, setRemembered] = useState(readRememberedLogin);
    const [showForm, setShowForm] = useState(() => readRememberedLogin() == null);

    const switchAccount = () => {
        clearRememberedLogin();
        setRemembered(null);
        setShowForm(true);
    };

    const continueRemembered = async () => {
        const current = readRememberedLogin();
        if (!current) {
            setRemembered(null);
            setShowForm(true);
            return;
        }
        const result = await onLogin({
            phone: current.phone,
            password: current.password,
            remember: true,
        });
        if (result && result.ok === false && !result.pending) {
            const still = readRememberedLogin();
            setRemembered(still);
            if (!still) setShowForm(true);
        }
    };

    if (remembered && !showForm) {
        const phone = maskPhone(remembered.phone);
        const until = formatRememberUntil(remembered.until);
        return (
            <Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, mb: 2}}>
                    <Avatar sx={{bgcolor: color, width: 48, height: 48}}>
                        <LockIcon/>
                    </Avatar>
                    <Box>
                        <Box sx={{fontSize: 22, fontWeight: 800, lineHeight: 1.3}}>
                            {translate('pos.login.remembered_phone', {phone, _: `已记住 ${phone}`})}
                        </Box>
                        <Box sx={{color: 'text.secondary', fontSize: 16, lineHeight: 1.4}}>
                            {translate('pos.login.remembered_until', {time: until, _: `有效至 ${until}，换班只输动态码`})}
                        </Box>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    disabled={loading}
                    fullWidth
                    onClick={continueRemembered}
                    sx={{minHeight: 64, fontSize: 20, fontWeight: 800, borderRadius: 2}}
                >
                    {loading && <CircularProgress size={24} thickness={2} sx={{mr: 1.5, color: 'inherit'}}/>}
                    {translate('pos.login.remembered_go', {_: '继续，只输动态码'})}
                </Button>
                <Button
                    type="button"
                    color="inherit"
                    disabled={loading}
                    fullWidth
                    onClick={switchAccount}
                    sx={{minHeight: 56, mt: 1, fontSize: 18, fontWeight: 700}}
                >
                    {translate('pos.login.remembered_switch', {_: '换一个账号'})}
                </Button>
            </Box>
        );
    }

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
                {/* disabled 会把表单值清成空，输入框上的手机号还在，再提交会被判无效。 */}
                <TextInput
                    autoFocus
                    size="medium"
                    source="phone"
                    label={translate("pos.auth.phone")}
                    validate={validatePhone}
                    fullWidth
                    name="phone"
                    sx={fieldSx}
                    inputProps={{inputMode: "numeric", autoComplete: "username", readOnly: loading}}
                />
                <TextInput
                    source="password"
                    label={translate("ra.auth.password")}
                    type="password"
                    validate={validatePassword}
                    fullWidth
                    name="password"
                    sx={fieldSx}
                    inputProps={{autoComplete: "current-password", readOnly: loading}}
                />
                <Controller
                    name="remember"
                    control={control}
                    defaultValue={false}
                    render={({field}) => (
                        <FormControlLabel
                            sx={{alignItems: 'flex-start', ml: 0, mb: 1, minHeight: 64, userSelect: 'none'}}
                            control={
                                <Checkbox
                                    checked={!!field.value}
                                    onChange={(event) => field.onChange(event.target.checked)}
                                    onBlur={field.onBlur}
                                    inputRef={field.ref}
                                    disabled={loading}
                                    sx={{p: 1.25, '& .MuiSvgIcon-root': {fontSize: 32}}}
                                />
                            }
                            label={
                                <Box sx={{pt: 1}}>
                                    <Box sx={{fontSize: 18, fontWeight: 700, lineHeight: 1.3}}>
                                        {translate('pos.login.remember7', {_: '本机记住 7 天，换班只输动态码'})}
                                    </Box>
                                    <Box sx={{fontSize: 14, color: 'text.secondary', lineHeight: 1.4}}>
                                        {translate('pos.login.remember7_hint', {_: '密码只留在这台机器上。每次成功登录再顺延 7 天。'})}
                                    </Box>
                                </Box>
                            }
                        />
                    )}
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
