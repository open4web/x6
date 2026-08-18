import React, {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import GradingIcon from '@mui/icons-material/Grading';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {OrderFlyEvent, OrderFlyKind} from '../../../dataProvider/MyCartProvider';

type Props = {
    event: OrderFlyEvent | null;
    targetEl: HTMLElement | null;
    onArrived?: (orderNo: string, kind: OrderFlyKind) => void;
};

function resolveEnd(event: OrderFlyEvent, targetEl: HTMLElement | null) {
    if (typeof event.endX === 'number' && typeof event.endY === 'number') {
        return {x: event.endX, y: event.endY};
    }
    const kind = event.kind || 'paid';
    const selector = kind === 'hold' ? '[data-fly-target="hold"]' : kind === 'resume' ? '[data-fly-target="cart"]' : '';
    const el = selector ? (document.querySelector(selector) as HTMLElement | null) : targetEl;
    const rect = el?.getBoundingClientRect();
    if (rect) {
        return {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
    }
    if (kind === 'hold') {
        return {x: 40, y: 160};
    }
    if (kind === 'resume') {
        return {x: window.innerWidth - 48, y: window.innerHeight - 172};
    }
    return {
        x: (targetEl?.getBoundingClientRect().left ?? window.innerWidth - 56) + 28,
        y: (targetEl?.getBoundingClientRect().top ?? window.innerHeight - 108) + 28,
    };
}

const flyTheme: Record<OrderFlyKind, {bg: string; color: string; border: string}> = {
    paid: {bg: '#fff8e1', color: '#e65100', border: '#ff9800'},
    hold: {bg: '#e3f2fd', color: '#1565c0', border: '#42a5f5'},
    resume: {bg: '#e8f5e9', color: '#2e7d32', border: '#66bb6a'},
};

function quad(p0: number, p1: number, p2: number, t: number) {
    const u = 1 - t;
    return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

const playedFlyIds = new Set<number>();

export default function OrderFlyOverlay({event, targetEl, onArrived}: Props) {
    const [pos, setPos] = useState<{x: number; y: number; scale: number; visible: boolean}>({
        x: 0,
        y: 0,
        scale: 1,
        visible: false,
    });

    useEffect(() => {
        if (!event || playedFlyIds.has(event.id)) {
            return;
        }
        playedFlyIds.add(event.id);

        const end = resolveEnd(event, targetEl);
        const endX = end.x;
        const endY = end.y;
        const startX = event.startX;
        const startY = event.startY;
        const midX = (startX + endX) / 2;
        const midY = Math.min(startY, endY) - 140;

        let frame = 0;
        const duration = 780;
        const startedAt = performance.now();
        setPos({x: startX, y: startY, scale: 1, visible: true});

        const tick = (now: number) => {
            const t = Math.min(1, (now - startedAt) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setPos({
                x: quad(startX, midX, endX, eased),
                y: quad(startY, midY, endY, eased),
                scale: 1 - 0.72 * eased,
                visible: t < 1,
            });
            if (t < 1) {
                frame = requestAnimationFrame(tick);
            } else {
                onArrived?.(event.orderNo, event.kind || 'paid');
            }
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
        // Only restart when a new fly is triggered.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event?.id]);

    if (!event || !pos.visible) {
        return null;
    }

    const kind = event.kind || 'paid';
    const theme = flyTheme[kind];
    const label = event.orderNo ? `#${event.orderNo.slice(-6)}` : '#';
    const Icon = kind === 'hold' ? PauseCircleOutlineIcon : kind === 'resume' ? ShoppingCartIcon : GradingIcon;

    return (
        <Box
            sx={{
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 2000,
                pointerEvents: 'none',
                transform: `translate(${pos.x - 52}px, ${pos.y - 22}px) scale(${pos.scale})`,
                transformOrigin: 'center center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.25,
                    py: 0.75,
                    bgcolor: theme.bg,
                    color: theme.color,
                    border: `2px solid ${theme.border}`,
                    borderRadius: 1.5,
                    boxShadow: '0 8px 22px rgba(0,0,0,0.28)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                }}
            >
                <Icon fontSize="small" />
                {label}
            </Box>
        </Box>
    );
}
