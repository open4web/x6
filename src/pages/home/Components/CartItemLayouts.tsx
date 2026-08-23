import * as React from 'react';
import {
    Avatar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {CartItem} from '../../../common/types';
import {CartStyle} from '../../../layout/cartStyle';

type LineHandlers = {
    onInc: (item: CartItem) => void;
    onDec: (item: CartItem) => void;
    onRemove: (item: CartItem) => void;
};

function QtyStepper({item, onInc, onDec, compact}: {item: CartItem; onInc: () => void; onDec: () => void; compact?: boolean}) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: compact ? 0 : 0.25}}>
            <IconButton onClick={onDec} size="small">
                <RemoveIcon fontSize={compact ? 'small' : 'medium'} />
            </IconButton>
            <Typography sx={{minWidth: compact ? 18 : 24, textAlign: 'center', fontWeight: 700, fontSize: compact ? 13 : 15}}>
                {item.quantity}
            </Typography>
            <IconButton onClick={onInc} size="small">
                <AddCircleIcon fontSize={compact ? 'small' : 'medium'} />
            </IconButton>
        </Box>
    );
}

function KindLabel({item}: {item: CartItem}) {
    const label = item.combName || item.kindName;
    if (!label) {
        return null;
    }
    return (
        <Typography variant="caption" sx={{fontWeight: 700, color: item.combName ? '#d32f2f' : 'gray', display: 'block', lineHeight: 1.2}}>
            {label}
        </Typography>
    );
}

