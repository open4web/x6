import { useNotify, useRedirect, useTranslate } from 'react-admin';
import LockIcon from '@mui/icons-material/Lock';
import OtpInput from 'react-otp-input';
import { Avatar, Box, Button, Card, CardActions, CircularProgress, Typography } from '@mui/material';
import { authApi } from '../../utils/axios';
import React, { useRef, useState } from 'react';
import Countdown from 'react-countdown';

interface Login2FACardProps {
    loading: boolean;
    color: string;
}

const generateRandomAvatar = () => {
    const randomHash = Math.random().toString(16).substring(2);
    return `https://www.gravatar.com/avatar/${randomHash}?d=identicon`;
};

const Login2FACard: React.FC<Login2FACardProps> = ({ loading, color }) => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const [otp, setOtp] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false); // 防止重复提交

    const verifyOtp = async (code: string) => {
        if (submittingRef.current) return;
        if (code.length !== 6) return;

        submittingRef.current = true;
        setSubmitting(true);

        try {
            const loginId = localStorage.getItem('login_id') || '';
            const {
                data: { token, roles, tool_bar, user_id, username, avatar },
            } = await authApi.post('/user/otp/validate', {
                code,
                login_id: loginId,
            });

            notify('msg.verify_success', { type: 'success' });

            const keysToRemove = [
                'verified_otp',
                'user_id',
                'code',
                'otp_url',
                'step',
                'mfa_expire',
                'login_id',
            ];
            keysToRemove.forEach((key) => localStorage.removeItem(key));

            localStorage.setItem('token', token);
            localStorage.setItem('permissions', roles);
            localStorage.setItem('toolbar', tool_bar);
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('username', username);
            localStorage.setItem('avatar', avatar ? avatar : generateRandomAvatar());
            redirect('/');
        } catch (error: any) {
            const status = error?.response?.status;

            if (status === 502) {
                // 502：清空输入，等待重新输入
                setOtp('');
                notify('服务暂时不可用，请重新输入验证码', { type: 'warning' });
            } else {
                setOtp(''); // 验证失败也清空，方便重新输入
                notify('msg.verify_error', { type: 'error' });
            }
        } finally {
            submittingRef.current = false;
            setSubmitting(false);
        }
    };

    const handleOtpChange = (value: string) => {
        // 只保留数字
        const next = value.replace(/\D/g, '').slice(0, 6);
        setOtp(next);

        // 输满 6 位自动提交
        if (next.length === 6) {
            verifyOtp(next);
        }
    };

    const handleSubmit = () => {
        verifyOtp(otp);
    };

    const cleanCache = () => {
        const keysToRemove = ['verified_otp', 'user_id', 'code', 'otp_url', 'step', 'mfa_expire', 'login_id'];
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        redirect('/#/login');
    };

    const userId = localStorage.getItem('user_id') || 'Unknown User';
    const isLoading = loading || submitting;

    return (
        <Card sx={{ minWidth: 400, padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
                <Avatar sx={{ width: 50, height: 50 }}>
                    <LockIcon fontSize="large" color="success" />
                </Avatar>
                <Typography variant="h6" sx={{ marginLeft: 2, color: 'text.primary', fontWeight: 'bold' }}>
                    {userId}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                <Typography variant="body1" sx={{ color: 'error.main', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {/* @ts-expect-error react-countdown 与项目 @types/react 版本冲突 */}
                    <Countdown
                        date={Date.now() + 1000 * parseInt(localStorage.getItem('mfa_expire') || '0', 10)}
                        intervalDelay={1000}
                        precision={1000}
                        onComplete={cleanCache}
                        renderer={(props) => `剩余时间: ${Math.floor(props.total / 1000)} 秒`}
                    />
                </Typography>
            </Box>

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
                    onChange={handleOtpChange}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} disabled={isLoading} />}
                    shouldAutoFocus
                />
            </Box>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleSubmit}
                    disabled={isLoading || otp.length !== 6}
                    sx={{ width: '100%' }}
                >
                    {isLoading && <CircularProgress size={25} thickness={2} sx={{ marginRight: 2 }} />}
                    {translate('pos.auth.validate') || '验证 MFA'}
                </Button>
            </CardActions>
        </Card>
    );
};

export default Login2FACard;