import { useNotify, useRedirect, useTranslate } from 'react-admin';
import LockIcon from '@mui/icons-material/Lock';
import OtpInput from 'react-otp-input';
import { Avatar, Box, Button, Card, CardActions, CircularProgress, Grid } from '@mui/material';
import { authApi } from '../../../utils/axios';
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
            const { data: { token, roles, tool_bar, user_id, username } } = await authApi.post('/user/otp/validate', {
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
            localStorage.setItem('avatar', generateRandomAvatar());
            redirect('/');
        } catch (error) {
            notify('安全码不正确，请重新输入', { type: 'error' });
        }
    };

    const handleSubmit = () => {
        verifyOtp().then(r => {
            notify('请求验证中', {type: 'info'})
        });
    };

    const cleanCache = () => {
        console.log("clean cache")
        const keysToRemove = ['verified_otp', 'user_id', 'code', 'otp_url', 'step'];
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        redirect('/#/login');
    };

    // @ts-ignore
    return (
        <Card sx={{ minWidth: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {/*<Avatar sx={{ bgcolor: color }}>*/}
                        {/*    <LockIcon />*/}
                {/*@ts-ignore*/}
                <Countdown
                    date={Date.now() + 1000 * parseInt(localStorage.getItem("mfa_expire") || '0', 10)}
                    intervalDelay={1000}
                    precision={1000}
                    onComplete={cleanCache}
                    renderer={props => <div> 剩余时间 { Math.floor(props.total / 1000)} s</div>}
                />
            </Box>
            <Box sx={{ padding: '0 1em 1em 1em' }}>
                <Box sx={{ marginTop: '1em' , marginLeft: '1em'}}>
                    <OtpInput
                        inputStyle={{ fontSize: 50, borderRadius: 2 }}
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                    />
                </Box>
            </Box>
            <CardActions sx={{ padding: '0 1em 1em 1em' }}>
                <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    onClick={handleSubmit}
                    fullWidth
                    disabled={loading}
                >
                    {loading && <CircularProgress size={25} thickness={2} />}
                    {translate('pos.auth.validate')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default Login2FACard;
