import axios, { Method } from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import {tPos} from '../i18n/t';
import {clearAuthStorage, readAuthToken} from '../utils/authToken';
import {isDeviceNotAllowed, markDeviceBlocked} from '../utils/deviceGuard';

const DEFAULT_TIMEOUT_MS = 15000;

export const useFetchData = () => {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
    const [open, setOpen] = useState(false);

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
            data?: any,
            quiet = false,
            opts?: { signal?: AbortSignal; timeoutMs?: number },
        ) => {
            const cookie = readAuthToken();
            try {
                const config = {
                    method,
                    url: path + (method === 'GET' ? '?filter=' +  JSON.stringify(data) : ''),
                    headers: {
                        'Content-Type': 'application/json',
                        Cookies: cookie,
                        Authorization: cookie ? `Bearer ${cookie}` : '',
                    },
                    data: method !== 'GET' ? data : undefined,
                    timeout: opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
                    signal: opts?.signal,
                };

                const response = await axios(config);

                if (response.status === 200 || response.status === 201) {
                    setResponse(response.data);
                    if (!quiet) {
                        showAlert(tPos('common.success'), 'success');
                    }
                    return response.data;
                }
                console.error(`Unexpected response status from ${path}:`, response.status);
                showAlert(tPos('common.server'), 'warning');
                throw new Error(`unexpected status ${response.status}`);
            } catch (error) {
                if (axios.isCancel(error) || (error as any)?.code === 'ERR_CANCELED') {
                    throw error;
                }
                console.error(`Error fetching data from ${path}:`, (error as any)?.message || error);
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 401) {
                        console.warn('Unauthorized (401): Clearing auth storage.');
                        clearAuthStorage();
                        navigate('/login');
                        showAlert(tPos('common.expired'), 'warning');
                    } else if (error.response.status === 403 && isDeviceNotAllowed(error.response.data)) {
                        markDeviceBlocked();
                        showAlert(tPos('device.blocked'), 'error');
                    } else {
                        showAlert(tPos('common.failed', {text: error.response.statusText}), 'error');
                    }
                } else if (!(error instanceof Error) || !String(error.message).startsWith('unexpected status')) {
                    showAlert(tPos('common.network'), 'error');
                }
                throw error;
            }
        },
        [navigate]
    );

    return { fetchData, alertComponent: (
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        )};
};
