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
import { forwardRef } from 'react';
import { MenuItemLink } from 'react-admin';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useApplication } from '../ApplicationContext';
export var ExitApplicationMenu = forwardRef(function (_a, ref) {
    var onClick = _a.onClick, props = __rest(_a, ["onClick"]);
    var onExit = useApplication().onExit;
    var handleClick = function () {
        onExit();
    };
    return (React.createElement(MenuItemLink, __assign({ ref: ref, to: "/", primaryText: "Exit application", leftIcon: React.createElement(ExitToAppIcon, null), onClick: handleClick }, props)));
});
//# sourceMappingURL=ExitApplicationMenu.js.map