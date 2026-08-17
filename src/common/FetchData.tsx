import axios, { Method } from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import {tPos} from '../i18n/t';

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
                    url: path + (method === 'GET' ? '?filter=' +  JSON.stringify(data) : ''),
                    headers: {
                        'Content-Type': 'application/json',
                        Cookies: cookie,
                        Authorization: cookie,
                    },
                    data: method !== 'GET' ? data : undefined,
                };

                const response = await axios(config);

                if (response.status === 200 || response.status === 201) {
                    console.log(`Data fetched from ${path}:`, response.data);
                    setResponse(response.data);
                    showAlert(tPos('common.success'), 'success');
                } else {
                    console.error(`Unexpected response status from ${path}:`, response.status);
                    showAlert(tPos('common.server'), 'warning');
                }
            } catch (error) {
                console.error(`Error fetching data from ${path}:`, error);
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 401) {
                        console.warn('Unauthorized (401): Clearing cookies.');
                        localStorage.removeItem('cookie');
                        navigate('/login');
                        showAlert(tPos('common.expired'), 'warning');
                    } else {
                        showAlert(tPos('common.failed', {text: error.response.statusText}), 'error');
                    }
                } else {
                    showAlert(tPos('common.network'), 'error');
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