import {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {useLocation} from 'react-router-dom';

import {
    Form,
    useLogin,
    useNotify,
    useTranslate,
} from "react-admin";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoginTabs from './LoginTabs';
import {LoginInput, LoginSubmitResult} from "./types";
import {useCartContext} from "../../dataProvider/MyCartProvider";
import AppearanceMenu from "../../layout/AppearanceMenu";
import {playPosSound} from "../../utils/touchSound";
import {takeLoginPending} from "./rememberLogin";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState(0);
    const notify = useNotify();
    const login = useLogin();
    const location = useLocation();
    const translate = useTranslate();
    const { setLoginStep } = useCartContext();

    const loadingRef = useRef(false);
    const submitLogin = (auth: LoginInput): Promise<LoginSubmitResult> => {
        if (loadingRef.current) return Promise.resolve({ok: false});
        loadingRef.current = true;
        setLoading(true);
        auth.step = loginType;
        const nextPath = location.state ? (location.state as any).nextPathname : "/";
        return login(auth, nextPath).then(
            () => ({ok: true}),
            (error: Error) => {
                loadingRef.current = false;
                setLoading(false);
                setLoginStep(Date.now().toString());
                if (takeLoginPending()) {
                    return {ok: false, pending: true};
                }
                playPosSound('warn');
                notify(
                    typeof error === "string"
                        ? error
                        : typeof error === "undefined" || !error.message
                            ? "ra.auth.sign_in_error"
                            : error.message,
                    {
                        type: "warning",
                        messageArgs: {
                            _:
                                typeof error === "string"
                                    ? error
                                    : error && error.message
                                        ? error.message
                                        : undefined,
                        },
                    }
                );
                return {ok: false};
            }
        );
    };

    // Form 会把 onSubmit 的返回值当成字段错误。{ ok: false } 会留在未注册的 ok 上，改密码再提交仍判无效。
    const handleFormSubmit = (auth: LoginInput) => submitLogin(auth).then(() => undefined);

    return (
        <Form onSubmit={handleFormSubmit} noValidate>
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    minHeight: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                    px: {xs: 2, sm: 3},
                    py: 3,
                    background: (theme) => theme.palette.mode === "dark"
                        ? "radial-gradient(900px 420px at 0% 0%, rgba(224,122,47,0.22), transparent 55%), #14110e"
                        : "radial-gradient(900px 420px at 0% 0%, rgba(224,122,47,0.28), transparent 52%), linear-gradient(165deg, #fff8f1 0%, #f4e6d4 100%)",
                }}>
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 2,
                }}>
                    <AppearanceMenu />
                </Box>
                <Box
                    sx={{
                        width: "min(960px, 100%)",
                        display: "grid",
                        gridTemplateColumns: {xs: "1fr", md: "280px 1fr"},
                        borderRadius: 3,
                        overflow: "hidden",
                        bgcolor: "background.paper",
                        boxShadow: "0 18px 50px rgba(43, 33, 24, 0.18)",
                    }}
                >
                    <Box
                        sx={{
                            display: {xs: "none", md: "flex"},
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 4,
                            color: "#f6e7d4",
                            background: "linear-gradient(180deg, #3a2a1d 0%, #24180f 100%)",
                        }}
                    >
                        <Box>
                            <Typography sx={{letterSpacing: 3, fontSize: 13, opacity: 0.8}}>
                                {translate('pos.login.kicker', {_: '前台点餐'})}
                            </Typography>
                            <Typography sx={{mt: 2, fontSize: 40, fontWeight: 800, lineHeight: 1.1}}>
                                {translate('pos.login.title')}
                            </Typography>
                        </Box>
                        <Typography sx={{fontSize: 16, lineHeight: 1.6, opacity: 0.86}}>
                            {translate('pos.login.subtitle', {_: '触控屏收银登录'})}
                        </Typography>
                    </Box>
                    <Box sx={{p: {xs: 2.5, sm: 4}}}>
                        <Box sx={{display: {xs: "block", md: "none"}, mb: 2}}>
                            <Typography sx={{letterSpacing: 2, fontSize: 12, color: "text.secondary"}}>
                                {translate('pos.login.kicker', {_: '前台点餐'})}
                            </Typography>
                            <Typography sx={{fontSize: 32, fontWeight: 800, lineHeight: 1.15}}>
                                {translate('pos.login.title')}
                            </Typography>
                        </Box>
                        <LoginTabs loading={loading} onLogin={submitLogin}/>
                    </Box>
                </Box>
            </Box>
        </Form>
    );
};

Login.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};

export default Login;
