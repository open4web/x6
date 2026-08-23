import * as React from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import SubscriptIcon from '@mui/icons-material/Subscript';
import {useTranslate} from 'react-admin';
import {FormatTimestampAsTime} from '../../../utils/time';
import {orderStatusMap} from '../../../common/orderStatus';
import {OrderCardStyle} from '../../../layout/orderCardStyle';
import {Bucket, Order} from './types';

export type OrderCardHandlers = {
    order: Order;
    highlighted: boolean;
    onPay: (order: Order) => void;
    onCancel: (order: Order) => void;
    onDetail: (order: Order) => void;
};

const statusBg = ['#ffe0b2', '#c5e1a5'];

const statusTone: Record<number, string> = {
    0: '#ef6c00',
    1: '#2e7d32',
    2: '#6a1b9a',
    3: '#00838f',
    4: '#33691e',
    6: '#c62828',
    7: '#b71c1c',
    8: '#558b2f',
    15: '#616161',
    16: '#ad1457',
    17: '#0277bd',
};

function money(value?: number) {
    return `¥${(Number(value) || 0).toFixed(2)}`;
}

function itemCount(buckets?: Bucket[]) {
    return (buckets || []).reduce((total, item) => total + (item.number || 0), 0);
}

function statusInfo(status: number) {
    return orderStatusMap.find(item => item.id === status);
}

function tableLabel(order: Order) {
    return order?.identity?.table_no || '';
}

function shortNo(order: Order) {
    const no = order?.identity?.order_no || '';
    return no.length > 8 ? no.slice(-8) : no;
}

function highlightSx(highlighted: boolean) {
    return {
        border: highlighted ? '3px solid #FF5722' : '1px solid transparent',
        animation: highlighted ? 'orderShake 0.28s ease-in-out 2' : 'none',
        transformOrigin: 'center center',
    };
}

function StatusChip({status}: {status: number}) {
    const translate = useTranslate();
    const info = statusInfo(status);
    if (!info) {
        return null;
    }
    return (
        <Chip
            label={translate(`pos.status.${status}`, {_: info.name})}
            size="small"
            sx={{
                backgroundColor: 'rgba(0,0,0,0.12)',
                color: info.color,
                fontWeight: 700,
                height: 22,
                '& .MuiChip-label': {whiteSpace: 'nowrap', px: 0.75},
            }}
        />
    );
}

function OrderActions({order, onPay, onCancel, onDetail, dense}: OrderCardHandlers & {dense?: boolean}) {
    const translate = useTranslate();
    const size = dense ? 'small' : 'large';
    return (
        <>
            {order.status === 0 && (
                <Button size={size} color="info" onClick={() => onPay(order)}>
                    {translate('pos.list.pay')}
                </Button>
            )}
            {order.status === 1 && (
                <IconButton aria-label="cancel" size={size} color="error" onClick={() => onCancel(order)}>
                    <CancelIcon fontSize={dense ? 'small' : 'medium'} />
                </IconButton>
            )}
            {order.status === 16 && (
                <IconButton aria-label="refund" size={size} color="error" onClick={() => onCancel(order)}>
                    <SubscriptIcon fontSize={dense ? 'small' : 'medium'} />
                </IconButton>
            )}
            <IconButton aria-label="detail" size={size} color="success" onClick={() => onDetail(order)}>
                <ExpandCircleDownIcon fontSize={dense ? 'small' : 'medium'} />
            </IconButton>
        </>
    );
}

