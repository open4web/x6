import axios, { Method } from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

export const useFetchData = () => {
    const navigate = useNavigate();
    const cookie = localStorage.getItem('cookie') || '';
    const [alertMessage, setAlertMessage] = useState<string | null>(null); // 提示消息
    const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info'); // 提示类型
    const [open, setOpen] = useState(false); // 控制 Snackbar 的显示状态

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const showAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        setAlertMessage(message);
        setAlertType(type);
        setOpen(true);
    };

    const fetchData = React.useCallback(
        async (
            path: string,
            setResponse: (response: any) => void,
            method: Method = 'GET',
            data?: any
        ) => {
            try {
                const config = {
                    method,
                    url: path,
                    headers: {
                        'Content-Type': 'application/json',
                        Cookies: cookie,
                    },
                    data: method !== 'GET' ? data : undefined,
                };

                const response = await axios(config);

                if (response.status === 200) {
                    console.log(`Data fetched from ${path}:`, response.data);
                    setResponse(response.data);
                    showAlert('请求成功！', 'success'); // 成功提示
                } else {
                    console.error(`Unexpected response status from ${path}:`, response.status);
                    showAlert('服务器响应异常，请稍后重试！', 'warning'); // 非 200 提示
                }
            } catch (error) {
                console.error(`Error fetching data from ${path}:`, error);
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 401) {
                        console.warn('Unauthorized (401): Clearing cookies.');
                        localStorage.removeItem('cookie');
                        navigate('/login');
                        showAlert('登录状态已过期，请重新登录！', 'warning'); // 未授权提示
                    } else {
                        showAlert(`请求失败：${error.response.statusText}`, 'error'); // 其他错误提示
                    }
                } else {
                    showAlert('网络错误或未知错误，请检查网络连接！', 'error'); // 网络错误提示
                }
            }
        },
        [cookie, navigate]
    );

    return { fetchData, alertComponent: (
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        )};
};