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
import { Datagrid as RaDatagrid, List as RaList, useResourceContext, } from 'react-admin';
import { useResourceConfiguration, useResourcesConfiguration, } from '../ResourceConfiguration';
import { getFieldFromFieldDefinition } from './getFieldFromFieldDefinition';
export var List = function () { return (React.createElement(RaList, null,
    React.createElement(Datagrid, null))); };
export var Datagrid = function (props) {
    var resource = useResourceContext(props);
    var resources = useResourcesConfiguration()[0];
    var resourceConfiguration = useResourceConfiguration(resource)[0];
    return (React.createElement(RaDatagrid, __assign({ rowClick: "edit" }, props), resourceConfiguration.fields
        .filter(function (definition) { return definition.views.includes('list'); })
        .map(function (definition) {
        return getFieldFromFieldDefinition(definition, resources);
    })));
};
//# sourceMappingURL=List.js.map