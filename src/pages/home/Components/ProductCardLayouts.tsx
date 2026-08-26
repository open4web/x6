import * as React from 'react';
import {Box, Typography, Badge, Card, CardHeader, CardActions, Avatar, IconButton} from '@mui/material';
import {styled} from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {ProductItem} from './Type';
import {PropertyIconView} from './PropertyIcons';
import {ProductCardStyle} from '../../../layout/productCardStyle';

const ExpandMore = styled((props: {expand: boolean} & React.ComponentProps<typeof IconButton>) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export type CardFaceProps = {
    item: ProductItem;
    kindName: string;
    kindColor: string;
    backgroundColor?: string;
    showProductImage: boolean;
    cartCount: number;
    stockLabel: string;
    soldOut: boolean;
    onAdd: () => void;
    onExpand: () => void;
    expanded: boolean;
};

function StockBadge({soldOut, label, compact}: {soldOut: boolean; label: string; compact?: boolean}) {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: soldOut ? '#d32f2f' : '#fbc02d',
                color: soldOut ? '#fff' : '#000',
                px: compact ? 0.5 : 0.75,
                py: 0.2,
                borderRadius: '4px 0 4px 0',
                fontSize: compact ? '0.62rem' : '0.7rem',
                fontWeight: 700,
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
                zIndex: 2,
                pointerEvents: 'none',
                maxWidth: '72%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}
        >
            {label}
        </Box>
    );
}

function CartCount({count}: {count: number}) {
    if (!count) {
        return null;
    }
    return (
        <Badge
            badgeContent={count}
            color="error"
            sx={{
                position: 'absolute',
                top: 13,
                right: 13,
                zIndex: 2,
                '.MuiBadge-badge': {fontSize: '0.8rem', height: 20, minWidth: 20},
            }}
        />
    );
}

function PriceBlock({item, size = 'md'}: {item: ProductItem; size?: 'sm' | 'md' | 'lg'}) {
    const priceSize = size === 'lg' ? '1.35rem' : size === 'sm' ? '1rem' : '1.2rem';
    const originSize = size === 'sm' ? '0.7rem' : '0.8rem';
    const unitPrice = Number(item.origin_price) > 0 ? Number(item.origin_price) : Number(item.price) || 0;
    if (item.combPrice !== 0) {
        return (
            <Box>
                <Typography sx={{fontSize: originSize, textDecoration: 'line-through', color: 'text.secondary'}} noWrap>
                    ¥{unitPrice}
                </Typography>
                <Typography sx={{fontSize: priceSize, fontWeight: 'bold', color: 'darkorange'}} noWrap>
                    ¥{item?.combPrice}
                </Typography>
            </Box>
        );
    }
    return (
        <Typography sx={{fontSize: priceSize, fontWeight: 'bold', color: 'darkorange'}} noWrap>
            ¥{unitPrice}
        </Typography>
    );
}

function NameText({name, lines = 2, fontSize = '1.05rem'}: {name: string; lines?: number; fontSize?: string}) {
    return (
        <Typography
            sx={{
                fontSize,
                fontWeight: 700,
                display: '-webkit-box',
                WebkitLineClamp: lines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.35,
            }}
        >
            {name}
        </Typography>
    );
}

function PropRow({item, expanded, onExpand}: {item: ProductItem; expanded: boolean; onExpand: () => void}) {
    if (!item.spiceOptions?.length) {
        return <Box sx={{height: 8}} />;
    }
    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, px: 0.5, pb: 0.5, minHeight: 36}}>
            {item.spiceOptions.map((option) => (
                <Box
                    key={option.id}
                    title={option.name}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 26,
                        height: 26,
                        borderRadius: 1,
                        bgcolor: 'rgba(255,255,255,0.12)',
                        flexShrink: 0,
                    }}
                >
                    <PropertyIconView icon={option.icon} size={16} />
                </Box>
            ))}
            <ExpandMore expand={expanded} onClick={onExpand} aria-expanded={expanded} aria-label="show more">
                <ExpandMoreIcon />
            </ExpandMore>
        </Box>
    );
}

