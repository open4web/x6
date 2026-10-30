import * as React from 'react';
import {Box, Button, Chip, Grid, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MyCard from '../MyCard';
import {ProductItem} from './Type';
import {productCardGridXs, useProductCardStyle} from '../../../layout/productCardStyle';
import {useCartContext} from '../../../dataProvider/MyCartProvider';
import {tPos} from '../../../i18n/t';

type Props = {
    transcript: string;
    products: ProductItem[];
    unmatched?: string[];
    source?: string;
    error?: string;
    handleClick: (item: any) => void;
    clearCartSignal: boolean;
    onClose: () => void;
};

export default function VoiceResultsPanel({
    transcript,
    products,
    unmatched,
    source,
    error,
    handleClick,
    clearCartSignal,
    onClose,
}: Props) {
    const {showProductImage} = useCartContext();
    const [cardStyle] = useProductCardStyle();

    return (
        <Box sx={{mb: 2, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)'}}>
            <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.5}}>
                <Box sx={{minWidth: 0}}>
                    <Typography variant="h6" sx={{fontWeight: 800}}>
                        {tPos('voice.results_title', {n: products.length})}
                    </Typography>
                    <Typography variant="body1" sx={{opacity: 0.9, wordBreak: 'break-word'}}>
                        {tPos('voice.heard', {text: transcript})}
                    </Typography>
                    <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.75}}>
                        {source ? <Chip size="small" label={tPos(source === 'ai' ? 'voice.source_ai' : 'voice.source_fallback')} /> : null}
                        {error ? <Chip size="small" color="warning" label={error} /> : null}
                        {(unmatched || []).map((u) => (
                            <Chip key={u} size="small" color="default" label={tPos('voice.unmatched', {text: u})} />
                        ))}
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    onClick={onClose}
                    sx={{minHeight: 48, flexShrink: 0}}
                >
                    {tPos('voice.close')}
                </Button>
            </Box>

            {products.length === 0 ? (
                <Typography sx={{py: 3, textAlign: 'center', opacity: 0.8}}>{tPos('voice.none')}</Typography>
            ) : (
                <Grid container spacing={2}>
                    {products.map((item) => (
                        <Grid item xs={productCardGridXs(cardStyle, showProductImage)} key={item.id}>
                            <MyCard
                                item={item}
                                handleClick={handleClick}
                                kindName={tPos('voice.kind')}
                                combID={item.kind || ''}
                                kindColor="#5c6bc0"
                                clearCartSignal={clearCartSignal}
                                backgroundColor="hsl(230, 40%, 36%)"
                                combIndex="0"
                                combPrice={0}
                                combRequestItems={[]}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
