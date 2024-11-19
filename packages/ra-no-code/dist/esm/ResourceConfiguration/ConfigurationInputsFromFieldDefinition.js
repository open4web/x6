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
import React from 'react';
import { FormDataConsumer, SelectInput, } from 'react-admin';
import get from 'lodash/get';
import { useResourcesConfiguration } from './useResourcesConfiguration';
export var ConfigurationInputsFromFieldDefinition = function (_a) {
    var definition = _a.definition, sourcePrefix = _a.sourcePrefix;
    var resources = useResourcesConfiguration()[0];
    switch (definition.type) {
        case 'reference':
            return (React.createElement(React.Fragment, null,
                React.createElement(SelectInput, { source: "".concat(sourcePrefix, ".props.reference"), label: "Referenced resource", fullWidth: true, choices: Object.keys(resources).map(function (name) { return ({
                        id: name,
                        name: resources[name].label || resources[name].name,
                    }); }) }),
                React.createElement(SelectInput, { source: "".concat(sourcePrefix, ".options.selectionType"), label: "How to select the reference", fullWidth: true, choices: ReferenceSelectionChoice }),
                React.createElement(FormDataConsumer, null, function (_a) {
                    var formData = _a.formData, rest = __rest(_a, ["formData"]);
                    var resourceName = get(formData, "".concat(sourcePrefix, ".props.reference"));
                    if (!resourceName)
                        return null;
                    var resource = resources[resourceName];
                    return (React.createElement(SelectInput, __assign({ source: "".concat(sourcePrefix, ".options.referenceField"), label: "Displayed field", choices: resource.fields.map(function (field) { return ({
                            id: field.props.source,
                            name: field.props.label ||
                                field.props.source,
                        }); }) }, rest)));
                })));
        default:
            return null;
    }
};
var ReferenceSelectionChoice = [
    { id: 'select', name: 'Simple list' },
    { id: 'autocomplete', name: 'Searchable list' },
    { id: 'radio', name: 'Radio buttons' },
];
//# sourceMappingURL=ConfigurationInputsFromFieldDefinition.js.map