function Media({
    item,
    kindName,
    kindColor,
    showProductImage,
    height,
    square,
}: {
    item: ProductItem;
    kindName: string;
    kindColor: string;
    showProductImage: boolean;
    height?: number;
    square?: boolean;
}) {
    const usePhoto = !showProductImage && !!item.img;
    return (
        <Box
            sx={{
                width: square ? '100%' : '100%',
                height: square ? 'auto' : height || 110,
                aspectRatio: square ? '1 / 1' : undefined,
                bgcolor: kindColor,
                backgroundImage: usePhoto ? `url(${item.img})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: 1,
            }}
        >
            {!usePhoto && kindName}
        </Box>
    );
}

function shellSx(soldOut: boolean, clickable: boolean, extra?: object) {
    return {
        width: '100%',
        position: 'relative' as const,
        cursor: clickable ? 'pointer' : 'default',
        opacity: soldOut ? 0.72 : 1,
        overflow: 'hidden',
        ...extra,
    };
}

function ClassicCard(props: CardFaceProps) {
    const {item, kindName, kindColor, backgroundColor, showProductImage, cartCount, stockLabel, soldOut, onAdd, onExpand, expanded} = props;
    return (
        <Card sx={shellSx(soldOut, !showProductImage, {maxWidth: 220, margin: 1, backgroundColor: backgroundColor || 'inherit'})}>
            <StockBadge soldOut={soldOut} label={stockLabel} />
            {!showProductImage && <CartCount count={cartCount} />}
            <CardHeader
                sx={{pt: 3.5}}
                avatar={
                    showProductImage ? (
                        <Avatar sx={{bgcolor: kindColor}}>{kindName}</Avatar>
                    ) : (
                        <Avatar sx={{bgcolor: kindColor}} src={item.img} />
                    )
                }
                title={
                    <Typography
                        sx={{
                            fontSize: showProductImage ? '1rem' : '1.2rem',
                            fontWeight: showProductImage ? 'normal' : 'bold',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: '1.5rem',
                            height: '3rem',
                        }}
                    >
                        {item?.name}
                    </Typography>
                }
                subheader={<PriceBlock item={item} />}
                onClick={!showProductImage ? onAdd : undefined}
            />
            <CardActions disableSpacing sx={{height: item.spiceOptions?.length > 0 ? 'auto' : 53}}>
                <PropRow item={item} expanded={expanded} onExpand={onExpand} />
            </CardActions>
        </Card>
    );
}

function PosterCard(props: CardFaceProps) {
    const {item, kindName, kindColor, showProductImage, cartCount, stockLabel, soldOut, onAdd, onExpand, expanded} = props;
    return (
        <Card sx={shellSx(soldOut, !showProductImage, {m: 1})} onClick={!showProductImage ? onAdd : undefined}>
            <StockBadge soldOut={soldOut} label={stockLabel} />
            {!showProductImage && <CartCount count={cartCount} />}
            <Media item={item} kindName={kindName} kindColor={kindColor} showProductImage={showProductImage} height={120} />
            <Box sx={{px: 1.25, pt: 1}}>
                <NameText name={item.name} />
                <Box sx={{mt: 0.5}}>
                    <PriceBlock item={item} />
                </Box>
            </Box>
            <Box onClick={(event) => event.stopPropagation()}>
                <PropRow item={item} expanded={expanded} onExpand={onExpand} />
            </Box>
        </Card>
    );
}

function CompactCard(props: CardFaceProps) {
    const {item, kindName, kindColor, showProductImage, cartCount, stockLabel, soldOut, onAdd, onExpand, expanded} = props;
    const usePhoto = !showProductImage && !!item.img;
    return (
        <Card sx={shellSx(soldOut, !showProductImage, {m: 1})} onClick={!showProductImage ? onAdd : undefined}>
            <StockBadge soldOut={soldOut} label={stockLabel} compact />
            {!showProductImage && <CartCount count={cartCount} />}
            <Box sx={{display: 'flex', alignItems: 'stretch', pt: 2.25, minHeight: 92}}>
                <Box
                    sx={{
                        width: 72,
                        flexShrink: 0,
                        bgcolor: kindColor,
                        backgroundImage: usePhoto ? `url(${item.img})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                    }}
                >
                    {!usePhoto && kindName}
                </Box>
                <Box sx={{flex: 1, minWidth: 0, px: 1.25, py: 0.75, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <NameText name={item.name} fontSize="0.95rem" />
                    <Box sx={{mt: 0.4}}>
                        <PriceBlock item={item} size="sm" />
                    </Box>
                </Box>
            </Box>
            <Box onClick={(event) => event.stopPropagation()}>
                <PropRow item={item} expanded={expanded} onExpand={onExpand} />
            </Box>
        </Card>
    );
}

function TileCard(props: CardFaceProps) {
    const {item, kindName, kindColor, showProductImage, cartCount, stockLabel, soldOut, onAdd, onExpand, expanded} = props;
    return (
        <Card sx={shellSx(soldOut, !showProductImage, {m: 1})} onClick={!showProductImage ? onAdd : undefined}>
            <Box sx={{position: 'relative'}}>
                <Media item={item} kindName={kindName} kindColor={kindColor} showProductImage={showProductImage} square />
                <StockBadge soldOut={soldOut} label={stockLabel} />
                {!showProductImage && <CartCount count={cartCount} />}
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        p: 1,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 70%)',
                        color: '#fff',
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {item.name}
                    </Typography>
                    <Box sx={{'& .MuiTypography-root': {color: '#ffcc80'}}}>
                        <PriceBlock item={item} size="sm" />
                    </Box>
                </Box>
            </Box>
            <Box onClick={(event) => event.stopPropagation()} sx={{bgcolor: 'background.paper'}}>
                <PropRow item={item} expanded={expanded} onExpand={onExpand} />
            </Box>
        </Card>
    );
}

function BoardCard(props: CardFaceProps) {
    const {item, kindName, kindColor, showProductImage, cartCount, stockLabel, soldOut, onAdd, onExpand, expanded} = props;
    const usePhoto = !showProductImage && !!item.img;
    return (
        <Card sx={shellSx(soldOut, !showProductImage, {m: 1, display: 'flex'})} onClick={!showProductImage ? onAdd : undefined}>
            <Box sx={{width: 8, bgcolor: kindColor, flexShrink: 0}} />
            <Box sx={{flex: 1, minWidth: 0, position: 'relative', p: 1.25}}>
                <StockBadge soldOut={soldOut} label={stockLabel} compact />
                {!showProductImage && <CartCount count={cartCount} />}
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, pt: 1.75}}>
                    <Avatar src={usePhoto ? item.img : undefined} sx={{bgcolor: kindColor, width: 36, height: 36}}>
                        {kindName?.[0]}
                    </Avatar>
                    <Box sx={{flex: 1, minWidth: 0}}>
                        <NameText name={item.name} lines={1} fontSize="1rem" />
                    </Box>
                    <PriceBlock item={item} size="sm" />
                </Box>
                <Box onClick={(event) => event.stopPropagation()}>
                    <PropRow item={item} expanded={expanded} onExpand={onExpand} />
                </Box>
            </Box>
        </Card>
    );
}

