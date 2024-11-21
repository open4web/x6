import {useState} from 'react';
import Box from '@mui/material/Box';
// import IconMaps from './IconMaps';
import BuildIcon from '@mui/icons-material/Build';

import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
    useSidebarState,
    useGetOne,
    Loading,
} from 'react-admin';

import SubMenu from './SubMenu';
import LoadingMenu from './LoadingMenu';
import HoldOrderPage from '../common/HoldOrderPage';


// @ts-ignore
const Menu = () => {
    // 主目录（是否展开)
    const [state, setState] = useState({});
    const [isSetState, setIsSetState] = useState(false);
    const translate = useTranslate();
    const [open] = useSidebarState();

    // TODO change to load hold order
    // const {data, isLoading, error} = useGetOne('menu.v1.system.auth.user.access', {id: 0});
    // if (isLoading) {
    //     return <Loading/>;
    // }
    // if (error) {
    //     return <LoadingMenu/>;
    // } else {
    //     // 防止重复设定state 导致重复渲染，造成死循环
    //     if (!isSetState) {
    //         setState(data.paths_allow)
    //         setIsSetState(true)
    //     }
    // }
    //
    // const mtree = data.mtree

    // @ts-ignore
    const handleToggle = (menu: string) => {
        // @ts-ignore
        setState(state => ({...state, [menu]: !state[menu]}));
    };
    return (
        <Box
            sx={{
                width: open ? 360 : 50,
                marginTop: 1,
                marginBottom: 1,
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