function ItemRows({buckets, max = 8}: {buckets?: Bucket[]; max?: number}) {
    const rows = (buckets || []).slice(0, max);
    return (
        <Table size="small">
            <TableBody>
                {rows.map((bucket, index) => (
                    <TableRow key={bucket.id || `${bucket.name}-${index}`}>
                        <TableCell align="left" sx={{color: '#333', padding: '2px 4px', border: 0}}>
                            {bucket.name}
                        </TableCell>
                        <TableCell align="right" sx={{color: '#333', padding: '2px 4px', border: 0, whiteSpace: 'nowrap'}}>
                            {`${bucket.number}${bucket.unit ? ` ${bucket.unit}` : ''}`}
                        </TableCell>
                        <TableCell align="right" sx={{color: '#333', padding: '2px 4px', border: 0, whiteSpace: 'nowrap'}}>
                            {`¥${bucket.price}`}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function ClassicCard(props: OrderCardHandlers) {
    const {order, highlighted} = props;
    const translate = useTranslate();
    return (
        <Card
            variant="outlined"
            sx={{
                backgroundColor: statusBg[order.status] || '#fff',
                boxShadow: 3,
                padding: 0,
                borderRadius: 1,
                ...highlightSx(highlighted),
            }}
        >
            <CardContent>
                <Typography variant="body1" sx={{fontWeight: 'bold', color: '#3e2723', mb: 0.5}}>
                    {`#${order?.identity?.order_no}`}
                    {tableLabel(order) && (
                        <Typography component="span" variant="body1" sx={{fontWeight: 'normal', color: '#6d4c41', ml: 1}}>
                            {`@${tableLabel(order)}`}
                        </Typography>
                    )}
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 0.5}}>
                    <Typography variant="body2" noWrap sx={{fontWeight: 'bold', color: '#d32f2f'}}>
                        {translate('pos.cart.total')}: {money(order.price?.pay_price)}
                    </Typography>
                    <StatusChip status={order.status} />
                    <Typography variant="body2" noWrap sx={{color: '#6d4c41'}}>
                        {translate('pos.list.items', {count: itemCount(order.buckets)})}
                    </Typography>
                </Box>
                <Box sx={{height: 100, overflowY: 'auto'}}>
                    <ItemRows buckets={order.buckets} />
                </Box>
            </CardContent>
            <CardActions>
                <Typography component="span" variant="body1" sx={{fontWeight: 'normal', color: '#3e2723', ml: 1, mr: 'auto'}}>
                    {FormatTimestampAsTime(order.stp.created_at)}
                </Typography>
                <OrderActions {...props} />
            </CardActions>
        </Card>
    );
}

function TicketCard(props: OrderCardHandlers) {
    const {order, highlighted} = props;
    const translate = useTranslate();
    return (
        <Card
            variant="outlined"
            sx={{
                bgcolor: '#fffaf3',
                boxShadow: 1,
                borderRadius: 0,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                backgroundImage:
                    'radial-gradient(circle at 8px 0, transparent 6px, #fffaf3 7px), radial-gradient(circle at 8px 100%, transparent 6px, #fffaf3 7px)',
                backgroundSize: '16px 100%',
                backgroundPosition: '-8px 0',
                ...highlightSx(highlighted),
                border: highlighted ? '3px solid #FF5722' : '1px dashed #bcaaa4',
            }}
        >
            <CardContent sx={{py: 1.25, px: 1.5}}>
                <Typography sx={{textAlign: 'center', letterSpacing: 3, fontSize: 11, color: '#6d4c41'}}>
                    {translate('pos.detail.receipt')}
                </Typography>
                <Typography sx={{textAlign: 'center', fontWeight: 800, fontSize: '1rem'}}>
                    #{shortNo(order)}
                </Typography>
                <Typography sx={{textAlign: 'center', fontSize: 12, color: '#6d4c41', mb: 0.75}}>
                    {tableLabel(order) ? `@${tableLabel(order)}` : '—'} · {FormatTimestampAsTime(order.stp.created_at)}
                </Typography>
                <Box sx={{borderTop: '1px dashed #bcaaa4', borderBottom: '1px dashed #bcaaa4', py: 0.5, mb: 0.75, maxHeight: 92, overflowY: 'auto'}}>
                    {(order.buckets || []).slice(0, 6).map((bucket, index) => (
                        <Box key={bucket.id || index} sx={{display: 'flex', justifyContent: 'space-between', fontSize: 12, lineHeight: 1.6}}>
                            <Box sx={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', pr: 1}}>
                                {bucket.name}
                            </Box>
                            <Box sx={{flexShrink: 0, color: '#5d4037'}}>
                                x{bucket.number} {money(bucket.price)}
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <StatusChip status={order.status} />
                    <Typography sx={{fontWeight: 800, color: '#d32f2f'}}>{money(order.price?.pay_price)}</Typography>
                </Box>
            </CardContent>
            <CardActions sx={{justifyContent: 'center', pt: 0}}>
                <OrderActions {...props} dense />
            </CardActions>
        </Card>
    );
}

function KanbanCard(props: OrderCardHandlers) {
    const {order, highlighted} = props;
    const translate = useTranslate();
    const info = statusInfo(order.status);
    const items = (order.buckets || []).slice(0, 4);
    const extra = Math.max(0, (order.buckets || []).length - 4);
    return (
        <Card
            variant="outlined"
            sx={{
                display: 'flex',
                boxShadow: 2,
                borderRadius: 1.5,
                overflow: 'hidden',
                bgcolor: '#fff',
                ...highlightSx(highlighted),
            }}
        >
            <Box sx={{width: 8, bgcolor: statusTone[order.status] || info?.color || '#9e9e9e', flexShrink: 0}} />
            <Box sx={{flex: 1, minWidth: 0}}>
                <CardContent sx={{py: 1.25, px: 1.25, '&:last-child': {pb: 1.25}}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 0.75, mb: 0.75}}>
                        <Typography sx={{fontWeight: 800, fontSize: '1.05rem'}} noWrap>
                            {tableLabel(order) ? `#${tableLabel(order)}` : `#${shortNo(order)}`}
                        </Typography>
                        <StatusChip status={order.status} />
                    </Box>
                    <Typography sx={{fontWeight: 800, color: '#d32f2f', fontSize: '1.15rem', mb: 0.75}}>
                        {money(order.price?.pay_price)}
                        <Typography component="span" sx={{ml: 1, color: '#6d4c41', fontWeight: 500, fontSize: 12}}>
                            {translate('pos.list.items', {count: itemCount(order.buckets)})}
                        </Typography>
                    </Typography>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5, minHeight: 52}}>
                        {items.map((bucket, index) => (
                            <Chip
                                key={bucket.id || index}
                                size="small"
                                label={`${bucket.name} ×${bucket.number}`}
                                sx={{height: 22, fontSize: 11}}
                            />
                        ))}
                        {extra > 0 && <Chip size="small" label={`+${extra}`} sx={{height: 22}} />}
                    </Box>
                    <Typography variant="caption" sx={{color: '#6d4c41'}}>
                        {FormatTimestampAsTime(order.stp.created_at)} · #{shortNo(order)}
                    </Typography>
                </CardContent>
                <CardActions sx={{pt: 0}}>
                    <OrderActions {...props} dense />
                </CardActions>
            </Box>
        </Card>
    );
}

function QueueCard(props: OrderCardHandlers) {
    const {order, highlighted} = props;
    const translate = useTranslate();
    const info = statusInfo(order.status);
    const label = tableLabel(order) || shortNo(order).slice(-4);
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                ...highlightSx(highlighted),
            }}
        >
            <Box sx={{bgcolor: statusTone[order.status] || '#5d4037', color: '#fff', py: 1.5, px: 1, textAlign: 'center'}}>
                <Typography sx={{fontSize: 11, letterSpacing: 2, opacity: 0.9}}>
                    {translate(`pos.status.${order.status}`, {_: info?.name || ''})}
                </Typography>
                <Typography sx={{fontWeight: 900, fontSize: 40, lineHeight: 1.05}}>
                    {label}
                </Typography>
            </Box>
            <CardContent sx={{py: 1, px: 1.25, textAlign: 'center'}}>
                <Typography sx={{fontWeight: 800, color: '#d32f2f', mb: 0.5}}>
                    {money(order.price?.pay_price)}
                </Typography>
                <Box sx={{minHeight: 64, textAlign: 'left'}}>
                    {(order.buckets || []).slice(0, 3).map((bucket, index) => (
                        <Typography key={bucket.id || index} variant="caption" sx={{display: 'block'}} noWrap>
                            {bucket.number}× {bucket.name}
                        </Typography>
                    ))}
                    {(order.buckets || []).length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                            +{(order.buckets || []).length - 3}
                        </Typography>
                    )}
                </Box>
            </CardContent>
            <CardActions sx={{justifyContent: 'center', pt: 0}}>
                <OrderActions {...props} dense />
            </CardActions>
        </Card>
    );
}

