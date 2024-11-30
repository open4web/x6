import axios, {Method} from 'axios';
import {useNavigate} from 'react-router-dom';
import React from "react";

// 通用 Fetch 函数
export const useFetchData = () => {
    const navigate = useNavigate();
    const cookie = localStorage.getItem('cookie') || '';

    // 通用数据获取函数
    return React.useCallback(
        async (path: string, setResponse: (response: any) => void, method: Method = 'GET', data?: any // 支持 POST、PUT 等方法发送数据
        ) => {
            try {
                const config = {
                    method,
                    url: path,
                    headers: {
                        'Content-Type': 'application/json',
                        Cookies: cookie,
                    },
                    data: method !== 'GET' ? data : undefined, // 仅非 GET 请求需要传递 body 数据
                };

                const response = await axios(config);

                if (response.status === 200) {
                    console.log(`Data fetched from ${path}:`, response.data);
                    setResponse(response.data);
                } else {
                    console.error(`Unexpected response status from ${path}:`, response.status);
                }
            } catch (error) {
                console.error(`Error fetching data from ${path}:`, error);
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 401) {
                        console.warn('Unauthorized (401): Clearing cookies.');
                        localStorage.removeItem('Cookie'); // 清除 Cookie
                        navigate('/login'); // 跳转到登录页面
                    } else {
                        console.error(`Unexpected error status from ${path}: ${error.response.status}`);
                    }
                } else {
                    console.error('Network or unexpected error:', error);
                }
            }
        },
        [cookie, navigate]
    );
};