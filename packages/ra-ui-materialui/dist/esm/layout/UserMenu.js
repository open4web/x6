import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useAuthProvider, useGetIdentity, useTranslate } from 'ra-core';
import { Tooltip, IconButton, Menu, Button, Avatar, useMediaQuery, } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { UserMenuContextProvider } from './UserMenuContextProvider';
import { Logout } from '../auth/Logout';
/**
 * The UserMenu component renders a Mui Button that shows a Menu.
 * It accepts children that must be Mui MenuItem components.
 *
 * @example
 * import { Logout, UserMenu, useUserMenu } from 'react-admin';
 * import MenuItem from '@mui/material/MenuItem';
 * import ListItemIcon from '@mui/material/ListItemIcon';
 * import ListItemText from '@mui/material/ListItemText';
 * import SettingsIcon from '@mui/icons-material/Settings';

 * const ConfigurationMenu = React.forwardRef((props, ref) => {
 *     const { onClose } = useUserMenu();
 *     return (
 *         <MenuItem
 *             ref={ref}
 *             {...props}
 *             to="/configuration"
 *             onClick={onClose}
 *         >
 *             <ListItemIcon>
 *                 <SettingsIcon />
 *             </ListItemIcon>
 *             <ListItemText>Configuration</ListItemText>
 *         </MenuItem>
 *     );
 * });
 *
 * export const MyUserMenu = () => (
 *     <UserMenu>
 *         <ConfigurationMenu />
 *         <Logout />
 *     </UserMenu>
 * );
 * @param props
 * @param {ReactNode} props.children React node/s to be rendered as children of the UserMenu. Must be Mui MenuItem components
 * @param {string} props.className CSS class applied to the MuiAppBar component
 * @param {string} props.label The label of the UserMenu button. Accepts translation keys
 * @param {Element} props.icon The icon of the UserMenu button.
 *
 */
export var UserMenu = function (props) {
    var _a = useState(null), anchorEl = _a[0], setAnchorEl = _a[1];
    var translate = useTranslate();
    var _b = useGetIdentity(), isLoading = _b.isLoading, identity = _b.identity;
    var authProvider = useAuthProvider();
    var isLargeEnough = useMediaQuery(function (theme) {
        return theme.breakpoints.up('sm');
    });
    var _c = props.children, children = _c === void 0 ? !!authProvider ? React.createElement(Logout, null) : null : _c, className = props.className, _d = props.label, label = _d === void 0 ? 'ra.auth.user_menu' : _d, _e = props.icon, icon = _e === void 0 ? defaultIcon : _e;
    var handleMenu = function (event) { return setAnchorEl(event.currentTarget); };
    var handleClose = useCallback(function () { return setAnchorEl(null); }, []);
    var context = useMemo(function () { return ({ onClose: handleClose }); }, [handleClose]);
    if (!children)
        return null;
    var open = Boolean(anchorEl);
    return (React.createElement(Root, { className: className },
        isLargeEnough && !isLoading && (identity === null || identity === void 0 ? void 0 : identity.fullName) ? (React.createElement(Button, { "aria-label": label && translate(label, { _: label }), className: UserMenuClasses.userButton, color: "inherit", startIcon: identity.avatar ? (React.createElement(Avatar, { className: UserMenuClasses.avatar, src: identity.avatar, alt: identity.fullName })) : (icon), onClick: handleMenu }, identity.fullName)) : (React.createElement(Tooltip, { title: label && translate(label, { _: label }) },
            React.createElement(IconButton, { "aria-label": label && translate(label, { _: label }), "aria-owns": open ? 'menu-appbar' : null, "aria-haspopup": true, color: "inherit", onClick: handleMenu, size: "large" }, !isLoading && (identity === null || identity === void 0 ? void 0 : identity.avatar) ? (React.createElement(Avatar, { className: UserMenuClasses.avatar, src: identity.avatar, alt: identity.fullName })) : (icon)))),
        React.createElement(UserMenuContextProvider, { value: context },
            React.createElement(Menu, { id: "menu-appbar", disableScrollLock: true, anchorEl: anchorEl, anchorOrigin: AnchorOrigin, transformOrigin: TransformOrigin, open: open, onClose: handleClose }, children))));
};
UserMenu.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    label: PropTypes.string,
    icon: PropTypes.node,
};
var PREFIX = 'RaUserMenu';
export var UserMenuClasses = {
    userButton: "".concat(PREFIX, "-userButton"),
    avatar: "".concat(PREFIX, "-avatar"),
};
var Root = styled('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(UserMenuClasses.userButton)] = {
            textTransform: 'none',
        },
        _b["& .".concat(UserMenuClasses.avatar)] = {
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
        _b);
});
var defaultIcon = React.createElement(AccountCircle, null);
var AnchorOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
};
var TransformOrigin = {
    vertical: 'top',
    horizontal: 'right',
};
//# sourceMappingURL=UserMenu.js.map