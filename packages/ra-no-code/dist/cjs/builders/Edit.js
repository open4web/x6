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
exports.EditForm = exports.Edit = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var ResourceConfiguration_1 = require("../ResourceConfiguration");
var getInputFromFieldDefinition_1 = require("./getInputFromFieldDefinition");
var Edit = function () { return (react_1.default.createElement(react_admin_1.Edit, null,
    react_1.default.createElement(exports.EditForm, null))); };
exports.Edit = Edit;
var EditForm = function (props) {
    var resource = (0, react_admin_1.useResourceContext)(props);
    var resources = (0, ResourceConfiguration_1.useResourcesConfiguration)()[0];
    var resourceConfiguration = (0, ResourceConfiguration_1.useResourceConfiguration)(resource)[0];
    return (react_1.default.createElement(react_admin_1.SimpleForm, __assign({}, props), resourceConfiguration.fields
        .filter(function (definition) { return definition.views.includes('edit'); })
        .map(function (definition) {
        return (0, getInputFromFieldDefinition_1.getInputFromFieldDefinition)(definition, resources);
    })));
};
exports.EditForm = EditForm;
//# sourceMappingURL=Edit.js.map