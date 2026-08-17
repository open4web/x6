import {useStore} from 'react-admin';

export const PRODUCT_CARD_STYLES = ['classic', 'poster', 'compact', 'tile', 'board', 'ticket'] as const;
export type ProductCardStyle = typeof PRODUCT_CARD_STYLES[number];

export function useProductCardStyle() {
    return useStore<ProductCardStyle>('productCardStyle', 'classic');
}

export function productCardGridXs(style: ProductCardStyle, showProductImage: boolean): number {
    switch (style) {
        case 'compact':
        case 'board':
            return 3;
        case 'poster':
        case 'tile':
        case 'ticket':
            return 2.4;
        case 'classic':
        default:
            return showProductImage ? 2.4 : 1.714;
    }
}
