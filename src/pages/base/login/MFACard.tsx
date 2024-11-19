import { useNotify, useRedirect, useTranslate } from 'react-admin';
import LockIcon from '@mui/icons-material/Lock';
import OtpInput from 'react-otp-input';
import { Avatar, Box, Button, Card, CardActions, CircularProgress } from '@mui/material';
import { authApi } from '../../../utils/axios';
import { useState } from 'react';

interface Login2FACardProps {
    loading: boolean;
    color: string;
}

const MFACard= () => {

    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const [otp, setOtp] = useState('');

    const verifyOtp = async () => {
        try {
            const userId = localStorage.getItem('user_id') || '';
            const { data: { token, roles, tool_bar, user_id } } = await authApi.post('/user/otp/validate', {
                code: otp,
                user_id: userId,
            });

            notify('验证成功', { type: 'success' });

            const keysToRemove = ['verified_otp', 'user_id', 'code', 'otp_url', 'step'];
            keysToRemove.forEach((key) => localStorage.removeItem(key));

            localStorage.setItem('token', token);
            localStorage.setItem('permissions', roles);
            localStorage.setItem('toolbar', tool_bar);
            localStorage.setItem('user_id', user_id);

            redirect('/');
        } catch (error) {
            notify('安全码不正确，请重新输入', { type: 'error' });
        }
    };

    const handleSubmit = () => {
        verifyOtp();
    };

    return (
        <Card sx={{ minWidth: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar sx={{ bgcolor: "warning" }}>
                    <LockIcon />
                </Avatar>
            </Box>
            <Box sx={{ padding: '0 1em 1em 1em' }}>
                <Box sx={{ marginTop: '1em' }}>
                    <OtpInput
                        inputStyle={{ fontSize: 50, borderRadius: 5 }}
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
                    // disabled={loading}
                >
                    {/*{loading && <CircularProgress size={25} thickness={2} />}*/}
                    {/*{translate('pos.auth.validate')}*/}
                    {"验证 MFA"}
                </Button>
            </CardActions>
        </Card>
    );
};

export default MFACard;
