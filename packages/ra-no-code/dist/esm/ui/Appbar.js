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
import * as React from 'react';
import { AppBar as RaAppBar } from 'react-admin';
import { UserMenu } from './UserMenu';
export var AppBar = function (props) { return (React.createElement(RaAppBar, __assign({}, props, { userMenu: React.createElement(UserMenu, null) }))); };
//# sourceMappingURL=Appbar.js.map