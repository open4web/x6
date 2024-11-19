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
exports.ResourceMenuItem = void 0;
var react_1 = __importStar(require("react"));
var styles_1 = require("@mui/material/styles");
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var Settings_1 = __importDefault(require("@mui/icons-material/Settings"));
var ViewList_1 = __importDefault(require("@mui/icons-material/ViewList"));
var react_router_dom_1 = require("react-router-dom");
var PREFIX = 'ResourceMenuItem';
var classes = {
    root: "".concat(PREFIX, "-root"),
    resource: "".concat(PREFIX, "-resource"),
    settings: "".concat(PREFIX, "-settings"),
};
var Root = (0, styles_1.styled)('div')(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.".concat(classes.root)] = {
            display: 'flex',
        },
        _b["& .".concat(classes.resource)] = {
            flexGrow: 1,
        },
        _b["& .".concat(classes.settings)] = {
            marginLeft: 'auto',
        },
        _b);
});
var ResourceMenuItem = function (props) {
    var resource = props.resource, rest = __rest(props, ["resource"]);
    return (react_1.default.createElement(Root, { className: classes.root },
        react_1.default.createElement(react_admin_1.MenuItemLink, __assign({ key: resource.name, className: classes.resource, to: "/".concat(resource.name), state: { _scrollToTop: true }, primaryText: (resource === null || resource === void 0 ? void 0 : resource.label) || resource.name, leftIcon: react_1.default.createElement(ViewList_1.default, null) }, rest)),
        react_1.default.createElement(material_1.IconButton, { component: NavLinkRef, to: {
                pathname: "/configure/".concat(resource.name),
            }, className: classes.settings, size: "large" },
            react_1.default.createElement(Settings_1.default, null))));
};
exports.ResourceMenuItem = ResourceMenuItem;
var NavLinkRef = (0, react_1.forwardRef)(function (props, ref) { return (react_1.default.createElement(react_router_dom_1.NavLink, __assign({ ref: ref }, props))); });
//# sourceMappingURL=ResourceMenuItem.js.map