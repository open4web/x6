import {useState} from 'react';
import PropTypes from 'prop-types';
import {useLocation} from 'react-router-dom';

import {
    Form,
    useLogin,
    useNotify,
} from "react-admin";

import Box from "@mui/material/Box";
import LoginTabs from './LoginTabs';
import {LoginInput} from "./types";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState(0);
    const notify = useNotify();
    const login = useLogin();
    const location = useLocation();

    const handleSubmit = (auth: LoginInput) => {
        setLoading(true);
        // 默认 0 即对应LoginStep 为 0的密码登陆阶段
        auth.step = loginType;
        login(
            auth,
            location.state ? (location.state as any).nextPathname : "/"
        ).catch((error: Error) => {
            setLoading(false);
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
        });
    };

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    background: "url(https://picsum.photos/1600/1200)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}>
                <LoginTabs loading={loading}/>
            </Box>
        </Form>
    );
};

Login.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};

export default Login;

interface FormValues {
    merchant_id?: string;
    phone?: string;
    password?: string;
    type?: string;
}

interface LoginForm {
    phone?: string;
    password?: string;
    step?: number;
}
