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
import { required } from 'ra-core';
import { AdminContext, SimpleForm } from 'ra-ui-materialui';
import { RichTextInput } from './RichTextInput';
import { RichTextInputToolbar } from './RichTextInputToolbar';
import { useWatch } from 'react-hook-form';
export default { title: 'ra-input-rich-text' };
var FormInspector = function (_a) {
    var _b = _a.name, name = _b === void 0 ? 'body' : _b;
    var value = useWatch({ name: name });
    return (React.createElement("div", { style: { backgroundColor: 'lightgrey' } },
        name,
        " value in form:\u00A0",
        React.createElement("code", null,
            JSON.stringify(value),
            " (",
            typeof value,
            ")")));
};
var i18nProvider = {
    translate: function (key, options) { var _a; return (_a = options === null || options === void 0 ? void 0 : options._) !== null && _a !== void 0 ? _a : key; },
    changeLocale: function () { return Promise.resolve(); },
    getLocale: function () { return 'en'; },
};
export var Basic = function (props) { return (React.createElement(AdminContext, { i18nProvider: i18nProvider },
    React.createElement(SimpleForm, __assign({ defaultValues: { body: 'Hello World' }, onSubmit: function () { } }, props),
        React.createElement(RichTextInput, { label: "Body", source: "body" }),
        React.createElement(FormInspector, null)))); };
export var Disabled = function (props) { return (React.createElement(AdminContext, { i18nProvider: i18nProvider },
    React.createElement(SimpleForm, __assign({ defaultValues: { body: 'Hello World' }, onSubmit: function () { } }, props),
        React.createElement(RichTextInput, { label: "Body", source: "body", disabled: true }),
        React.createElement(FormInspector, null)))); };
export var Small = function (props) { return (React.createElement(AdminContext, { i18nProvider: i18nProvider },
    React.createElement(SimpleForm, __assign({ defaultValues: { body: 'Hello World' }, onSubmit: function () { } }, props),
        React.createElement(RichTextInput, { toolbar: React.createElement(RichTextInputToolbar, { size: "small" }), label: "Body", source: "body" }),
        React.createElement(FormInspector, null)))); };
export var Large = function (props) { return (React.createElement(AdminContext, { i18nProvider: i18nProvider },
    React.createElement(SimpleForm, __assign({ defaultValues: { body: 'Hello World' }, onSubmit: function () { } }, props),
        React.createElement(RichTextInput, { toolbar: React.createElement(RichTextInputToolbar, { size: "large" }), label: "Body", source: "body" }),
        React.createElement(FormInspector, null)))); };
export var FullWidth = function (props) { return (React.createElement(AdminContext, { i18nProvider: i18nProvider },
    React.createElement(SimpleForm, __assign({ defaultValues: { body: 'Hello World' }, onSubmit: function () { } }, props),
        React.createElement(RichTextInput, { toolbar: React.createElement(RichTextInputToolbar, { size: "large" }), label: "Body", source: "body", fullWidth: true }),
        React.createElement(FormInspector, null)))); };
export var Validation = function (props) { return (React.createElement(AdminContext, { i18nProvider: i18nProvider },
    React.createElement(SimpleForm, __assign({ onSubmit: function () { } }, props),
        React.createElement(RichTextInput, { label: "Body", source: "body", validate: required() }),
        React.createElement(FormInspector, null)))); };
//# sourceMappingURL=RichTextInput.stories.js.map