function StripCard(props: OrderCardHandlers) {
    const {order, highlighted} = props;
    const translate = useTranslate();
    const names = (order.buckets || []).slice(0, 3).map(item => item.name).join(' / ');
    return (
        <Card
            variant="outlined"
            sx={{
                bgcolor: statusBg[order.status] || '#fafafa',
                borderRadius: 2,
                boxShadow: 1,
                ...highlightSx(highlighted),
            }}
        >
            <CardContent sx={{py: 1.25, px: 1.25, '&:last-child': {pb: 1}}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5}}>
                    <Typography sx={{fontWeight: 800}} noWrap>
                        {tableLabel(order) || `#${shortNo(order)}`}
                    </Typography>
                    <StatusChip status={order.status} />
                </Box>
                <Typography sx={{fontWeight: 800, color: '#d32f2f', fontSize: '1.2rem'}}>
                    {money(order.price?.pay_price)}
                </Typography>
                <Typography variant="caption" sx={{display: 'block', color: '#5d4037', minHeight: 32}} noWrap>
                    {names || translate('pos.list.items', {count: 0})}
                </Typography>
                <Typography variant="caption" sx={{color: '#6d4c41'}}>
                    {FormatTimestampAsTime(order.stp.created_at)} · {translate('pos.list.items', {count: itemCount(order.buckets)})}
                </Typography>
            </CardContent>
            <CardActions sx={{pt: 0}}>
                <OrderActions {...props} dense />
            </CardActions>
        </Card>
    );
}

