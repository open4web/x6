import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import MySeat from "./Seat";
import { TransitionProps } from "@mui/material/transitions";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText } from '@mui/material';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type MerchantSeatsProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MerchantSeats({ open, setOpen }: MerchantSeatsProps) {
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [isSeatSelected, setIsSeatSelected] = React.useState<boolean>(false);
    const storeId = localStorage.getItem('current_store_id') || '';

    React.useEffect(() => {
        // 初始化时检查 localStorage 是否有值
        const selectedSeatId = localStorage.getItem('selectedSeatId');
        setIsSeatSelected(!!selectedSeatId);
    }, [open]); // 每次打开对话框时重新检查

    const handleClose = () => {
        // 取消时清除 localStorage
        localStorage.removeItem('selectedSeatId');
        setIsSeatSelected(false);
        setOpen(false);
    };

    const handleConfirm = () => {
        setOpen(false);
    };

    const handleSeatSelect = (seatId: string | null) => {
        if (seatId) {
            localStorage.setItem('selectedSeatId', seatId);
            setIsSeatSelected(true);
        } else {
            localStorage.removeItem('selectedSeatId');
            setIsSeatSelected(false);
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                fullScreen={true}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <DialogTitle id="scroll-dialog-title">选择座位</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}
                    >
                        {/* MySeat 将选中状态通过 props.onSelect 回调 */}
                        <MySeat onSelectSeat={handleSeatSelect} storeId={storeId} />
                    </DialogContentText>
                </DialogContent>
                {/* 将按钮显著放置在底部 */}
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        py: 2,
                        px: 2,
                        boxSizing: 'border-box',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 2,
                        }}
                    >
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            color="error"
                            sx={{ flex: 1, maxWidth: '48%' }}
                        >
                            取消
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            variant="contained"
                            color="primary"
                            disabled={!isSeatSelected} // 使用状态来禁用按钮
                            sx={{ flex: 1, maxWidth: '48%' }}
                        >
                            选定
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}