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
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { Typography, Link } from '@mui/material';
import { useRecordContext, useTranslate } from 'ra-core';
import { fieldPropTypes } from './types';
export var UrlField = memo(function (props) {
    var className = props.className, emptyText = props.emptyText, source = props.source, rest = __rest(props, ["className", "emptyText", "source"]);
    var record = useRecordContext(props);
    var value = get(record, source);
    var translate = useTranslate();
    if (value == null) {
        return (React.createElement(Typography, __assign({ component: "span", variant: "body2", className: className }, sanitizeFieldRestProps(rest)), emptyText && translate(emptyText, { _: emptyText })));
    }
    return (React.createElement(Link, __assign({ className: className, href: value, variant: "body2" }, sanitizeFieldRestProps(rest)), value));
});
UrlField.propTypes = fieldPropTypes;
UrlField.displayName = 'UrlField';
//# sourceMappingURL=UrlField.js.map