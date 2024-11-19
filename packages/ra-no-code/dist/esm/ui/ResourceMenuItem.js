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
import React, { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import { MenuItemLink } from 'react-admin';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DefaultIcon from '@mui/icons-material/ViewList';
import { NavLink } from 'react-router-dom';
var PREFIX = 'ResourceMenuItem';
var classes = {
    root: "".concat(PREFIX, "-root"),
    resource: "".concat(PREFIX, "-resource"),
    settings: "".concat(PREFIX, "-settings"),
};
var Root = styled('div')(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.".concat(classes.root)] = {
            display: 'flex',
        },
        _b["& .".concat(classes.resource)] = {
            flexGrow: 1,
        },
        _b["& .".concat(classes.settings)] = {
            marginLeft: 'auto',
        },
        _b);
});
export var ResourceMenuItem = function (props) {
    var resource = props.resource, rest = __rest(props, ["resource"]);
    return (React.createElement(Root, { className: classes.root },
        React.createElement(MenuItemLink, __assign({ key: resource.name, className: classes.resource, to: "/".concat(resource.name), state: { _scrollToTop: true }, primaryText: (resource === null || resource === void 0 ? void 0 : resource.label) || resource.name, leftIcon: React.createElement(DefaultIcon, null) }, rest)),
        React.createElement(IconButton, { component: NavLinkRef, to: {
                pathname: "/configure/".concat(resource.name),
            }, className: classes.settings, size: "large" },
            React.createElement(SettingsIcon, null))));
};
var NavLinkRef = forwardRef(function (props, ref) { return (React.createElement(NavLink, __assign({ ref: ref }, props))); });
//# sourceMappingURL=ResourceMenuItem.js.map