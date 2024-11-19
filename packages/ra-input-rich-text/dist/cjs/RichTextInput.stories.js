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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = exports.FullWidth = exports.Large = exports.Small = exports.Disabled = exports.Basic = void 0;
var React = __importStar(require("react"));
var ra_core_1 = require("ra-core");
var ra_ui_materialui_1 = require("ra-ui-materialui");
var RichTextInput_1 = require("./RichTextInput");
var RichTextInputToolbar_1 = require("./RichTextInputToolbar");
var react_hook_form_1 = require("react-hook-form");
exports.default = { title: 'ra-input-rich-text' };
var FormInspector = function (_a) {
    var _b = _a.name, name = _b === void 0 ? 'body' : _b;
    var value = (0, react_hook_form_1.useWatch)({ name: name });
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
var Basic = function (props) { return (React.createElement(ra_ui_materialui_1.AdminContext, { i18nProvider: i18nProvider },
    React.createElement(ra_ui_materialui_1.SimpleForm, __assign({ defaultValues: { body: 'Hello World' }, onSubmit: function () { } }, props),
        React.createElement(RichTextInput_1.RichTextInput, { label: "Body", source: "body" }),
        React.createElement(FormInspector, null)))); };
exports.Basic = Basic;
var Disabled = function (props) { return (React.createElement(ra_ui_materialui_1.AdminContext, { i18nProvider: i18nProvider },
    React.createElement(ra_ui_materialui_1.SimpleForm, __assign({ defaultValues: { body: 'Hello World' }, onSubmit: function () { } }, props),
        React.createElement(RichTextInput_1.RichTextInput, { label: "Body", source: "body", disabled: true }),
        React.createElement(FormInspector, null)))); };
exports.Disabled = Disabled;
var Small = function (props) { return (React.createElement(ra_ui_materialui_1.AdminContext, { i18nProvider: i18nProvider },
    React.createElement(ra_ui_materialui_1.SimpleForm, __assign({ defaultValues: { body: 'Hello World' }, onSubmit: function () { } }, props),
        React.createElement(RichTextInput_1.RichTextInput, { toolbar: React.createElement(RichTextInputToolbar_1.RichTextInputToolbar, { size: "small" }), label: "Body", source: "body" }),
        React.createElement(FormInspector, null)))); };
exports.Small = Small;
var Large = function (props) { return (React.createElement(ra_ui_materialui_1.AdminContext, { i18nProvider: i18nProvider },
    React.createElement(ra_ui_materialui_1.SimpleForm, __assign({ defaultValues: { body: 'Hello World' }, onSubmit: function () { } }, props),
        React.createElement(RichTextInput_1.RichTextInput, { toolbar: React.createElement(RichTextInputToolbar_1.RichTextInputToolbar, { size: "large" }), label: "Body", source: "body" }),
        React.createElement(FormInspector, null)))); };
exports.Large = Large;
var FullWidth = function (props) { return (React.createElement(ra_ui_materialui_1.AdminContext, { i18nProvider: i18nProvider },
    React.createElement(ra_ui_materialui_1.SimpleForm, __assign({ defaultValues: { body: 'Hello World' }, onSubmit: function () { } }, props),
        React.createElement(RichTextInput_1.RichTextInput, { toolbar: React.createElement(RichTextInputToolbar_1.RichTextInputToolbar, { size: "large" }), label: "Body", source: "body", fullWidth: true }),
        React.createElement(FormInspector, null)))); };
exports.FullWidth = FullWidth;
var Validation = function (props) { return (React.createElement(ra_ui_materialui_1.AdminContext, { i18nProvider: i18nProvider },
    React.createElement(ra_ui_materialui_1.SimpleForm, __assign({ onSubmit: function () { } }, props),
        React.createElement(RichTextInput_1.RichTextInput, { label: "Body", source: "body", validate: (0, ra_core_1.required)() }),
        React.createElement(FormInspector, null)))); };
exports.Validation = Validation;
//# sourceMappingURL=RichTextInput.stories.js.map