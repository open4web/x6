import React from 'react';
import { Show as RaShow, SimpleShowLayout, useResourceContext, } from 'react-admin';
import { useResourceConfiguration, useResourcesConfiguration, } from '../ResourceConfiguration';
import { getFieldFromFieldDefinition } from './getFieldFromFieldDefinition';
export var Show = function () { return (React.createElement(RaShow, null,
    React.createElement(ShowForm, null))); };
export var ShowForm = function () {
    var resource = useResourceContext();
    var resources = useResourcesConfiguration()[0];
    var resourceConfiguration = useResourceConfiguration(resource)[0];
    return (React.createElement(SimpleShowLayout, null, resourceConfiguration.fields
        .filter(function (definition) { return definition.views.includes('show'); })
        .map(function (definition) {
        return getFieldFromFieldDefinition(definition, resources);
    })));
};
//# sourceMappingURL=Show.js.map