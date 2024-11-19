import * as React from 'react';
import { TextInput, useTranslateLabel } from 'react-admin';
import { CardContent } from '@mui/material';
import { FieldTypeInput } from './FieldConfiguration/FieldTypeInput';
import { FieldViewsInput } from './FieldConfiguration/FieldViewsInput';
import { ConfigurationInputsFromFieldDefinition } from './ConfigurationInputsFromFieldDefinition';
export var FieldConfigurationFormSection = function (props) {
    var sourcePrefix = props.sourcePrefix, field = props.field, resource = props.resource;
    var translateLabel = useTranslateLabel();
    var labelArgs = {
        source: field.props.source,
        resource: resource,
        label: field.props.label,
    };
    return (React.createElement(CardContent, null,
        React.createElement(TextInput, { source: "".concat(sourcePrefix, ".props.source"), label: "Source", fullWidth: true, disabled: true }),
        React.createElement(TextInput, { source: "".concat(sourcePrefix, ".props.label"), label: "Label", fullWidth: true, defaultValue: translateLabel(labelArgs) }),
        React.createElement(FieldTypeInput, { source: "".concat(sourcePrefix, ".type"), label: "Type", fullWidth: true }),
        React.createElement(FieldViewsInput, { source: "".concat(sourcePrefix, ".views"), label: "Views", fullWidth: true }),
        React.createElement(ConfigurationInputsFromFieldDefinition, { definition: field, sourcePrefix: sourcePrefix })));
};
//# sourceMappingURL=FieldConfigurationFormSection.js.map