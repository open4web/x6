import {useEffect, useRef, useState} from 'react';
import {Box, ButtonBase, Popover, Typography} from '@mui/material';
import {tPos} from '../i18n/t';
import {
    barsFor,
    classifyLink,
    LINK_PROBE_INTERVAL_MS,
    type LinkLevel,
    type LinkSample,
    probeLink,
} from '../net/linkQuality';

type LinkView = {
    level: LinkLevel;
    rtt: number | null;
    checkedAt: number | null;
    okAt: number | null;
    recheck: () => void;
};

function useLinkQuality(): LinkView {
    const [view, setView] = useState<Omit<LinkView, 'recheck'>>({
        level: 'checking',
        rtt: null,
        checkedAt: null,
        okAt: null,
    });
    const recheckRef = useRef<() => void>(() => {});

    useEffect(() => {
        let alive = true;
        let busy = false;
        let okAt: number | null = null;
        const samples: LinkSample[] = [];
        const abort = new AbortController();

        const publish = (online: boolean) => {
            if (!alive) return;
            const grade = classifyLink(samples, online);
            const last = samples.length ? samples[samples.length - 1] : null;
            setView({
                level: grade.level,
                rtt: grade.rtt,
                checkedAt: last ? last.at : null,
                okAt,
            });
        };

        const run = async () => {
            const online = typeof navigator === 'undefined' || navigator.onLine !== false;
            if (!online) {
                samples.push({ok: false, down: false, rtt: null, at: Date.now()});
                if (samples.length > 5) samples.splice(0, samples.length - 5);
                publish(false);
                return;
            }
            if (busy) return;
            busy = true;
            try {
                const sample = await probeLink(fetch, {signal: abort.signal});
                if (!alive) return;
                samples.push(sample);
                if (samples.length > 5) samples.splice(0, samples.length - 5);
                if (sample.ok || sample.down) okAt = sample.at;
                publish(typeof navigator === 'undefined' || navigator.onLine !== false);
            } finally {
                busy = false;
            }
        };

        recheckRef.current = () => {
            void run();
        };
        void run();
        const timer = window.setInterval(() => {
            void run();
        }, LINK_PROBE_INTERVAL_MS);
        const onNet = () => {
            void run();
        };
        const onVisible = () => {
            if (!document.hidden) void run();
        };
        window.addEventListener('online', onNet);
        window.addEventListener('offline', onNet);
        document.addEventListener('visibilitychange', onVisible);
        return () => {
            alive = false;
            abort.abort();
            window.clearInterval(timer);
            window.removeEventListener('online', onNet);
            window.removeEventListener('offline', onNet);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, []);

    return {...view, recheck: () => recheckRef.current()};
}

function signalColor(level: LinkLevel): string {
    switch (level) {
        case 'excellent':
        case 'good':
            return '#ffffff';
        case 'fair':
            return '#ffe082';
        case 'weak':
            return '#ffcc80';
        case 'down':
        case 'offline':
            return '#ff8a80';
        default:
            return 'rgba(255,255,255,0.72)';
    }
}

function detailColor(level: LinkLevel): string {
    switch (level) {
        case 'excellent':
        case 'good':
            return '#2e7d32';
        case 'fair':
            return '#f9a825';
        case 'weak':
            return '#ef6c00';
        case 'down':
        case 'offline':
            return '#c62828';
        default:
            return '#616161';
    }
}

function SignalBars({bars, color, pulse}: {bars: number; color: string; pulse: boolean}) {
    const heights = [5, 9, 13, 17];
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                animation: pulse ? 'linkPulse 1.4s ease-in-out infinite' : 'none',
                '@keyframes linkPulse': {'0%, 100%': {opacity: 1}, '50%': {opacity: 0.35}},
            }}
        >
            <svg width="22" height="18" viewBox="0 0 22 18" aria-hidden="true">
                {heights.map((height, index) => (
                    <rect
                        key={height}
                        x={1 + index * 5.5}
                        y={18 - height}
                        width="3.5"
                        height={height}
                        rx="0.7"
                        fill={color}
                        opacity={index < bars ? 1 : 0.28}
                    />
                ))}
            </svg>
        </Box>
    );
}

function clock(at: number | null): string {
    if (!at) return '';
    const date = new Date(at);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function shortLabel(level: LinkLevel, rtt: number | null): string {
    if (level === 'checking') return '…';
    if (level === 'offline') return tPos('link.offline');
    if (level === 'down') return tPos('link.down_short');
    if (rtt == null) return '—';
    return `${rtt}ms`;
}

export function LinkSignal() {
    const link = useLinkQuality();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const color = signalColor(link.level);
    const pulse = link.level === 'offline' || link.level === 'down';
    const levelText = tPos(`link.${link.level}`);

    return (
        <>
            <ButtonBase
                onClick={(event) => setAnchor(event.currentTarget)}
                aria-label={`${tPos('link.title')} ${levelText}`}
                sx={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    height: 28,
                    px: 0.75,
                    borderRadius: 999,
                    bgcolor: 'rgba(0,0,0,0.45)',
                    color: '#fff',
                }}
            >
                <SignalBars bars={barsFor(link.level)} color={color} pulse={pulse} />
                <Box component="span" sx={{fontSize: 12, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1, minWidth: 28, textAlign: 'left'}}>
                    {shortLabel(link.level, link.rtt)}
                </Box>
            </ButtonBase>
            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{sx: {p: 2, width: 280, maxWidth: 'calc(100vw - 24px)'}}}
            >
                <Typography variant="subtitle1" fontWeight={700}>{tPos('link.title')}</Typography>
                <Typography variant="body1" sx={{mt: 0.5, color: detailColor(link.level)}}>{levelText}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                    {link.rtt == null ? tPos('link.no_rtt') : tPos('link.latency', {ms: link.rtt})}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {link.okAt ? tPos('link.last_ok', {time: clock(link.okAt)}) : tPos('link.never')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{display: 'block', mt: 1.25}}>
                    {tPos('link.hint')}
                </Typography>
                <ButtonBase
                    onClick={() => link.recheck()}
                    sx={{mt: 1.5, px: 1.5, py: 0.75, borderRadius: 1, bgcolor: 'action.hover', fontSize: 14}}
                >
                    {tPos('link.recheck')}
                </ButtonBase>
            </Popover>
        </>
    );
}
