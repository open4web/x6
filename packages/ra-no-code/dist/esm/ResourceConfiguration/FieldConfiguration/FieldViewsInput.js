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
import { CheckboxGroupInput } from 'react-admin';
export var FieldViewsInput = function (props) { return (React.createElement(CheckboxGroupInput, __assign({}, props, { choices: VIEWS, defaultValue: VIEWS_INITIAL_VALUE }))); };
var VIEWS = [
    {
        id: 'list',
        name: 'List',
    },
    {
        id: 'edit',
        name: 'Edit',
    },
    {
        id: 'create',
        name: 'Create',
    },
    {
        id: 'show',
        name: 'Show',
    },
];
var VIEWS_INITIAL_VALUE = ['list', 'edit', 'create', 'show'];
//# sourceMappingURL=FieldViewsInput.js.map