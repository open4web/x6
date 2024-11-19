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
exports.Datagrid = exports.List = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var ResourceConfiguration_1 = require("../ResourceConfiguration");
var getFieldFromFieldDefinition_1 = require("./getFieldFromFieldDefinition");
var List = function () { return (react_1.default.createElement(react_admin_1.List, null,
    react_1.default.createElement(exports.Datagrid, null))); };
exports.List = List;
var Datagrid = function (props) {
    var resource = (0, react_admin_1.useResourceContext)(props);
    var resources = (0, ResourceConfiguration_1.useResourcesConfiguration)()[0];
    var resourceConfiguration = (0, ResourceConfiguration_1.useResourceConfiguration)(resource)[0];
    return (react_1.default.createElement(react_admin_1.Datagrid, __assign({ rowClick: "edit" }, props), resourceConfiguration.fields
        .filter(function (definition) { return definition.views.includes('list'); })
        .map(function (definition) {
        return (0, getFieldFromFieldDefinition_1.getFieldFromFieldDefinition)(definition, resources);
    })));
};
exports.Datagrid = Datagrid;
//# sourceMappingURL=List.js.map