import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

type NoticeItem = { id: string; title?: string; content?: string; markdown?: boolean };

const unwrap = (json: any): NoticeItem[] => {
    const items = json?.items || json?.data?.items || [];
    return Array.isArray(items) ? items : [];
};

const load = async (channel: string, display: string) => {
    const merchantId = localStorage.getItem('merchant_id') || '';
    const headers: Record<string, string> = {};
    if (merchantId && merchantId !== '*') {
        headers['X-Merchant-ID'] = merchantId;
        headers['X-Tenant-ID'] = merchantId;
    }
    const res = await fetch(
        `/v1/hlj/client/mini/message/active?channel=${encodeURIComponent(channel)}&display=${encodeURIComponent(display)}`,
        { credentials: 'include', headers }
    );
    if (!res.ok) return [];
    return unwrap(await res.json());
};

const keyOf = (id: string) => `notice:dismiss:${localStorage.getItem('merchant_id') || ''}:${id}`;

export const NoticeHost = ({ channel }: { channel: string }) => {
    const [queue, setQueue] = React.useState<NoticeItem[]>([]);
    const [marquee, setMarquee] = React.useState('');
    const current = queue[0];

    React.useEffect(() => {
        let alive = true;
        const refresh = () => {
            load(channel, 'popup').then((items) => {
                if (!alive) return;
                setQueue(items.filter((row) => row.id && !localStorage.getItem(keyOf(row.id))));
            }).catch(() => {});
            load(channel, 'marquee').then((items) => {
                if (!alive) return;
                setMarquee(items.map((row) => row.title || row.content).filter(Boolean).join('   ·   '));
            }).catch(() => {});
        };
        refresh();
        const timer = window.setInterval(refresh, 60000);
        return () => {
            alive = false;
            window.clearInterval(timer);
        };
    }, [channel]);

    const dismiss = (persist: boolean) => {
        if (!current) return;
        if (persist) localStorage.setItem(keyOf(current.id), '1');
        setQueue((prev) => prev.slice(1));
    };

    return (
        <>
            {marquee ? (
                <Box sx={{ overflow: 'hidden', bgcolor: '#fff3cd', color: '#663c00', py: 0.4, px: 2, whiteSpace: 'nowrap' }}>
                    <Box component="span" sx={{ display: 'inline-block', animation: 'posMarquee 18s linear infinite', '@keyframes posMarquee': { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(-100%)' } } }}>
                        {marquee}
                    </Box>
                </Box>
            ) : null}
            <Dialog open={Boolean(current)} onClose={() => dismiss(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{current?.title || '通知'}</DialogTitle>
                <DialogContent>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>{current?.content}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => dismiss(false)}>稍后</Button>
                    <Button variant="contained" onClick={() => dismiss(true)}>知道了</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NoticeHost;
