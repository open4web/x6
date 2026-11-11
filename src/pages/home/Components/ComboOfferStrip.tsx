import * as React from 'react';
import {Box, Typography} from '@mui/material';
import {ComboGroup} from '../types';
import {comboListPrice, comboSlotSummary, normalizeComboOffers} from '../../../utils/comboMatch';
import {lookupProductUnitPrice, useCatalogTick} from '../../../utils/catalogCache';
import {tPos} from '../../../i18n/t';

type Props = {
    combos: ComboGroup[];
    merchantId: string;
    selectedId: string;
    onSelect: (id: string) => void;
};

export default function ComboOfferStrip({combos, merchantId, selectedId, onSelect}: Props) {
    const catalogTick = useCatalogTick();
    const offers = React.useMemo(
        () => normalizeComboOffers(combos).filter(offer => Number(offer.price) > 0 || offer.combo.length > 0),
        [combos, catalogTick],
    );
    if (!offers.length) {
        return null;
    }

    return (
        <Box sx={{mb: 1.5}}>
            <Typography sx={{px: 1, mb: 0.75, fontWeight: 800, fontSize: 14, letterSpacing: 0.4}}>
                {tPos('combo.title')}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    px: 1,
                    pb: 1,
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {offers.map(offer => {
                    const money = comboListPrice(offer, id => lookupProductUnitPrice(merchantId, id));
                    const selected = selectedId === offer.id;
                    const summary = comboSlotSummary(offer);
                    return (
                        <Box
                            key={offer.id}
                            role="button"
                            onClick={() => onSelect(offer.id)}
                            sx={{
                                flex: '0 0 auto',
                                minWidth: 196,
                                maxWidth: 260,
                                px: 1.5,
                                py: 1.25,
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: selected ? 'error.main' : 'divider',
                                bgcolor: selected ? 'rgba(211,47,47,0.08)' : 'background.paper',
                                cursor: 'pointer',
                                userSelect: 'none',
                                WebkitTapHighlightColor: 'transparent',
                                boxShadow: selected ? '0 6px 16px rgba(211,47,47,0.18)' : 'none',
                                '&:active': {transform: 'scale(0.98)'},
                            }}
                        >
                            <Typography noWrap sx={{fontWeight: 800, fontSize: 15, lineHeight: 1.25}}>
                                {offer.name}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'baseline', gap: 0.75, mt: 0.4}}>
                                <Typography sx={{fontWeight: 900, fontSize: 26, color: '#d32f2f', lineHeight: 1.1}}>
                                    ¥{money.price.toFixed(2)}
                                </Typography>
                                {money.discount > 0 && (
                                    <Typography sx={{fontSize: 12, color: 'text.secondary', textDecoration: 'line-through'}}>
                                        ¥{money.original.toFixed(2)}
                                    </Typography>
                                )}
                            </Box>
                            {money.discount > 0 && (
                                <Typography sx={{mt: 0.25, fontSize: 12, fontWeight: 700, color: '#2e7d32'}}>
                                    {tPos('combo.save', {amount: money.discount.toFixed(2)})}
                                </Typography>
                            )}
                            {summary ? (
                                <Typography noWrap sx={{mt: 0.5, fontSize: 12, color: 'text.secondary'}}>
                                    {summary}
                                </Typography>
                            ) : null}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
