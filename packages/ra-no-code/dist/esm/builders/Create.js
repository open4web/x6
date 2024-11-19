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
import { Create as RaCreate, SimpleForm, useResourceContext, } from 'react-admin';
import { getInputFromFieldDefinition } from './getInputFromFieldDefinition';
import { useResourceConfiguration, useResourcesConfiguration, } from '../ResourceConfiguration';
export var Create = function () { return (React.createElement(RaCreate, null,
    React.createElement(CreateForm, null))); };
export var CreateForm = function (props) {
    var resource = useResourceContext(props);
    var resources = useResourcesConfiguration()[0];
    var resourceConfiguration = useResourceConfiguration(resource)[0];
    return (React.createElement(SimpleForm, __assign({}, props), resourceConfiguration.fields
        .filter(function (definition) { return definition.views.includes('create'); })
        .map(function (definition) {
        return getInputFromFieldDefinition(definition, resources);
    })));
};
//# sourceMappingURL=Create.js.map