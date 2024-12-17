import { useNotify, useRedirect, useTranslate } from 'react-admin';
import LockIcon from '@mui/icons-material/Lock';
import OtpInput from 'react-otp-input';
import { Avatar, Box, Button, Card, CardActions, CircularProgress, Grid, Typography } from '@mui/material';
import { authApi } from '../../utils/axios';
import React, { useState } from 'react';
import Countdown from "react-countdown";

interface Login2FACardProps {
    loading: boolean;
    color: string;
}

const generateRandomAvatar = () => {
    const randomHash = Math.random().toString(16).substring(2); // 生成随机哈希值
    const avatarUrl = `https://www.gravatar.com/avatar/${randomHash}?d=identicon`; // Gravatar URL，使用 identicon 作为默认头像
    return avatarUrl;
};

const Login2FACard: React.FC<Login2FACardProps> = ({ loading, color }) => {

    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const [otp, setOtp] = useState('');

    const verifyOtp = async () => {
        try {
            const loginId = localStorage.getItem('login_id') || '';
            const { data: { token, roles, tool_bar, user_id, username, avatar } } = await authApi.post('/user/otp/validate', {
                code: otp,
                login_id: loginId,
            });

            notify('验证成功', { type: 'success' });

            const keysToRemove = ['verified_otp', 'user_id', 'code', 'otp_url', 'step', 'mfa_expire', 'login_id'];
            keysToRemove.forEach((key) => localStorage.removeItem(key));

            localStorage.setItem('token', token);
            localStorage.setItem('permissions', roles);
            localStorage.setItem('toolbar', tool_bar);
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('username', username);
            // 如果没有设置avatar则随机生成一个
            localStorage.setItem('avatar', avatar ? avatar : generateRandomAvatar());
            redirect('/');
        } catch (error) {
            notify('安全码不正确，请重新输入', { type: 'error' });
        }
    };

    const handleSubmit = () => {
        verifyOtp().then(() => {
            notify('请求验证中', { type: 'info' });
        });
    };

    const cleanCache = () => {
        const keysToRemove = ['verified_otp', 'user_id', 'code', 'otp_url', 'step'];
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        redirect('/#/login');
    };

    // 获取 user_id
    const userId = localStorage.getItem('user_id') || 'Unknown User';

    // @ts-ignore
    return (
        <Card sx={{ minWidth: 400, padding: 3 }}>
            {/* 图标和用户ID */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
                <Avatar sx={{ width: 50, height: 50 }}>
                    <LockIcon fontSize="large" color={"success"} />
                </Avatar>
                <Typography
                    variant="h6"
                    sx={{ marginLeft: 2, color: "text.primary", fontWeight: "bold" }}
                >
                    {userId}
                </Typography>
            </Box>

            {/* 倒计时 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                <Typography
                    variant="body1"
                    sx={{ color: "error.main", fontSize: "1.2rem", fontWeight: "bold" }}
                >
                    {/*@ts-ignore*/}
                    <Countdown
                        date={Date.now() + 1000 * parseInt(localStorage.getItem("mfa_expire") || '0', 10)}
                        intervalDelay={1000}
                        precision={1000}
                        onComplete={cleanCache}
                        renderer={(props) => `剩余时间: ${Math.floor(props.total / 1000)} 秒`}
                    />
                </Typography>
            </Box>

            {/* OTP 输入框 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                <OtpInput
                    inputStyle={{
                        fontSize: 20,
                        width: 50,
                        height: 50,
                        borderRadius: 5,
                        border: '1px solid #ccc',
                        textAlign: 'center',
                        margin: '0 5px',
                    }}
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                />
            </Box>

            {/* 按钮 */}
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ width: '100%' }}
                >
                    {loading && <CircularProgress size={25} thickness={2} sx={{ marginRight: 2 }} />}
                    {translate('pos.auth.validate') || '验证 MFA'}
                </Button>
            </CardActions>
        </Card>
    );
};

export default Login2FACard;