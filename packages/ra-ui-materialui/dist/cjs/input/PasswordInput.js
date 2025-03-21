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
exports.PasswordInput = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var ra_core_1 = require("ra-core");
var material_1 = require("@mui/material");
var Visibility_1 = __importDefault(require("@mui/icons-material/Visibility"));
var VisibilityOff_1 = __importDefault(require("@mui/icons-material/VisibilityOff"));
var TextInput_1 = require("./TextInput");
var PasswordInput = function (props) {
    var _a = props.initiallyVisible, initiallyVisible = _a === void 0 ? false : _a, rest = __rest(props, ["initiallyVisible"]);
    var _b = (0, react_1.useState)(initiallyVisible), visible = _b[0], setVisible = _b[1];
    var translate = (0, ra_core_1.useTranslate)();
    var handleClick = function () {
        setVisible(!visible);
    };
    return (React.createElement(TextInput_1.TextInput, __assign({ type: visible ? 'text' : 'password', size: "small", InputProps: {
            endAdornment: (React.createElement(material_1.InputAdornment, { position: "end" },
                React.createElement(material_1.IconButton, { "aria-label": translate(visible
                        ? 'ra.input.password.toggle_visible'
                        : 'ra.input.password.toggle_hidden'), onClick: handleClick, size: "large" }, visible ? React.createElement(Visibility_1.default, null) : React.createElement(VisibilityOff_1.default, null)))),
        } }, rest)));
};
exports.PasswordInput = PasswordInput;
//# sourceMappingURL=PasswordInput.js.map