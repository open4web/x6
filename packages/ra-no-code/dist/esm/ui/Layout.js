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
import React from 'react';
import { Layout as RaLayout } from 'react-admin';
import { Menu } from './Menu';
import { AppBar } from './Appbar';
export var Layout = function (props) { return (React.createElement(RaLayout, __assign({}, props, { appBar: AppBar, menu: Menu }))); };
//# sourceMappingURL=Layout.js.map