import * as React from 'react';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';
import {useTranslate} from 'react-admin';
import {formatRequestErrorCopy, REQUEST_ERROR_EVENT, RequestErrorInfo} from '../utils/requestError';

export default function RequestErrorHost() {
    const translate = useTranslate();
    const [info, setInfo] = React.useState<RequestErrorInfo | null>(null);
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        const onError = (event: Event) => {
            const detail = (event as CustomEvent<RequestErrorInfo>).detail;
            if (!detail) {
                return;
            }
            setCopied(false);
            setInfo(detail);
        };
        window.addEventListener(REQUEST_ERROR_EVENT, onError);
        return () => window.removeEventListener(REQUEST_ERROR_EVENT, onError);
    }, []);

    const copy = async () => {
        if (!info) {
            return;
        }
        const text = formatRequestErrorCopy(info);
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const area = document.createElement('textarea');
            area.value = text;
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            document.body.removeChild(area);
        }
        setCopied(true);
    };

    return (
        <Dialog open={!!info} onClose={() => setInfo(null)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{fontWeight: 800}}>
                {info?.noAccess
                    ? translate('pos.request_error.no_access_title', {_: '该页面无访问权限'})
                    : translate('pos.request_error.title', {_: '请求失败'})}
            </DialogTitle>
            <DialogContent>
                <Typography sx={{fontSize: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                    {info?.message}
                </Typography>
                {info?.status ? (
                    <Typography variant="body2" color="text.secondary" sx={{mt: 1.5}}>
                        {translate('pos.request_error.status', {_: '状态码'})}: {info.status}
                    </Typography>
                ) : null}
                <Box sx={{mt: 1.5, p: 1.25, borderRadius: 1, bgcolor: 'action.hover'}}>
                    <Typography variant="caption" color="text.secondary">
                        {translate('pos.request_error.request_id', {_: 'Request-Id'})}
                    </Typography>
                    <Typography sx={{fontFamily: 'monospace', fontWeight: 700, wordBreak: 'break-all'}}>
                        {info?.requestId || translate('pos.request_error.none', {_: '未返回'})}
                    </Typography>
                </Box>
                {info?.url ? (
                    <Typography variant="caption" color="text.secondary" sx={{display: 'block', mt: 1, wordBreak: 'break-all'}}>
                        {info.method} {info.url}
                    </Typography>
                ) : null}
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={copy} variant="outlined">
                    {copied
                        ? translate('pos.request_error.copied', {_: '已复制'})
                        : translate('pos.request_error.copy', {_: '复制错误信息'})}
                </Button>
                <Button onClick={() => setInfo(null)} variant="contained">
                    {translate('pos.request_error.close', {_: '关闭'})}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
