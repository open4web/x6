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
import OtpInput from "react-otp-input";
import TokenIcon from '@mui/icons-material/Token';

// @ts-ignore
export default function GenerateOTP({loading, myOtpUrl}) {
    const [otp, setOtp] = useState('');
    const [qrcodeUrl, setqrCodeUrl] = useState("");
    const notify = useNotify();
    const redirect = useRedirect();

    useEffect(() => {
        // @ts-ignore
        QRCode.toDataURL(myOtpUrl).then(setqrCodeUrl);
    }, []);
    const translate = useTranslate();

    const verifyOtp = async () => {
        try {
            const userId = localStorage.getItem('user_id') || ''

            // @ts-ignore
            const {
                data: {},
            } = await authApi.post<{ otp_verified: string }>(
                "/user/otp/verify",
                {
                    code: otp,
                    user_id: userId,
                }
            );

            // 移除标识以便下一次进入密码登陆页面
            localStorage.setItem('verified_otp', 'true')

            notify(`安全码绑定成功`, {type: 'success'});

            // 登陆成功后跳转到首页
            redirect('/#/login');

        } catch (error: any) {
            notify(`安全码绑定失败`, {type: 'error'});
        }
    };

    const onSubmitHandler = () => {
        verifyOtp();
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
                <Box sx={{padding: "0 1em 1em 1em"}}>
                    <Box sx={{marginTop: "1em"}}>
                        <OtpInput
                            inputStyle={{fontSize: 50, borderRadius: 5}}
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} />}
                        />
                    </Box>
                </Box>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    color="warning"
                    onClick={onSubmitHandler}
                    fullWidth
                >
                    {loading && <CircularProgress size={25} thickness={2}/>}
                    {translate("pos.auth.verified")}
                </Button>
            </CardActions>
        </Card>
    );
}