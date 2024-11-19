// 页面配置
import * as React from "react";
import {Logout, UserMenu, useTranslate} from "react-admin";
import {Avatar, ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import {Link} from "react-router-dom";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import AppsIcon from "@mui/icons-material/Apps";

const ConfigurationMenu = React.forwardRef((props, ref) => {
    const translate = useTranslate();
    return (
        <MenuItem
            component={Link}
            // @ts-ignore
            ref={ref}
            {...props}
            to="/configuration"
        >
            <ListItemIcon>
                <DisplaySettingsIcon/>
            </ListItemIcon>
            <ListItemText>{translate('pos.configuration')}</ListItemText>
        </MenuItem>
    );
});

// 用户配置
const UserProfileMenu = React.forwardRef((props, ref) => {
    const translate = useTranslate();
    return (
        <MenuItem
            component={Link}
            // @ts-ignore
            ref={ref}
            {...props}
            to="menu.v1.system.auth.merchant.profile"
        >
            <ListItemIcon>
                <SettingsAccessibilityIcon/>
            </ListItemIcon>
            <ListItemText>{translate('pos.userProfile')}</ListItemText>
        </MenuItem>
    );
});

// 应用中心配置
const ApplicationCenterMenu = React.forwardRef((props, ref) => {
    const translate = useTranslate();
    return (
        <MenuItem
            component={Link}
            // @ts-ignore
            ref={ref}
            {...props}
            to="/application"
        >
            <ListItemIcon>
                <AppsIcon/>
            </ListItemIcon>
            <ListItemText>{translate('pos.application')}</ListItemText>
        </MenuItem>
    );
});

const MyCustomIcon = () => (
    <Avatar
        sx={{
            height: 30,
            width: 30,
        }}
        // 用户的头像
        src="https://avatar.iran.liara.run/public/27"
    />
);

// @ts-ignore
const MyUserMenu = (props) => (<UserMenu {...props} icon={<MyCustomIcon/>}/>);


const MyAppMenu = () => (
    <MyUserMenu>
        <UserProfileMenu/>
        <ConfigurationMenu/>
        <ApplicationCenterMenu/>
        <Logout/>
    </MyUserMenu>
);

export default MyAppMenu;