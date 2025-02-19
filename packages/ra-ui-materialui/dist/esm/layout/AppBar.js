var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Children, memo } from 'react';
import PropTypes from 'prop-types';
import { AppBar as MuiAppBar, Toolbar, Typography, useMediaQuery, } from '@mui/material';
import { ComponentPropType, useLocales } from 'ra-core';
import { SidebarToggleButton } from './SidebarToggleButton';
import { LoadingIndicator } from './LoadingIndicator';
import { UserMenu } from './UserMenu';
import { HideOnScroll } from './HideOnScroll';
import { LocalesMenuButton } from '../button';
/**
 * The AppBar component renders a custom MuiAppBar.
 *
 * @param {Object} props
 * @param {ReactNode} props.children React node/s to be rendered as children of the AppBar
 * @param {string} props.className CSS class applied to the MuiAppBar component
 * @param {string} props.color The color of the AppBar
 * @param {boolean} props.open State of the <Admin/> Sidebar
 * @param {Element | boolean} props.userMenu A custom user menu component for the AppBar. <UserMenu/> component by default. Pass false to disable.
 *
 * @example
 *
 * const MyAppBar = props => {

 *   return (
 *       <AppBar {...props}>
 *           <Typography
 *               variant="h6"
 *               color="inherit"
 *               className={classes.title}
 *               id="react-admin-title"
 *           />
 *       </AppBar>
 *   );
 *};
 *
 * @example Without a user menu
 *
 * const MyAppBar = props => {

 *   return (
 *       <AppBar {...props} userMenu={false} />
 *   );
 *};
 */
export var AppBar = memo(function (props) {
    var children = props.children, className = props.className, _a = props.color, color = _a === void 0 ? 'secondary' : _a, open = props.open, title = props.title, _b = props.userMenu, userMenu = _b === void 0 ? DefaultUserMenu : _b, _c = props.container, Container = _c === void 0 ? HideOnScroll : _c, rest = __rest(props, ["children", "className", "color", "open", "title", "userMenu", "container"]);
    var locales = useLocales();
    var isXSmall = useMediaQuery(function (theme) {
        return theme.breakpoints.down('sm');
    });
    return (React.createElement(Container, { className: className },
        React.createElement(StyledAppBar, __assign({ className: AppBarClasses.appBar, color: color }, rest),
            React.createElement(Toolbar, { disableGutters: true, variant: isXSmall ? 'regular' : 'dense', className: AppBarClasses.toolbar },
                React.createElement(SidebarToggleButton, { className: AppBarClasses.menuButton }),
                Children.count(children) === 0 ? (React.createElement(Typography, { variant: "h6", color: "inherit", className: AppBarClasses.title, id: "react-admin-title" })) : (children),
                locales && locales.length > 1 ? (React.createElement(LocalesMenuButton, null)) : null,
                React.createElement(LoadingIndicator, null),
                typeof userMenu === 'boolean' ? (userMenu === true ? (React.createElement(UserMenu, null)) : null) : (userMenu)))));
});
AppBar.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    color: PropTypes.oneOf([
        'default',
        'inherit',
        'primary',
        'secondary',
        'transparent',
    ]),
    container: ComponentPropType,
    // @deprecated
    open: PropTypes.bool,
    userMenu: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
};
var DefaultUserMenu = React.createElement(UserMenu, null);
var PREFIX = 'RaAppBar';
export var AppBarClasses = {
    appBar: "".concat(PREFIX, "-appBar"),
    toolbar: "".concat(PREFIX, "-toolbar"),
    menuButton: "".concat(PREFIX, "-menuButton"),
    menuButtonIconClosed: "".concat(PREFIX, "-menuButtonIconClosed"),
    menuButtonIconOpen: "".concat(PREFIX, "-menuButtonIconOpen"),
    title: "".concat(PREFIX, "-title"),
};
var StyledAppBar = styled(MuiAppBar, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b, _c;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(AppBarClasses.toolbar)] = (_c = {
                padding: "0 ".concat(theme.spacing(1.5), " 0 0")
            },
            _c[theme.breakpoints.down('md')] = {
                minHeight: theme.spacing(6),
            },
            _c),
        _b["& .".concat(AppBarClasses.menuButton)] = {
            marginLeft: '0.2em',
            marginRight: '0.2em',
        },
        _b["& .".concat(AppBarClasses.title)] = {
            flex: 1,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        },
        _b);
});
//# sourceMappingURL=AppBar.js.map