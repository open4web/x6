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
import { Edit as RaEdit, SimpleForm, useResourceContext, } from 'react-admin';
import { useResourceConfiguration, useResourcesConfiguration, } from '../ResourceConfiguration';
import { getInputFromFieldDefinition } from './getInputFromFieldDefinition';
export var Edit = function () { return (React.createElement(RaEdit, null,
    React.createElement(EditForm, null))); };
export var EditForm = function (props) {
    var resource = useResourceContext(props);
    var resources = useResourcesConfiguration()[0];
    var resourceConfiguration = useResourceConfiguration(resource)[0];
    return (React.createElement(SimpleForm, __assign({}, props), resourceConfiguration.fields
        .filter(function (definition) { return definition.views.includes('edit'); })
        .map(function (definition) {
        return getInputFromFieldDefinition(definition, resources);
    })));
};
//# sourceMappingURL=Edit.js.map