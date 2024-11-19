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
exports.getFieldFromFieldDefinition = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var getFieldFromFieldDefinition = function (definition, resources) {
    switch (definition.type) {
        case 'date':
            return (react_1.default.createElement(react_admin_1.DateField, __assign({ key: definition.props.source }, definition.props)));
        case 'email':
            return (react_1.default.createElement(react_admin_1.EmailField, __assign({ key: definition.props.source }, definition.props)));
        case 'boolean':
            return (react_1.default.createElement(react_admin_1.BooleanField, __assign({ key: definition.props.source }, definition.props)));
        case 'number':
            return (react_1.default.createElement(react_admin_1.NumberField, __assign({ key: definition.props.source }, definition.props)));
        case 'image':
            return (react_1.default.createElement(react_admin_1.ImageField, __assign({ key: definition.props.source }, definition.props)));
        case 'url':
            return (react_1.default.createElement(react_admin_1.UrlField, __assign({ key: definition.props.source }, definition.props)));
        case 'reference':
            var reference = resources[definition.props.reference];
            if (reference) {
                var field = reference.fields.find(function (field) {
                    return field.props.source === definition.options.referenceField;
                });
                return (react_1.default.createElement(react_admin_1.ReferenceField, __assign({ key: definition.props.source }, definition.props), (0, exports.getFieldFromFieldDefinition)(field, resources)));
            }
            return (react_1.default.createElement(react_admin_1.TextField, __assign({ key: definition.props.source }, definition.props)));
        default:
            return (react_1.default.createElement(react_admin_1.TextField, __assign({ key: definition.props.source }, definition.props)));
    }
};
exports.getFieldFromFieldDefinition = getFieldFromFieldDefinition;
//# sourceMappingURL=getFieldFromFieldDefinition.js.map