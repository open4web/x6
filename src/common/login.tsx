import {LoginInput} from "./types";
import {redirect} from "react-router";


const loginEndpoint = "/v1/system/auth/user/signin";
const logoutEndpoint = "/v1/system/auth/user/signout";

export const HandleLogin = async (params: LoginInput) => {
    const { phone, password, step } = params;
    const request = new Request(loginEndpoint, {
        method: 'POST',
        body: JSON.stringify({ phone, password, step }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    try {
        const response = await fetch(request);
        const responseData = await response.json();

        if (response.status < 200 || response.status >= 400) {
            throw new Error(responseData.message);
        }

        console.log("username -->", responseData.username)

        // Handle specific status codes
        switch (response.status) {
            case 307:
                localStorage.setItem('user_id', responseData.user_id);
                localStorage.setItem('step', responseData.step);
                localStorage.setItem('verified_otp', responseData.verified_otp);
                localStorage.setItem('otp_url', responseData.url_otp);
                localStorage.setItem('mfa_expire', responseData.expire);
                localStorage.setItem('login_id', responseData.login_id);
                throw new Error(responseData.message);
            default:
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('permissions', responseData.roles);
                localStorage.setItem('toolbar', responseData.tool_bar);
                localStorage.setItem('user_id', responseData.user_id);
                break;
        }
    } catch (error) {
        // @ts-ignore
        throw new Error(error.message);
    }
};

export const HandleLogout = async () => {
    const request = new Request(logoutEndpoint, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    try {
        const response = await fetch(request);
        const responseData = await response.json();

        if (response.status < 200 || response.status >= 300) {
            throw new Error(responseData.message);
        }

        // Remove items from localStorage
        const itemsToRemove = [
            'token',
            'permissions',
            'toolbar',
            'otp_verified',
            'user_id',
            'code',
            'otp_url',
            'step',
            'username'
        ];
        itemsToRemove.forEach(item => localStorage.removeItem(item));
    } catch (error) {
        // @ts-ignore
        // throw new Error(error.message);
        redirect("/#/login")

    }
};
