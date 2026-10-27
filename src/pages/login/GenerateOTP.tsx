import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import QRCode from "qrcode";
import {useEffect, useState} from "react";
import {Avatar, Box, CircularProgress} from "@mui/material";
import {useNotify, useRedirect, useTranslate} from "react-admin";
import {authApi} from "../../utils/axios";
import TokenIcon from '@mui/icons-material/Token';
import {useCartContext} from "../../dataProvider/MyCartProvider";
import {tPos} from '../../i18n/t';
import OtpKeypad from './OtpKeypad';
import {playPosSound} from '../../utils/touchSound';
import {useRef} from 'react';

// @ts-ignore
export default function GenerateOTP({loading, myOtpUrl}) {
    const [otp, setOtp] = useState('');
    const [qrcodeUrl, setqrCodeUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);
    const notify = useNotify();
    const redirect = useRedirect();
    const {loginStep} = useCartContext();


    useEffect(() => {
        if (!myOtpUrl) return; // ✅ 防止空值

        QRCode.toDataURL(myOtpUrl)
            .then(setqrCodeUrl)
            .catch(err => {
                console.error("二维码生成失败:", err);
            });

    }, [myOtpUrl,loginStep ]); // ✅ 关键：依赖变化时重新生成

    const translate = useTranslate();

    const verifyOtp = async (code: string) => {
        if (submittingRef.current || code.length !== 6) return;
        submittingRef.current = true;
        setSubmitting(true);
        try {
            const userId = localStorage.getItem('user_id') || ''

            await authApi.post<{ otp_verified: string }>(
                "/user/otp/verify",
                {
                    code,
                    user_id: userId,
                }
            );

            localStorage.setItem('verified_otp', 'true')

            notify(tPos('common.success'), {type: 'success'});

            redirect('/#/login');

        } catch (error: any) {
            submittingRef.current = false;
            setSubmitting(false);
            setOtp('');
            notify(tPos('common.failed', {text: '2FA'}), {type: 'error'});
        }
    };

    const busy = loading || submitting;

    const handleOtpChange = (next: string) => {
        setOtp(next);
        if (next.length === 6) verifyOtp(next);
    };

    return (
        <Card sx={{maxWidth: 480}}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Avatar sx={{bgcolor: "red"}}>
                    <TokenIcon/>
                </Avatar>
            </Box>

            <CardMedia
                sx={{height: 200, width: 200, margin: "auto"}}
                image={qrcodeUrl}
                title="qr code"
            />
            <CardContent>
                <OtpKeypad
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={busy}
                    onPress={() => playPosSound('key')}
                    deleteLabel={translate('pos.login.otp_delete', {_: '删除'})}
                    clearLabel={translate('pos.login.otp_clear', {_: '清空'})}
                />
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    color="warning"
                    type="button"
                    onClick={() => verifyOtp(otp)}
                    disabled={busy || otp.length !== 6}
                    fullWidth
                    sx={{minHeight: 64, fontSize: 20, fontWeight: 800}}
                >
                    {busy && <CircularProgress size={25} thickness={2}/>}
                    {translate("pos.auth.verified")}
                </Button>
            </CardActions>
        </Card>
    );
}