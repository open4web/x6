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
exports.InspectorButton = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var Settings_1 = __importDefault(require("@mui/icons-material/Settings"));
var ra_core_1 = require("ra-core");
exports.InspectorButton = React.forwardRef(function (_a, ref) {
    var _b = _a.label, label = _b === void 0 ? 'ra.configurable.configureMode' : _b, _c = _a.SvgIconProps, SvgIconProps = _c === void 0 ? {} : _c, props = __rest(_a, ["label", "SvgIconProps"]);
    var _d = (0, ra_core_1.usePreferencesEditor)(), enable = _d.enable, disable = _d.disable, setPreferenceKey = _d.setPreferenceKey, isEnabled = _d.isEnabled;
    var translate = (0, ra_core_1.useTranslate)();
    var handleClick = function () {
        if (isEnabled) {
            disable();
            setPreferenceKey(null);
        }
        else {
            enable();
        }
    };
    var translatedLabel = translate(label, { _: 'Configure mode' });
    return (React.createElement(material_1.Tooltip, { title: translatedLabel },
        React.createElement(material_1.IconButton, __assign({ "aria-label": translatedLabel, onClick: handleClick, color: "inherit", ref: ref }, props),
            React.createElement(Settings_1.default, __assign({ fontSize: "inherit" }, SvgIconProps)))));
});
//# sourceMappingURL=InspectorButton.js.map