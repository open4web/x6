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


// @ts-ignore
const Menu = () => {
    // 主目录（是否展开)
    const [state, setState] = useState({});
    const [isSetState, setIsSetState] = useState(false);
    const translate = useTranslate();
    const [open] = useSidebarState();

    const {data, isLoading, error} = useGetOne('menu.v1.system.auth.user.access', {id: 0});
    if (isLoading) {
        return <Loading/>;
    }
    if (error) {
        return <LoadingMenu/>;
    } else {
        // 防止重复设定state 导致重复渲染，造成死循环
        if (!isSetState) {
            setState(data.paths_allow)
            setIsSetState(true)
        }
    }

    const mtree = data.mtree

    // @ts-ignore
    const handleToggle = (menu: string) => {
        // @ts-ignore
        setState(state => ({...state, [menu]: !state[menu]}));
    };
    return (
        <Box
            sx={{
                width: open ? 200 : 50,
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
            <DashboardMenuItem/>
            {
                // @ts-ignore
                mtree && mtree.map((path) => {
                    var menuNameSlice = path.name.split(".")
                    // hlj , gyb ...
                    var biz = menuNameSlice.slice(0, 3)
                    // trade, user, order
                    var mainMenu = menuNameSlice.slice(3, 5)
                    //
                    var menuName = biz.join("_") + "." + mainMenu.join(".")


                    return <SubMenu
                        key={path.name}
                        handleToggle={() => handleToggle(path.name)}
                        isOpen={
                            // @ts-ignore
                            state[path.name]
                        }
                        name={menuName}
                        icon={<BuildIcon />}
                        dense={true}
                        enable={true}
                        display={true}
                    >
                        {
                            // @ts-ignore
                            path.sub_menu && path.sub_menu.map((j) => {

                                var menuNameSlice = j.split(".")
                                // hlj , gyb ...
                                var biz = menuNameSlice.slice(0, 3)
                                // trade, user, order
                                var mainMenu = menuNameSlice.slice(3, 6)
                                //
                                var menuName = biz.join("_") + "." + mainMenu.join(".")
                                return <MenuItemLink
                                    to={j}
                                    state={{"_scrollToTop": true}}
                                    key={j}
                                    primaryText={translate(menuName, {
                                        smart_count: 2,
                                    })}
                                    leftIcon={
                                        // @ts-ignore
                                        <BuildIcon />
                                    }
                                    dense={true}
                                />
                            })
                        }
                    </SubMenu>
                })
            }
        </Box>
    );
};

export default Menu;
