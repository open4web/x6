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
import React from 'react';
import { BooleanField, DateField, EmailField, ImageField, NumberField, ReferenceField, TextField, UrlField, } from 'react-admin';
export var getFieldFromFieldDefinition = function (definition, resources) {
    switch (definition.type) {
        case 'date':
            return (React.createElement(DateField, __assign({ key: definition.props.source }, definition.props)));
        case 'email':
            return (React.createElement(EmailField, __assign({ key: definition.props.source }, definition.props)));
        case 'boolean':
            return (React.createElement(BooleanField, __assign({ key: definition.props.source }, definition.props)));
        case 'number':
            return (React.createElement(NumberField, __assign({ key: definition.props.source }, definition.props)));
        case 'image':
            return (React.createElement(ImageField, __assign({ key: definition.props.source }, definition.props)));
        case 'url':
            return (React.createElement(UrlField, __assign({ key: definition.props.source }, definition.props)));
        case 'reference':
            var reference = resources[definition.props.reference];
            if (reference) {
                var field = reference.fields.find(function (field) {
                    return field.props.source === definition.options.referenceField;
                });
                return (React.createElement(ReferenceField, __assign({ key: definition.props.source }, definition.props), getFieldFromFieldDefinition(field, resources)));
            }
            return (React.createElement(TextField, __assign({ key: definition.props.source }, definition.props)));
        default:
            return (React.createElement(TextField, __assign({ key: definition.props.source }, definition.props)));
    }
};
//# sourceMappingURL=getFieldFromFieldDefinition.js.map