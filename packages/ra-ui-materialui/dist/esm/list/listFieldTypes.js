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
import { Datagrid } from './datagrid';
import { SingleFieldList } from './SingleFieldList';
import { ArrayField, BooleanField, ChipField, DateField, EmailField, NumberField, ReferenceField, ReferenceArrayField, TextField, UrlField, } from '../field';
export var listFieldTypes = {
    table: {
        component: function (props) { return React.createElement(Datagrid, __assign({ rowClick: "edit" }, props)); },
        representation: function (_, children) { return "        <Datagrid rowClick=\"edit\">\n".concat(children.map(function (child) { return "            ".concat(child.getRepresentation()); }).join('\n'), "\n        </Datagrid>"); },
    },
    array: {
        // eslint-disable-next-line react/display-name
        component: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement(ArrayField, __assign({}, props),
                React.createElement(SingleFieldList, null,
                    React.createElement(ChipField, { source: children.length > 0 && children[0].props.source }))));
        },
        representation: function (props, children) {
            return "<ArrayField source=\"".concat(props.source, "\"><SingleFieldList><ChipField source=\"").concat(children.length > 0 && children[0].getProps().source, "\" /></SingleFieldList></ArrayField>");
        },
    },
    boolean: {
        component: BooleanField,
        representation: function (props) { return "<BooleanField source=\"".concat(props.source, "\" />"); },
    },
    date: {
        component: DateField,
        representation: function (props) { return "<DateField source=\"".concat(props.source, "\" />"); },
    },
    email: {
        component: EmailField,
        representation: function (props) { return "<EmailField source=\"".concat(props.source, "\" />"); },
    },
    id: {
        component: TextField,
        representation: function (props) { return "<TextField source=\"".concat(props.source, "\" />"); },
    },
    number: {
        component: NumberField,
        representation: function (props) { return "<NumberField source=\"".concat(props.source, "\" />"); },
    },
    reference: {
        component: ReferenceField,
        representation: function (props) {
            return "<ReferenceField source=\"".concat(props.source, "\" reference=\"").concat(props.reference, "\" />");
        },
    },
    referenceChild: {
        component: function () { return React.createElement(TextField, { source: "id" }); },
        representation: function () { return "<TextField source=\"id\" />"; },
    },
    referenceArray: {
        component: ReferenceArrayField,
        representation: function (props) {
            return "<ReferenceArrayField source=\"".concat(props.source, "\" reference=\"").concat(props.reference, "\" />");
        },
    },
    referenceArrayChild: {
        component: function () { return (React.createElement(SingleFieldList, null,
            React.createElement(ChipField, { source: "id" }))); },
        representation: function () {
            return "<SingleFieldList><ChipField source=\"id\" /></SingleFieldList>";
        },
    },
    richText: undefined,
    string: {
        component: TextField,
        representation: function (props) { return "<TextField source=\"".concat(props.source, "\" />"); },
    },
    url: {
        component: UrlField,
        representation: function (props) { return "<UrlField source=\"".concat(props.source, "\" />"); },
    },
};
//# sourceMappingURL=listFieldTypes.js.map