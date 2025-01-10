import * as React from 'react';
import Badge from '@mui/material/Badge';
import PrintIcon from '@mui/icons-material/Print';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle'; // 圆点图标

export default function MyPrinter() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'printer-popover' : undefined;

    // 模拟打印机数据
    const printers = [
        { name: 'HP LaserJet Pro', status: 'Online', statusColor: 'green' },
        { name: 'Canon PIXMA G3010', status: 'Offline', statusColor: 'red' },
        { name: 'Epson EcoTank L3150', status: 'Online', statusColor: 'green' },
        { name: 'Brother HL-L2320D', status: 'Error', statusColor: 'orange' },
    ];

    return (
        <>
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
                onClick={handleClick}
            >
                <Badge badgeContent={printers.length} color="success" variant="dot">
                    <PrintIcon color="inherit" />
                </Badge>
            </Box>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <List>
                    {printers.map((printer, index) => (
                        <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                {printer.name}
                            </Typography>
                            <CircleIcon
                                sx={{
                                    fontSize: 12, // 调整 dot 的大小
                                    color: printer.statusColor, // 动态设置 dot 的颜色
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Popover>
        </>
    );
}