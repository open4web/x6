// 示例实现
import {AuthProvider} from "react-admin";
import {HandleLogin, HandleLogout} from "./login";

const MyAuthProvider: AuthProvider = {
    login: async (params: any) => {
        // 实现登录逻辑
        await HandleLogin(params);
        return Promise.resolve({ redirectTo: '/dashboard' });
    },
    logout: async (params: any) => {
        // 实现注销逻辑
        await HandleLogout()
        return Promise.resolve();
    },
    checkAuth: async (params: any) => {
        // 实现检查身份验证逻辑
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    },
    checkError: async (error: any) => {
        // 实现检查错误逻辑
        const status = error.status;
        if (status === 401 || status === 403 || status === 307) {
            localStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getIdentity: async () => {
        // 实现获取身份信息逻辑
        return Promise.resolve({
            id: 0,
            fullName: localStorage.getItem('username') || '未知',
            avatar: localStorage.getItem('avatar') || '' // Placeholder base64 image avatar
        });
    },
    getPermissions: async (params: any) => {
        // 实现获取权限逻辑
        const toolbar = localStorage.getItem('toolbar') || 3;
        return Promise.resolve(toolbar);
    }
};

export default MyAuthProvider;