import {useState} from 'react';
import Box from '@mui/material/Box';

import {useSidebarState,} from 'react-admin';

import HoldOrderPage from '../common/HoldOrderPage';


// @ts-ignore
const Menu = () => {
    // 主目录（是否展开)
    const [state, setState] = useState({});
    const [open] = useSidebarState();

    // @ts-ignore
    const handleToggle = (menu: string) => {
        // @ts-ignore
        setState(state => ({...state, [menu]: !state[menu]}));
    };
    return (
        <Box
            sx={{
                width: open ? 360 : 70,
                marginTop: 0.2,
                marginBottom: 0.2,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            {/* 主页 */}
            <HoldOrderPage open={open}/>
        </Box>
    );
};

export default Menu;
