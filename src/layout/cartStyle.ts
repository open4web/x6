import {useStore} from 'react-admin';

export const CART_STYLES = ['classic', 'ticket', 'dense', 'tile', 'board', 'dock'] as const;
export type CartStyle = typeof CART_STYLES[number];

export function useCartStyle() {
    return useStore<CartStyle>('cartStyle', 'classic');
}

export function cartPanelWidth(style: CartStyle): number {
    switch (style) {
        case 'dense':
        case 'dock':
            return 360;
        case 'tile':
            return 420;
        case 'board':
            return 380;
        case 'ticket':
            return 360;
        case 'classic':
        default:
            return 400;
    }
}
