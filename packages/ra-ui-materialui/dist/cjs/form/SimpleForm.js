"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleForm = void 0;
var React = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var ra_core_1 = require("ra-core");
var material_1 = require("@mui/material");
var Toolbar_1 = require("./Toolbar");
/**
 * Form with a one column layout, one input per line.
 *
 * Pass input components as children.
 *
 * @example
 *
 * import * as React from "react";
 * import { Create, Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton } from 'react-admin';
 * import RichTextInput from 'ra-input-rich-text';
 *
 * export const PostCreate = (props) => (
 *     <Create {...props}>
 *         <SimpleForm>
 *             <TextInput source="title" />
 *             <TextInput source="teaser" options={{ multiline: true }} />
 *             <RichTextInput source="body" />
 *             <DateInput label="Publication date" source="published_at" defaultValue={new Date()} />
 *         </SimpleForm>
 *     </Create>
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by Create or Edit)
 * @prop {ReactElement[]} children Input elements
 * @prop {Object} defaultValues
 * @prop {Function} validate
 * @prop {string} redirect
 * @prop {ReactElement} toolbar The element displayed at the bottom of the form, containing the SaveButton
 *
 * @param {Props} props
 */
var SimpleForm = function (props) {
    var children = props.children, className = props.className, _a = props.component, Component = _a === void 0 ? DefaultComponent : _a, sx = props.sx, _b = props.toolbar, toolbar = _b === void 0 ? DefaultToolbar : _b, rest = __rest(props, ["children", "className", "component", "sx", "toolbar"]);
    return (React.createElement(ra_core_1.Form, __assign({}, rest),
        React.createElement(Component, { className: className, sx: sx },
            React.createElement(material_1.Stack, __assign({ alignItems: "flex-start" }, sanitizeRestProps(props)), children)),
        toolbar !== false ? toolbar : null));
};
exports.SimpleForm = SimpleForm;
exports.SimpleForm.propTypes = {
    children: prop_types_1.default.node,
    defaultValues: prop_types_1.default.oneOfType([prop_types_1.default.object, prop_types_1.default.func]),
    // @ts-ignore
    record: prop_types_1.default.object,
    redirect: prop_types_1.default.oneOfType([
        prop_types_1.default.string,
        prop_types_1.default.bool,
        prop_types_1.default.func,
    ]),
    toolbar: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.oneOf([false])]),
    validate: prop_types_1.default.func,
};
var DefaultComponent = function (_a) {
    var children = _a.children, sx = _a.sx, className = _a.className;
    return (React.createElement(material_1.CardContent, { sx: sx, className: className }, children));
};
var DefaultToolbar = React.createElement(Toolbar_1.Toolbar, null);
var sanitizeRestProps = function (_a) {
    var children = _a.children, className = _a.className, component = _a.component, criteriaMode = _a.criteriaMode, defaultValues = _a.defaultValues, delayError = _a.delayError, onSubmit = _a.onSubmit, record = _a.record, resource = _a.resource, reValidateMode = _a.reValidateMode, sx = _a.sx, toolbar = _a.toolbar, validate = _a.validate, resolver = _a.resolver, sanitizeEmptyValues = _a.sanitizeEmptyValues, shouldFocusError = _a.shouldFocusError, shouldUnregister = _a.shouldUnregister, shouldUseNativeValidation = _a.shouldUseNativeValidation, warnWhenUnsavedChanges = _a.warnWhenUnsavedChanges, props = __rest(_a, ["children", "className", "component", "criteriaMode", "defaultValues", "delayError", "onSubmit", "record", "resource", "reValidateMode", "sx", "toolbar", "validate", "resolver", "sanitizeEmptyValues", "shouldFocusError", "shouldUnregister", "shouldUseNativeValidation", "warnWhenUnsavedChanges"]);
    return props;
};
//# sourceMappingURL=SimpleForm.js.map