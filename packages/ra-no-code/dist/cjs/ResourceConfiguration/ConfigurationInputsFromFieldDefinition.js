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
exports.ConfigurationInputsFromFieldDefinition = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var get_1 = __importDefault(require("lodash/get"));
var useResourcesConfiguration_1 = require("./useResourcesConfiguration");
var ConfigurationInputsFromFieldDefinition = function (_a) {
    var definition = _a.definition, sourcePrefix = _a.sourcePrefix;
    var resources = (0, useResourcesConfiguration_1.useResourcesConfiguration)()[0];
    switch (definition.type) {
        case 'reference':
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_admin_1.SelectInput, { source: "".concat(sourcePrefix, ".props.reference"), label: "Referenced resource", fullWidth: true, choices: Object.keys(resources).map(function (name) { return ({
                        id: name,
                        name: resources[name].label || resources[name].name,
                    }); }) }),
                react_1.default.createElement(react_admin_1.SelectInput, { source: "".concat(sourcePrefix, ".options.selectionType"), label: "How to select the reference", fullWidth: true, choices: ReferenceSelectionChoice }),
                react_1.default.createElement(react_admin_1.FormDataConsumer, null, function (_a) {
                    var formData = _a.formData, rest = __rest(_a, ["formData"]);
                    var resourceName = (0, get_1.default)(formData, "".concat(sourcePrefix, ".props.reference"));
                    if (!resourceName)
                        return null;
                    var resource = resources[resourceName];
                    return (react_1.default.createElement(react_admin_1.SelectInput, __assign({ source: "".concat(sourcePrefix, ".options.referenceField"), label: "Displayed field", choices: resource.fields.map(function (field) { return ({
                            id: field.props.source,
                            name: field.props.label ||
                                field.props.source,
                        }); }) }, rest)));
                })));
        default:
            return null;
    }
};
exports.ConfigurationInputsFromFieldDefinition = ConfigurationInputsFromFieldDefinition;
var ReferenceSelectionChoice = [
    { id: 'select', name: 'Simple list' },
    { id: 'autocomplete', name: 'Searchable list' },
    { id: 'radio', name: 'Radio buttons' },
];
//# sourceMappingURL=ConfigurationInputsFromFieldDefinition.js.map