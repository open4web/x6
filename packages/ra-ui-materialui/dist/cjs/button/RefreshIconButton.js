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
exports.RefreshIconButton = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var prop_types_1 = __importDefault(require("prop-types"));
var Tooltip_1 = __importDefault(require("@mui/material/Tooltip"));
var IconButton_1 = __importDefault(require("@mui/material/IconButton"));
var Refresh_1 = __importDefault(require("@mui/icons-material/Refresh"));
var ra_core_1 = require("ra-core");
var RefreshIconButton = function (props) {
    var _a = props.label, label = _a === void 0 ? 'ra.action.refresh' : _a, _b = props.icon, icon = _b === void 0 ? defaultIcon : _b, onClick = props.onClick, className = props.className, rest = __rest(props, ["label", "icon", "onClick", "className"]);
    var refresh = (0, ra_core_1.useRefresh)();
    var translate = (0, ra_core_1.useTranslate)();
    var handleClick = (0, react_1.useCallback)(function (event) {
        event.preventDefault();
        refresh();
        if (typeof onClick === 'function') {
            onClick(event);
        }
    }, [refresh, onClick]);
    return (React.createElement(Tooltip_1.default, { title: label && translate(label, { _: label }) },
        React.createElement(IconButton_1.default, __assign({ "aria-label": label && translate(label, { _: label }), className: className, color: "inherit", onClick: handleClick }, rest, { size: "large" }), icon)));
};
exports.RefreshIconButton = RefreshIconButton;
var defaultIcon = React.createElement(Refresh_1.default, null);
exports.RefreshIconButton.propTypes = {
    className: prop_types_1.default.string,
    label: prop_types_1.default.string,
    icon: prop_types_1.default.element,
};
//# sourceMappingURL=RefreshIconButton.js.map