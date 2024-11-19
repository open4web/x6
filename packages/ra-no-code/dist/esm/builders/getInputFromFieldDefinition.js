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
import { BooleanInput, DateInput, email, ImageInput, NumberInput, ReferenceInput, TextInput, } from 'react-admin';
import { ReferenceInputChildFromDefinition } from './ReferenceInputChildFromDefinition';
export var getInputFromFieldDefinition = function (definition, resources, keyPrefix) {
    switch (definition.type) {
        case 'date':
            return (React.createElement(DateInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
        case 'email':
            return (React.createElement(TextInput, __assign({ key: getKey(keyPrefix, definition.props.source), validate: email() }, definition.props)));
        case 'boolean':
            return (React.createElement(BooleanInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
        case 'number':
            return (React.createElement(NumberInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
        case 'image':
            return (React.createElement(ImageInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
        case 'url':
            return (React.createElement(TextInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
        case 'object':
            if (Array.isArray(definition.children)) {
                return definition.children.map(function (child, index) {
                    return getInputFromFieldDefinition(child, resources, index.toString());
                });
            }
            return (React.createElement(React.Fragment, null, getInputFromFieldDefinition(definition.children, resources, undefined)));
        case 'reference':
            var referenceDefinition = definition;
            var reference = resources[definition.props.reference];
            if (reference) {
                return (React.createElement(ReferenceInput, __assign({ key: definition.props.source }, definition.props),
                    React.createElement(ReferenceInputChildFromDefinition, { definition: referenceDefinition })));
            }
            return (React.createElement(TextInput, __assign({ key: definition.props.source }, definition.props)));
        default:
            return (React.createElement(TextInput, __assign({ key: getKey(keyPrefix, definition.props.source) }, definition.props)));
    }
};
var getKey = function (prefix, source) { return (prefix ? "".concat(prefix, "_").concat(source) : source); };
//# sourceMappingURL=getInputFromFieldDefinition.js.map