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
exports.getInputFromFieldDefinition = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var ReferenceInputChildFromDefinition_1 = require("./ReferenceInputChildFromDefinition");
var getInputFromFieldDefinition = function (definition, resources, keyPrefix) {
    switch (definition.type) {
        case 'date':
            return (react_1.default.createElement(react_admin_1.DateInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
        case 'email':
            return (react_1.default.createElement(react_admin_1.TextInput, __assign({ key: getKey(keyPrefix, definition.props.source), validate: (0, react_admin_1.email)() }, definition.props)));
        case 'boolean':
            return (react_1.default.createElement(react_admin_1.BooleanInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
        case 'number':
            return (react_1.default.createElement(react_admin_1.NumberInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
        case 'image':
            return (react_1.default.createElement(react_admin_1.ImageInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
        case 'url':
            return (react_1.default.createElement(react_admin_1.TextInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
        case 'object':
            if (Array.isArray(definition.children)) {
                return definition.children.map(function (child, index) {
                    return (0, exports.getInputFromFieldDefinition)(child, resources, index.toString());
                });
            }
            return (react_1.default.createElement(react_1.default.Fragment, null, (0, exports.getInputFromFieldDefinition)(definition.children, resources, undefined)));
        case 'reference':
            var referenceDefinition = definition;
            var reference = resources[definition.props.reference];
            if (reference) {
                return (react_1.default.createElement(react_admin_1.ReferenceInput, __assign({ key: definition.props.source }, definition.props),
                    react_1.default.createElement(ReferenceInputChildFromDefinition_1.ReferenceInputChildFromDefinition, { definition: referenceDefinition })));
            }
            return (react_1.default.createElement(react_admin_1.TextInput, __assign({ key: definition.props.source }, definition.props)));
        default:
            return (react_1.default.createElement(react_admin_1.TextInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
    }
};
exports.getInputFromFieldDefinition = getInputFromFieldDefinition;
var getKey = function (prefix, source) { return (prefix ? "".concat(prefix, "_").concat(source) : source); };
//# sourceMappingURL=getInputFromFieldDefinition.js.map