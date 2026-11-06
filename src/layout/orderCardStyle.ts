import {useStore} from 'react-admin';
import type {SxProps, Theme} from '@mui/material';

export const ORDER_CARD_STYLES = ['classic', 'ticket', 'kanban', 'queue', 'strip', 'ledger'] as const;
export type OrderCardStyle = typeof ORDER_CARD_STYLES[number];

export function useOrderCardStyle() {
    return useStore<OrderCardStyle>('orderCardStyle', 'classic');
}

export function orderCardWidth(style: OrderCardStyle): number {
    switch (style) {
        case 'queue':
            return 176;
        case 'strip':
            return 208;
        case 'ticket':
            return 236;
        case 'kanban':
            return 252;
        case 'ledger':
            return 280;
        case 'classic':
        default:
            return 300;
    }
}

/** 订单详情 Dialog Paper 随历史订单卡样式切换 */
export function orderDetailPaperSx(style: OrderCardStyle): SxProps<Theme> {
    switch (style) {
        case 'ticket':
            return {
                bgcolor: '#fffaf3',
                borderRadius: 0,
                border: '1px dashed #bcaaa4',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                backgroundImage:
                    'radial-gradient(circle at 8px 0, transparent 6px, #fffaf3 7px), radial-gradient(circle at 8px 100%, transparent 6px, #fffaf3 7px)',
                backgroundSize: '16px 100%',
                backgroundPosition: '-8px 0',
            };
        case 'kanban':
            return {
                bgcolor: '#fff',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                borderLeft: '8px solid #ef6c00',
                boxShadow: 2,
            };
        case 'queue':
            return {
                bgcolor: '#fff8e1',
                borderRadius: 2,
                border: '2px solid #ffa000',
                boxShadow: 4,
                '& .MuiDialogTitle-root': {
                    bgcolor: '#ffa000',
                    color: '#fff',
                    fontWeight: 900,
                    letterSpacing: 1,
                },
            };
        case 'strip':
            return {
                bgcolor: '#fafafa',
                borderRadius: 1,
                border: '1px solid #eeeeee',
                boxShadow: 1,
                '& .MuiDialogTitle-root': {
                    py: 1,
                    borderBottom: '1px solid #eee',
                },
                '& .MuiCard-root': {
                    boxShadow: 'none',
                    borderRadius: 0.5,
                },
            };
        case 'ledger':
            return {
                bgcolor: '#f5f5f0',
                borderRadius: 0,
                border: '1px solid #424242',
                '& .MuiDialogTitle-root': {
                    bgcolor: '#212121',
                    color: '#fff',
                    fontWeight: 800,
                },
                '& .MuiCard-root': {
                    borderColor: '#9e9e9e',
                    bgcolor: '#fffef8',
                },
            };
        case 'classic':
        default:
            return {
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 8,
            };
    }
}

export function orderDetailCardSx(style: OrderCardStyle): SxProps<Theme> {
    switch (style) {
        case 'ticket':
            return {borderStyle: 'dashed', borderColor: '#bcaaa4', bgcolor: '#fffdf8'};
        case 'kanban':
            return {borderLeft: '4px solid #ef6c00', bgcolor: '#fff'};
        case 'queue':
            return {bgcolor: '#fffde7', borderColor: '#ffe082'};
        case 'strip':
            return {bgcolor: '#fff', borderColor: '#e0e0e0'};
        case 'ledger':
            return {bgcolor: '#fffef8', borderColor: '#9e9e9e', borderRadius: 0};
        case 'classic':
        default:
            return {};
    }
}