function LedgerCard(props: OrderCardHandlers) {
    const {order, highlighted} = props;
    const translate = useTranslate();
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: 3,
                ...highlightSx(highlighted),
            }}
        >
            <Box sx={{bgcolor: '#3e2723', color: '#fff', px: 1.5, py: 1}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <Typography sx={{fontWeight: 700, fontSize: 13}} noWrap>
                        #{order?.identity?.order_no}
                    </Typography>
                    <Typography sx={{fontSize: 12, opacity: 0.85}}>
                        {FormatTimestampAsTime(order.stp.created_at)}
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5}}>
                    <Typography sx={{fontSize: 13}}>
                        {tableLabel(order) ? `${translate('pos.detail.table')} ${tableLabel(order)}` : translate('pos.detail.unset')}
                    </Typography>
                    <Typography sx={{fontWeight: 800, fontSize: '1.15rem', color: '#ffcc80'}}>
                        {money(order.price?.pay_price)}
                    </Typography>
                </Box>
            </Box>
            <CardContent sx={{py: 1, px: 1.25}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 0.5}}>
                    <StatusChip status={order.status} />
                    <Typography variant="caption" sx={{color: '#6d4c41'}}>
                        {translate('pos.list.items', {count: itemCount(order.buckets)})}
                    </Typography>
                </Box>
                <Box sx={{height: 88, overflowY: 'auto', bgcolor: '#faf6f1', borderRadius: 0.5, px: 0.5}}>
                    <ItemRows buckets={order.buckets} />
                </Box>
            </CardContent>
            <CardActions>
                <OrderActions {...props} />
            </CardActions>
        </Card>
    );
}

export function OrderCardFace(props: OrderCardHandlers & {styleName: OrderCardStyle}) {
    switch (props.styleName) {
        case 'ticket':
            return <TicketCard {...props} />;
        case 'kanban':
            return <KanbanCard {...props} />;
        case 'queue':
            return <QueueCard {...props} />;
        case 'strip':
            return <StripCard {...props} />;
        case 'ledger':
            return <LedgerCard {...props} />;
        case 'classic':
        default:
            return <ClassicCard {...props} />;
    }
}
