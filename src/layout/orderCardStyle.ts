import {useStore} from 'react-admin';

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
