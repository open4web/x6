import * as React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import LoginCard from './LoginCard';
import Login2FACardCard from './Login2FA';
import {Card} from '@mui/material';
import {useEffect} from "react";
import GenerateOTP from "./GenerateOTP";

interface LoginTabsProps {
    loading: boolean;
}


// @ts-ignore
const LoginTabs: React.FC<LoginTabsProps> = ({ loading }) => {
    const [currentLoginStep, setCurrentLoginStep] = React.useState('password');
    const [doesOtpVerified, setDoesOtpVerified] = React.useState(false);
    const [myOtpUrl, setMyOtpUrl] = React.useState('');

    // 相似於 componentDidMount 和 componentDidUpdate:
    useEffect(() => {
        const step = localStorage.getItem('step') || 'password'
        const otpVerified = localStorage.getItem('verified_otp') || 'false'
        const otpUrl = localStorage.getItem('otp_url') || ''
        // @ts-ignore
        setCurrentLoginStep(step)

        // @ts-ignore
        if (otpVerified == 'true') {
            setDoesOtpVerified(true)
        } else {
            setDoesOtpVerified(false)
        }

        setMyOtpUrl(otpUrl)
    });

    // @ts-ignore
    return (
        <Card sx={{minWidth: 300, marginTop: "6em", borderRadius: 5}}>
            <Box
            >
                <TabContext value={currentLoginStep}>
                    <TabPanel value="password">
                        <LoginCard loading={loading} color={"info.main"}/>
                    </TabPanel>
                    <TabPanel value="mfa">
                        {
                            doesOtpVerified ?
                                <Login2FACardCard
                                    loading={loading} color={"info.main"}/> :
                                <GenerateOTP loading={loading} myOtpUrl={myOtpUrl}/>
                        }
                    </TabPanel>
                </TabContext>
            </Box>
        </Card>
    );
}

export default LoginTabs;