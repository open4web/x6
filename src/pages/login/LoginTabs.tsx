import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import LoginCard from './LoginCard';
import Login2FACardCard from './Login2FA';
import {Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';
import GenerateOTP from "./GenerateOTP";
import {useCartContext} from "../../dataProvider/MyCartProvider";
import MerchantSelector from './MerchantSelect';
import {authApi} from "../../utils/axios";

interface LoginTabsProps {
    loading: boolean;
}


// @ts-ignore
const LoginTabs: React.FC<LoginTabsProps> = ({loading}) => {
    const [currentLoginStep, setCurrentLoginStep] = useState(
        () => localStorage.getItem('step') || 'password'
    );
    const [myOtpUrl, setMyOtpUrl] = React.useState(localStorage.getItem('otp_url') || '');
    const [merchants, setMerchants] = useState<any[]>([]); // ✅ 新增
    const {loginStep, setLoginStep} = useCartContext();
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 相似於 componentDidMount 和 componentDidUpdate:
    useEffect(() => {
        const step = localStorage.getItem('step') || 'password'
        // const otpUrl = localStorage.getItem('otp_url') || ''
        const merchantStr = localStorage.getItem('merchant') || '[]';
        // @ts-ignore
        setCurrentLoginStep(step)
        // ✅ 正确解析 merchants
        try {
            const parsed = JSON.parse(merchantStr);
            setMerchants(parsed);
        } catch (e) {
            console.error("merchant parse error", e);
            setMerchants([]);

        }
    }, [loginStep]);

    // 点击商户
    const handleSelectMerchant = async (m: any) => {
        // 2️⃣ 调后端切换商户
        try {
            const res = await authApi.post("/user/signin", {
                user_id: m.id,
                merchant_id: m.merchant_id,
                step: 5,
            });

            // ✅ 正常 200 登录成功
            const data = res.data;

            localStorage.setItem('token', data.token || '');
            localStorage.setItem('user_id', data.user_id || '');

        } catch (error: any) {

            // 🔥 关键：拿到 response
            const res = error.response;

            if (!res) {
                console.error("网络错误:", error);
                return;
            }

            const status = res.status;
            const data = res.data;

            // ✅ 处理 307（MFA）
            if (status === 307) {
                console.log("需要 MFA:", data);

                localStorage.setItem('user_id', data.user_id || '');
                localStorage.setItem('step', data.step || '');
                localStorage.setItem('verified_otp', String(data.verified_otp));
                localStorage.setItem('otp_url', data.url_otp || '');
                localStorage.setItem('mfa_expire', String(data.expire || ''));
                localStorage.setItem('login_id', data.login_id || '');

                if (data.step == "mfa") {
                    // 👉 切换 UI
                    setCurrentLoginStep('mfa');
                } else {
                    // 👉 切换 UI
                    setCurrentLoginStep('mfa-bind');
                    setMyOtpUrl(data.url_otp)
                }
                return;
            }

            // ✅ 处理 300（多商户）
            if (status === 300) {
                localStorage.setItem('step', data.step || 'mch');
                localStorage.setItem('merchant', JSON.stringify(data.merchant || []));
                setCurrentLoginStep('mch');
                return;
            }

            // ❌ 其他错误
            console.error("登录失败:", data?.message);
        }


    };

    // @ts-ignore
    return (
        <>
        <Card sx={{minWidth: 400, marginTop: "6em", borderRadius: 2}}>
            <Box
            >
                <TabContext value={currentLoginStep}>
                    <TabPanel value="password">
                        <LoginCard loading={loading} color={"info.main"}/>
                    </TabPanel>
                    <TabPanel value="mch">
                        <MerchantSelector
                            merchants={merchants}
                            onSelect={handleSelectMerchant}
                        />
                    </TabPanel>
                    <TabPanel value="mfa-bind">
                        <GenerateOTP loading={loading} myOtpUrl={myOtpUrl}/>
                    </TabPanel>
                    <TabPanel value="mfa">
                        <Login2FACardCard
                            loading={loading} color={"info.main"}/>
                    </TabPanel>
                </TabContext>
            </Box>
        </Card>
        </>
    );
}

export default LoginTabs;