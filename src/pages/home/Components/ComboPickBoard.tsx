import * as React from 'react';
import {Box, Button, Grid, Typography, useTheme} from '@mui/material';
import MyCard from '../MyCard';
import {ProductItem} from './Type';
import {ComboOffer, comboListPrice} from '../../../utils/comboMatch';
import {findCachedProduct, lookupProductUnitPrice, useCatalogTick} from '../../../utils/catalogCache';
import {productCardGridXs, useProductCardStyle} from '../../../layout/productCardStyle';
import {useCartContext} from '../../../dataProvider/MyCartProvider';
import {tPos} from '../../../i18n/t';

type Props = {
    offer: ComboOffer;
    products: ProductItem[];
    handleClick: (item: any) => void;
    kindName: string;
    kindColor: string;
    clearCartSignal: boolean;
    onBack: () => void;
};

export default function ComboPickBoard({
    offer,
    products,
    handleClick,
    kindName,
    kindColor,
    clearCartSignal,
    onBack,
}: Props) {
    const {merchantId, cartItems} = useCartContext();
    const [cardStyle] = useProductCardStyle();
    const dark = useTheme().palette.mode === 'dark';
    useCatalogTick();
    const money = comboListPrice(offer, id => lookupProductUnitPrice(merchantId, id));
    const productMap = React.useMemo(
        () => Object.fromEntries(products.map(item => [item.id, item])),
        [products],
    );
    const qtyById = React.useMemo(() => {
        const qty: Record<string, number> = {};
        cartItems.forEach(item => {
            qty[item.id] = (qty[item.id] || 0) + (item.quantity || 0);
        });
        return qty;
    }, [cartItems]);

    const slots = offer.combo.map((slot, index) => {
        const items = (slot.products || [])
            .map(id => productMap[id] || findCachedProduct(merchantId, id))
            .filter((item): item is ProductItem => !!item);
        const selected = (slot.products || []).reduce((sum, id) => sum + (qtyById[id] || 0), 0);
        return {
            key: `${slot.combName || 'slot'}-${index}`,
            title: slot.combName || tPos('combo.title'),
            need: Math.max(1, Number(slot.requires) || 1),
            selected,
            items,
        };
    });

    return (
        <Box>
            <Box
                sx={{
                    mx: 1,
                    mb: 2,
                    p: 1.75,
                    borderRadius: 2,
                    bgcolor: dark ? '#3e2723' : '#fff8e1',
                    border: '1px solid',
                    borderColor: dark ? '#6d4c41' : '#ffe0b2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                <Box sx={{minWidth: 0}}>
                    <Typography sx={{fontWeight: 800, fontSize: 18, color: dark ? '#fff3e0' : '#3e2723'}}>
                        {offer.name}
                    </Typography>
                    <Typography variant="body2" sx={{color: dark ? '#ffcc80' : '#6d4c41'}}>
                        {tPos('combo.pick_hint')}
                    </Typography>
                </Box>
                <Box sx={{textAlign: 'right'}}>
                    <Box sx={{display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1}}>
                        {money.discount > 0 && (
                            <Typography sx={{color: dark ? '#bcaaa4' : '#8d6e63', textDecoration: 'line-through', fontSize: 16}}>
                                ¥{money.original.toFixed(2)}
                            </Typography>
                        )}
                        <Typography sx={{fontWeight: 900, fontSize: 32, color: dark ? '#ff8a80' : '#d32f2f', lineHeight: 1}}>
                            ¥{money.price.toFixed(2)}
                        </Typography>
                    </Box>
                    {money.discount > 0 && (
                        <Typography sx={{fontWeight: 700, color: dark ? '#a5d6a7' : '#2e7d32'}}>
                            {tPos('combo.save', {amount: money.discount.toFixed(2)})}
                        </Typography>
                    )}
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={onBack}
                        sx={{
                            mt: 0.5,
                            fontWeight: 700,
                            color: dark ? '#ffe0b2' : '#4e342e',
                            borderColor: dark ? '#ffcc80' : '#bf360c',
                            bgcolor: dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.7)',
                            '&:hover': {
                                borderColor: dark ? '#ffe0b2' : '#e65100',
                                bgcolor: dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)',
                            },
                        }}
                    >
                        {tPos('combo.back')}
                    </Button>
                </Box>
            </Box>

            {slots.map(slot => (
                <Box key={slot.key} sx={{mb: 2}}>
                    <Box sx={{px: 1, mb: 1, display: 'flex', alignItems: 'baseline', gap: 1}}>
                        <Typography sx={{fontWeight: 800, fontSize: 16}}>{slot.title}</Typography>
                        <Typography sx={{fontSize: 13, color: slot.selected >= slot.need ? '#2e7d32' : 'text.secondary'}}>
                            {tPos('combo.pick_n', {count: slot.need})} · {slot.selected}/{slot.need}
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {slot.items.map(item => (
                            <Grid item xs={productCardGridXs(cardStyle, false)} key={`${slot.key}-${item.id}`}>
                                <MyCard
                                    item={{...item, combPrice: 0}}
                                    handleClick={handleClick}
                                    kindName={kindName}
                                    combID={offer.id}
                                    kindColor={kindColor}
                                    clearCartSignal={clearCartSignal}
                                    combIndex="0"
                                    combPrice={0}
                                    combRequestItems={[]}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}
        </Box>
    );
}