function ClassicLines({items, onInc, onDec, onRemove}: {items: CartItem[]} & LineHandlers) {
    return (
        <List>
            {items.map(item => (
                <ListItem key={`${item.id}-${item.desc}`} sx={{display: 'flex', alignItems: 'center', pr: 6}}>
                    <ListItemText
                        primary={
                            <Box>
                                <KindLabel item={item} />
                                <Typography variant="body1">{item.name}</Typography>
                            </Box>
                        }
                        secondary={item.desc}
                    />
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <QtyStepper item={item} onInc={() => onInc(item)} onDec={() => onDec(item)} />
                        <Typography variant="h6" sx={{fontWeight: 'bold', color: 'darkorange', fontFamily: 'monospace', minWidth: 60, textAlign: 'right'}}>
                            {item.price.toFixed(2)}
                        </Typography>
                    </Box>
                    <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => onRemove(item)}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
}

function TicketLines({items, onInc, onDec, onRemove}: {items: CartItem[]} & LineHandlers) {
    return (
        <Box sx={{px: 1.5, py: 0.5, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'}}>
            {items.map(item => (
                <Box key={`${item.id}-${item.desc}`} sx={{borderBottom: '1px dashed #d7ccc8', py: 0.75}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 1}}>
                        <Box sx={{minWidth: 0}}>
                            <KindLabel item={item} />
                            <Typography noWrap sx={{fontWeight: 700, fontSize: 14}}>{item.name}</Typography>
                            {item.desc && <Typography variant="caption" color="text.secondary" noWrap>{item.desc}</Typography>}
                        </Box>
                        <Typography sx={{fontWeight: 800, color: '#d32f2f', flexShrink: 0}}>
                            ¥{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <QtyStepper item={item} onInc={() => onInc(item)} onDec={() => onDec(item)} compact />
                        <IconButton size="small" onClick={() => onRemove(item)}>
                            <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

function DenseLines({items, onInc, onDec, onRemove}: {items: CartItem[]} & LineHandlers) {
    return (
        <Box>
            {items.map(item => (
                <Box key={`${item.id}-${item.desc}`} sx={{display: 'flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.5, borderBottom: '1px solid', borderColor: 'divider'}}>
                    <Box sx={{flex: 1, minWidth: 0}}>
                        <Typography noWrap sx={{fontWeight: 700, fontSize: 13}}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>{item.combName || item.desc || item.kindName}</Typography>
                    </Box>
                    <QtyStepper item={item} onInc={() => onInc(item)} onDec={() => onDec(item)} compact />
                    <Typography sx={{fontWeight: 800, color: 'darkorange', minWidth: 48, textAlign: 'right', fontSize: 13}}>
                        {item.price.toFixed(2)}
                    </Typography>
                    <IconButton size="small" onClick={() => onRemove(item)}>
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
}

function TileLines({items, onInc, onDec, onRemove}: {items: CartItem[]} & LineHandlers) {
    return (
        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, p: 1}}>
            {items.map(item => (
                <Box key={`${item.id}-${item.desc}`} sx={{border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1, position: 'relative', bgcolor: 'background.paper'}}>
                    <IconButton size="small" onClick={() => onRemove(item)} sx={{position: 'absolute', top: 0, right: 0}}>
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                    <Box sx={{display: 'flex', gap: 0.75, mb: 0.5}}>
                        <Avatar sx={{width: 36, height: 36, bgcolor: 'primary.light', fontSize: 16}}>
                            {(item.name || '?').slice(0, 1)}
                        </Avatar>
                        <Box sx={{minWidth: 0}}>
                            <KindLabel item={item} />
                            <Typography sx={{fontWeight: 700, fontSize: 13, lineHeight: 1.2}} noWrap>{item.name}</Typography>
                        </Box>
                    </Box>
                    {item.desc && <Typography variant="caption" color="text.secondary" noWrap sx={{display: 'block', mb: 0.5}}>{item.desc}</Typography>}
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <QtyStepper item={item} onInc={() => onInc(item)} onDec={() => onDec(item)} compact />
                        <Typography sx={{fontWeight: 800, color: '#d32f2f'}}>¥{item.price.toFixed(2)}</Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

function BoardLines({items, onInc, onDec, onRemove}: {items: CartItem[]} & LineHandlers) {
    return (
        <Box sx={{p: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
            {items.map(item => (
                <Box key={`${item.id}-${item.desc}`} sx={{display: 'flex', gap: 1, alignItems: 'center', bgcolor: '#fff8f1', borderRadius: 1.5, p: 1}}>
                    <Box sx={{width: 44, height: 44, borderRadius: 1, bgcolor: '#efebe9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#5d4037'}}>
                        {item.quantity}
                    </Box>
                    <Box sx={{flex: 1, minWidth: 0}}>
                        <KindLabel item={item} />
                        <Typography noWrap sx={{fontWeight: 700}}>{item.name}</Typography>
                        {item.desc && <Typography variant="caption" color="text.secondary" noWrap>{item.desc}</Typography>}
                    </Box>
                    <Box sx={{textAlign: 'right'}}>
                        <Typography sx={{fontWeight: 800, color: '#d32f2f'}}>¥{(item.price * item.quantity).toFixed(2)}</Typography>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <QtyStepper item={item} onInc={() => onInc(item)} onDec={() => onDec(item)} compact />
                            <IconButton size="small" onClick={() => onRemove(item)}>
                                <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

function DockLines({items, onInc, onDec, onRemove}: {items: CartItem[]} & LineHandlers) {
    return (
        <Box sx={{px: 1, py: 0.5}}>
            {items.map(item => (
                <Box key={`${item.id}-${item.desc}`} sx={{display: 'flex', alignItems: 'center', gap: 1, py: 0.75}}>
                    <Box sx={{px: 0.9, py: 0.2, borderRadius: 8, bgcolor: 'primary.main', color: '#fff', fontWeight: 800, fontSize: 12, minWidth: 28, textAlign: 'center'}}>
                        {item.quantity}
                    </Box>
                    <Box sx={{flex: 1, minWidth: 0}}>
                        <Typography noWrap sx={{fontWeight: 700, fontSize: 14}}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>{item.desc || item.combName || item.kindName}</Typography>
                    </Box>
                    <Typography sx={{fontWeight: 800, color: 'darkorange', minWidth: 52, textAlign: 'right'}}>
                        ¥{item.price.toFixed(2)}
                    </Typography>
                    <QtyStepper item={item} onInc={() => onInc(item)} onDec={() => onDec(item)} compact />
                    <IconButton size="small" onClick={() => onRemove(item)}>
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
}

export function CartItemList({items, styleName, onInc, onDec, onRemove}: {items: CartItem[]; styleName: CartStyle} & LineHandlers) {
    if (items.length === 0) {
        return null;
    }
    switch (styleName) {
        case 'ticket':
            return <TicketLines items={items} onInc={onInc} onDec={onDec} onRemove={onRemove} />;
        case 'dense':
            return <DenseLines items={items} onInc={onInc} onDec={onDec} onRemove={onRemove} />;
        case 'tile':
            return <TileLines items={items} onInc={onInc} onDec={onDec} onRemove={onRemove} />;
        case 'board':
            return <BoardLines items={items} onInc={onInc} onDec={onDec} onRemove={onRemove} />;
        case 'dock':
            return <DockLines items={items} onInc={onInc} onDec={onDec} onRemove={onRemove} />;
        case 'classic':
        default:
            return <ClassicLines items={items} onInc={onInc} onDec={onDec} onRemove={onRemove} />;
    }
}
