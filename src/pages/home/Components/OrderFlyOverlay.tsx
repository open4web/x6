import React, {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import GradingIcon from '@mui/icons-material/Grading';
import {OrderFlyEvent} from '../../../dataProvider/MyCartProvider';

type Props = {
    event: OrderFlyEvent | null;
    targetEl: HTMLElement | null;
    onArrived?: (orderNo: string) => void;
};

function quad(p0: number, p1: number, p2: number, t: number) {
    const u = 1 - t;
    return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

export default function OrderFlyOverlay({event, targetEl, onArrived}: Props) {
    const [pos, setPos] = useState<{x: number; y: number; scale: number; visible: boolean}>({
        x: 0,
        y: 0,
        scale: 1,
        visible: false,
    });

    useEffect(() => {
        if (!event) {
            return;
        }

        const target = targetEl?.getBoundingClientRect();
        const endX = (target?.left ?? window.innerWidth - 56) + (target?.width ?? 56) / 2;
        const endY = (target?.top ?? window.innerHeight - 108) + (target?.height ?? 56) / 2;
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
                onArrived?.(event.orderNo);
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

    const label = event.orderNo ? `#${event.orderNo.slice(-6)}` : '订单';

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
                    bgcolor: '#fff8e1',
                    color: '#e65100',
                    border: '2px solid #ff9800',
                    borderRadius: 1.5,
                    boxShadow: '0 8px 22px rgba(0,0,0,0.28)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                }}
            >
                <GradingIcon fontSize="small" />
                {label}
            </Box>
        </Box>
    );
}
