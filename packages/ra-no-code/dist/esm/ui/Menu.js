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
import PropTypes from 'prop-types';
import lodashGet from 'lodash/get';
import clsx from 'clsx';
import { DashboardMenuItem, useSidebarState } from 'react-admin';
import { NewResourceMenuItem } from './NewResourceMenuItem';
import { useResourcesConfiguration } from '../ResourceConfiguration';
import { ResourceMenuItem } from './ResourceMenuItem';
var PREFIX = 'RaMenu';
var classes = {
    main: "".concat(PREFIX, "-main"),
    open: "".concat(PREFIX, "-open"),
    closed: "".concat(PREFIX, "-closed"),
};
var Root = styled('div')(function (_a) {
    var _b, _c;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(classes.main)] = (_c = {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                marginTop: '0.5em'
            },
            _c[theme.breakpoints.only('xs')] = {
                marginTop: 0,
            },
            _c[theme.breakpoints.up('md')] = {
                marginTop: '1.5em',
            },
            _c),
        _b["& .".concat(classes.open)] = {
            width: lodashGet(theme, 'menu.width', MENU_WIDTH),
        },
        _b["& .".concat(classes.closed)] = {
            width: lodashGet(theme, 'menu.closedWidth', CLOSED_MENU_WIDTH),
        },
        _b);
});
export var MENU_WIDTH = 240;
export var CLOSED_MENU_WIDTH = 55;
export var Menu = function (props) {
    var _a;
    var className = props.className, dense = props.dense, hasDashboard = props.hasDashboard, rest = __rest(props, ["className", "dense", "hasDashboard"]);
    var open = useSidebarState()[0];
    var resources = useResourcesConfiguration()[0];
    return (React.createElement(Root, null,
        React.createElement("div", __assign({ className: clsx(classes.main, (_a = {},
                _a[classes.open] = open,
                _a[classes.closed] = !open,
                _a), className) }, rest),
            hasDashboard && (React.createElement(DashboardMenuItem, { dense: dense, sidebarIsOpen: open })),
            Object.keys(resources).map(function (resource) { return (React.createElement(ResourceMenuItem, { key: resource, resource: resources[resource], dense: dense, sidebarIsOpen: open })); }),
            React.createElement(NewResourceMenuItem, { dense: dense, sidebarIsOpen: open }))));
};
Menu.propTypes = {
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
};
//# sourceMappingURL=Menu.js.map