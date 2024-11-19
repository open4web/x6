import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { styled } from '@mui/material/styles';
import { Avatar, Card, CardActions, CardContent, CardHeader, Divider, IconButton, Tabs, } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Form, RecordContextProvider, SaveContextProvider, SaveButton, TextInput, } from 'react-admin';
import { useResourceConfiguration } from './useResourceConfiguration';
import { FieldConfigurationFormSection } from './FieldConfigurationFormSection';
import { FieldConfigurationTab } from './FieldConfigurationTab';
export var ResourceConfigurationPage = function () {
    var resource = useParams().resource;
    var _a = useResourceConfiguration(resource), resourceConfiguration = _a[0], actions = _a[1];
    var _b = useState(), activeField = _b[0], setActiveField = _b[1];
    var save = function (values) {
        actions.update(values);
    };
    var saveContext = {
        save: save,
    };
    var handleTabChange = function (event, newValue) {
        var newField = resourceConfiguration.fields.find(function (f) { return f.props.source === newValue; });
        setActiveField(newField);
    };
    useEffect(function () {
        if (resourceConfiguration && resourceConfiguration.fields) {
            setActiveField(resourceConfiguration.fields[0]);
        }
    }, [resourceConfiguration]);
    if (!resourceConfiguration || !activeField) {
        return null;
    }
    return (React.createElement(RecordContextProvider, { value: resourceConfiguration },
        React.createElement(SaveContextProvider, { value: saveContext },
            React.createElement(Form, { onSubmit: save, defaultValues: resourceConfiguration },
                React.createElement(StyledCard, null,
                    React.createElement(CardHeader, { avatar: React.createElement(Avatar, null, 
                        // TODO: Add an icon selector
                        (resourceConfiguration.label ||
                            resourceConfiguration.name).substr(0, 1)), action: 
                        // TODO: Add a menu with resource related actions (delete, etc.)
                        React.createElement(IconButton, { "aria-label": "settings", size: "large" },
                            React.createElement(MoreVertIcon, null)), title: "Configuration of ".concat(resourceConfiguration.label ||
                            resourceConfiguration.name) }),
                    React.createElement(CardContent, null,
                        React.createElement(TextInput, { source: "label", defaultValue: resourceConfiguration.label ||
                                resourceConfiguration.name })),
                    React.createElement(Divider, null),
                    React.createElement("div", { className: classes.fields },
                        React.createElement(Tabs, { orientation: "vertical", value: activeField.props.source, onChange: handleTabChange, className: classes.fieldList }, resourceConfiguration.fields.map(function (field) { return (React.createElement(FieldConfigurationTab, { key: "".concat(field.props.source, "_tab"), field: field, value: field.props.source, resource: resource })); })),
                        resourceConfiguration.fields.map(function (field, index) { return (React.createElement("div", { key: "".concat(field.props.source, "_panel"), role: "tabpanel", hidden: activeField.props.source !==
                                field.props.source, id: "nav-tabpanel-".concat(field.props.source), "aria-labelledby": "nav-tab-".concat(field.props.source) }, activeField.props.source ===
                            field.props.source ? (React.createElement(FieldConfigurationFormSection, { key: field.props.source, field: field, sourcePrefix: "fields[".concat(index, "]"), className: classes.fieldPanel, resource: resource })) : null)); })),
                    React.createElement(CardActions, { className: classes.actions },
                        React.createElement(SaveButton, null)))))));
};
var PREFIX = 'ResourceConfigurationPage';
var classes = {
    fields: "".concat(PREFIX, "-fields"),
    fieldList: "".concat(PREFIX, "-fieldList"),
    fieldTitle: "".concat(PREFIX, "-fieldTitle"),
    fieldPanel: "".concat(PREFIX, "-fieldPanel"),
    actions: "".concat(PREFIX, "-actions"),
};
var StyledCard = styled(Card)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(classes.fields)] = {
            display: 'flex',
        },
        _b["& .".concat(classes.fieldList)] = {
            backgroundColor: theme.palette.background.default,
        },
        _b["& .".concat(classes.fieldTitle)] = {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            textTransform: 'none',
            minHeight: 0,
        },
        _b["& .".concat(classes.fieldPanel)] = {
            flexGrow: 1,
        },
        _b["& .".concat(classes.actions)] = {
            backgroundColor: theme.palette.background.default,
        },
        _b);
});
//# sourceMappingURL=ResourceConfiguration.js.map