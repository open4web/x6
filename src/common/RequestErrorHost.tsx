import * as React from 'react';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';
import {useTranslate} from 'react-admin';
import {
    closeRequestErrorDialog,
    formatRequestErrorBatchCopy,
    formatRequestErrorCopy,
    REQUEST_ERROR_EVENT,
    requestErrorItemsFromEvent,
    RequestErrorInfo,
} from '../utils/requestError';

function ErrorFields({
    info,
    translate,
}: {
    info: RequestErrorInfo;
    translate: (key: string, options?: any) => string;
}) {
    return (
        <>
            <Typography sx={{fontSize: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                {info.message}
            </Typography>
            {info.status ? (
                <Typography variant="body2" color="text.secondary" sx={{mt: 1.5}}>
                    {translate('pos.request_error.status', {_: '状态码'})}: {info.status}
                </Typography>
            ) : null}
            <Box sx={{mt: 1.5, p: 1.25, borderRadius: 1, bgcolor: 'action.hover'}}>
                <Typography variant="caption" color="text.secondary">
                    {translate('pos.request_error.request_id', {_: 'Request-Id'})}
                </Typography>
                <Typography sx={{fontFamily: 'monospace', fontWeight: 700, wordBreak: 'break-all'}}>
                    {info.requestId || translate('pos.request_error.none', {_: '未返回'})}
                </Typography>
            </Box>
            {info.url ? (
                <Typography variant="caption" color="text.secondary" sx={{display: 'block', mt: 1, wordBreak: 'break-all'}}>
                    {info.method} {info.url}
                </Typography>
            ) : null}
        </>
    );
}

export default function RequestErrorHost() {
    const translate = useTranslate();
    const [items, setItems] = React.useState<RequestErrorInfo[]>([]);
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        const onError = (event: Event) => {
            const detail = (event as CustomEvent<RequestErrorInfo & {items?: RequestErrorInfo[]}>).detail;
            const next = requestErrorItemsFromEvent(detail);
            if (!next.length) {
                return;
            }
            setCopied(false);
            setItems(next);
        };
        window.addEventListener(REQUEST_ERROR_EVENT, onError);
        return () => window.removeEventListener(REQUEST_ERROR_EVENT, onError);
    }, []);

    const close = () => {
        closeRequestErrorDialog();
        setItems([]);
        setCopied(false);
    };

    const copy = async () => {
        if (!items.length) {
            return;
        }
        const text = items.length === 1
            ? formatRequestErrorCopy(items[0])
            : formatRequestErrorBatchCopy(items);
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

    const info = items[0];
    const many = items.length > 1;

    return (
        <Dialog open={items.length > 0} onClose={close} maxWidth="sm" fullWidth>
            <DialogTitle sx={{fontWeight: 800}}>
                {many
                    ? translate('pos.request_error.title_many', {_: '请求失败（%{n} 条）', n: items.length})
                    : info?.noAccess
                        ? translate('pos.request_error.no_access_title', {_: '该页面无访问权限'})
                        : translate('pos.request_error.title', {_: '请求失败'})}
            </DialogTitle>
            <DialogContent>
                {many ? (
                    <Box sx={{maxHeight: 360, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5}}>
                        {items.map((item, index) => (
                            <Box
                                key={item.seq ?? `${item.requestId}-${item.url}-${index}`}
                                sx={{
                                    pb: 1.5,
                                    borderBottom: index < items.length - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                }}
                            >
                                <ErrorFields info={item} translate={translate} />
                            </Box>
                        ))}
                    </Box>
                ) : info ? (
                    <ErrorFields info={info} translate={translate} />
                ) : null}
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={copy} variant="outlined">
                    {copied
                        ? translate('pos.request_error.copied', {_: '已复制'})
                        : translate('pos.request_error.copy', {_: '复制错误信息'})}
                </Button>
                <Button onClick={close} variant="contained">
                    {translate('pos.request_error.close', {_: '关闭'})}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
