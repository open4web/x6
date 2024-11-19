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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var Menu_1 = require("./Menu");
var Appbar_1 = require("./Appbar");
var Layout = function (props) { return (react_1.default.createElement(react_admin_1.Layout, __assign({}, props, { appBar: Appbar_1.AppBar, menu: Menu_1.Menu }))); };
exports.Layout = Layout;
//# sourceMappingURL=Layout.js.map