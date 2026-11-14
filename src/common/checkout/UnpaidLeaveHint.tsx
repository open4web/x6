import React, {useEffect} from 'react';
import {Box, Button, IconButton, Paper, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useTranslate} from 'react-admin';
import {useCartContext} from '../../dataProvider/MyCartProvider';
import {playPosSound} from '../../utils/touchSound';

export default function UnpaidLeaveHint({fabRight}: {fabRight: number}) {
    const translate = useTranslate();
    const {
        unpaidLeave,
        clearUnpaidLeave,
        setOrderDrawerOpen,
        setHighlightOrderNo,
    } = useCartContext();

    useEffect(() => {
        if (!unpaidLeave) {
            return;
        }
        playPosSound('warn');
        const timer = window.setTimeout(clearUnpaidLeave, 8000);
        return () => window.clearTimeout(timer);
    }, [unpaidLeave?.token, clearUnpaidLeave]);

    if (!unpaidLeave) {
        return null;
    }

    const openOrders = () => {
        setHighlightOrderNo(unpaidLeave.orderNo);
        setOrderDrawerOpen(true);
        clearUnpaidLeave();
    };

    return (
        <Paper
            elevation={8}
            role="status"
            sx={{
                position: 'fixed',
                bottom: 78,
                right: fabRight + 68,
                zIndex: 1400,
                px: 1.5,
                py: 1.25,
                maxWidth: 300,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 2,
                bgcolor: '#fff8e1',
                border: '1px solid #ffb300',
                color: '#3e2723',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: -8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderWidth: '8px 0 8px 8px',
                    borderStyle: 'solid',
                    borderColor: 'transparent transparent transparent #ffb300',
                },
            }}
        >
            <Box sx={{flex: 1, minWidth: 0}}>
                <Typography sx={{fontWeight: 800, fontSize: 15, lineHeight: 1.35}}>
                    {translate('pos.pay_hint.leave_unpaid')}
                </Typography>
                <Button
                    variant="contained"
                    color="warning"
                    onClick={openOrders}
                    sx={{mt: 1, fontWeight: 800, minHeight: 36}}
                >
                    {translate('pos.pay_hint.go_orders')}
                </Button>
            </Box>
            <IconButton
                aria-label={translate('pos.request_error.close', {_: '关闭'})}
                size="small"
                onClick={clearUnpaidLeave}
                sx={{alignSelf: 'flex-start', color: 'inherit'}}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Paper>
    );
}