function TicketCard(props: CardFaceProps) {
    const {item, kindName, kindColor, showProductImage, cartCount, stockLabel, soldOut, onAdd, onExpand, expanded} = props;
    return (
        <Card
            sx={shellSx(soldOut, !showProductImage, {
                m: 1,
                border: '1px dashed',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            })}
            onClick={!showProductImage ? onAdd : undefined}
        >
            <StockBadge soldOut={soldOut} label={stockLabel} />
            {!showProductImage && <CartCount count={cartCount} />}
            <Box sx={{px: 1.25, pt: 2.75, pb: 0.5, textAlign: 'center'}}>
                <NameText name={item.name} fontSize="1rem" />
                <Box sx={{my: 0.75, display: 'flex', justifyContent: 'center'}}>
                    <Media
                        item={item}
                        kindName={kindName}
                        kindColor={kindColor}
                        showProductImage={showProductImage}
                        height={72}
                    />
                </Box>
                <PriceBlock item={item} size="lg" />
            </Box>
            <Box onClick={(event) => event.stopPropagation()}>
                <PropRow item={item} expanded={expanded} onExpand={onExpand} />
            </Box>
        </Card>
    );
}

export function ProductCardFace(props: CardFaceProps & {styleName: ProductCardStyle}) {
    switch (props.styleName) {
        case 'poster':
            return <PosterCard {...props} />;
        case 'compact':
            return <CompactCard {...props} />;
        case 'tile':
            return <TileCard {...props} />;
        case 'board':
            return <BoardCard {...props} />;
        case 'ticket':
            return <TicketCard {...props} />;
        case 'classic':
        default:
            return <ClassicCard {...props} />;
    }
}


