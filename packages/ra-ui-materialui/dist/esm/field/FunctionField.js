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
import { useMemo } from 'react';
import { useRecordContext } from 'ra-core';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { fieldPropTypes } from './types';
/**
 * Field using a render function
 *
 * @example
 * <FunctionField
 *     source="last_name" // used for sorting
 *     label="Name"
 *     render={record => record && `${record.first_name} ${record.last_name}`}
 * />
 */
export var FunctionField = function (props) {
    var className = props.className, _a = props.source, source = _a === void 0 ? '' : _a, render = props.render, rest = __rest(props, ["className", "source", "render"]);
    var record = useRecordContext(props);
    return useMemo(function () {
        return record ? (React.createElement(Typography, __assign({ component: "span", variant: "body2", className: className }, sanitizeFieldRestProps(rest)), render(record, source))) : null;
    }, [className, record, source, render, rest]);
};
FunctionField.propTypes = __assign(__assign(__assign({}, Typography.propTypes), fieldPropTypes), { render: PropTypes.func.isRequired });
//# sourceMappingURL=FunctionField.js.map