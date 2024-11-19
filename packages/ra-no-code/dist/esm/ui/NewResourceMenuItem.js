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
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { ImportResourceDialog } from './ImportResourceDialog';
import { ListItemIcon, ListItemText, MenuItem, Tooltip, } from '@mui/material';
var PREFIX = 'RaMenuItemLink';
var classes = {
    root: "".concat(PREFIX, "-root"),
    active: "".concat(PREFIX, "-active"),
    icon: "".concat(PREFIX, "-icon"),
};
var Root = styled('div')(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(classes.root)] = {
            color: theme.palette.text.secondary,
        },
        _b["& .".concat(classes.active)] = {
            color: theme.palette.text.primary,
        },
        _b["& .".concat(classes.icon)] = { minWidth: theme.spacing(5) },
        _b);
});
export var NewResourceMenuItem = function (props) {
    var sidebarIsOpen = props.sidebarIsOpen, rest = __rest(props, ["sidebarIsOpen"]);
    var _a = useState(false), showImportResourceDialog = _a[0], setShowImportResourceDialog = _a[1];
    var handleClick = function (event) {
        setShowImportResourceDialog(true);
    };
    var handleCloseImportNewResourceDialog = function () {
        setShowImportResourceDialog(false);
    };
    var primaryText = 'New resource';
    var renderMenuItem = function () { return (React.createElement(MenuItem, __assign({ className: classes.root, tabIndex: 0 }, rest, { onClick: handleClick }),
        React.createElement(ListItemIcon, { className: classes.icon },
            React.createElement(AddIcon, { titleAccess: primaryText })),
        React.createElement(ListItemText, null, primaryText))); };
    return (React.createElement(Root, null,
        sidebarIsOpen ? (renderMenuItem()) : (React.createElement(Tooltip, { title: primaryText, placement: "right" }, renderMenuItem())),
        React.createElement(ImportResourceDialog, { open: showImportResourceDialog, onClose: handleCloseImportNewResourceDialog })));
};
//# sourceMappingURL=NewResourceMenuItem.js.map