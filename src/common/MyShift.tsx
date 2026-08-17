import * as React from 'react';
import {Button, Tooltip} from '@mui/material';
import HandshakeIcon from '@mui/icons-material/Handshake';
import {useCartContext} from '../dataProvider/MyCartProvider';

export default function MyShiftAppBar() {
    const {shiftOpen, setShiftOpen, ready} = useCartContext();

    return (
        <Tooltip title={ready ? '结束本班，办理交接' : '请先开始值班后再交接'}>
            <span>
                <Button
                    variant="outlined"
                    color="inherit"
                    disabled={!ready}
                    startIcon={<HandshakeIcon />}
                    onClick={() => setShiftOpen(!shiftOpen)}
                    sx={{
                        height: 34,
                        px: 1.5,
                        borderRadius: 5,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderColor: 'rgba(255,255,255,0.55)',
                        bgcolor: 'rgba(255,255,255,0.08)',
                        '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.16)',
                            borderColor: '#fff',
                        },
                        '&.Mui-disabled': {
                            color: 'rgba(255,255,255,0.45)',
                            borderColor: 'rgba(255,255,255,0.2)',
                        },
                    }}
                >
                    交接班
                </Button>
            </span>
        </Tooltip>
    );
}
