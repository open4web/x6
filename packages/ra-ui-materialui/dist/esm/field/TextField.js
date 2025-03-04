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
import { memo } from 'react';
import get from 'lodash/get';
import Typography from '@mui/material/Typography';
import { useRecordContext } from 'ra-core';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { fieldPropTypes } from './types';
export var TextField = memo(function (props) {
    var className = props.className, source = props.source, emptyText = props.emptyText, rest = __rest(props, ["className", "source", "emptyText"]);
    var record = useRecordContext(props);
    var value = get(record, source);
    return (React.createElement(Typography, __assign({ component: "span", variant: "body2", className: className }, sanitizeFieldRestProps(rest)), value != null && typeof value !== 'string'
        ? JSON.stringify(value)
        : value || emptyText));
});
// what? TypeScript loses the displayName if we don't set it explicitly
TextField.displayName = 'TextField';
TextField.propTypes = __assign(__assign({}, Typography.propTypes), fieldPropTypes);
//# sourceMappingURL=TextField.js.map