"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceConfigurationPage = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_router_1 = require("react-router");
var styles_1 = require("@mui/material/styles");
var material_1 = require("@mui/material");
var MoreVert_1 = __importDefault(require("@mui/icons-material/MoreVert"));
var react_admin_1 = require("react-admin");
var useResourceConfiguration_1 = require("./useResourceConfiguration");
var FieldConfigurationFormSection_1 = require("./FieldConfigurationFormSection");
var FieldConfigurationTab_1 = require("./FieldConfigurationTab");
var ResourceConfigurationPage = function () {
    var resource = (0, react_router_1.useParams)().resource;
    var _a = (0, useResourceConfiguration_1.useResourceConfiguration)(resource), resourceConfiguration = _a[0], actions = _a[1];
    var _b = (0, react_1.useState)(), activeField = _b[0], setActiveField = _b[1];
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
    (0, react_1.useEffect)(function () {
        if (resourceConfiguration && resourceConfiguration.fields) {
            setActiveField(resourceConfiguration.fields[0]);
        }
    }, [resourceConfiguration]);
    if (!resourceConfiguration || !activeField) {
        return null;
    }
    return (React.createElement(react_admin_1.RecordContextProvider, { value: resourceConfiguration },
        React.createElement(react_admin_1.SaveContextProvider, { value: saveContext },
            React.createElement(react_admin_1.Form, { onSubmit: save, defaultValues: resourceConfiguration },
                React.createElement(StyledCard, null,
                    React.createElement(material_1.CardHeader, { avatar: React.createElement(material_1.Avatar, null, 
                        // TODO: Add an icon selector
                        (resourceConfiguration.label ||
                            resourceConfiguration.name).substr(0, 1)), action: 
                        // TODO: Add a menu with resource related actions (delete, etc.)
                        React.createElement(material_1.IconButton, { "aria-label": "settings", size: "large" },
                            React.createElement(MoreVert_1.default, null)), title: "Configuration of ".concat(resourceConfiguration.label ||
                            resourceConfiguration.name) }),
                    React.createElement(material_1.CardContent, null,
                        React.createElement(react_admin_1.TextInput, { source: "label", defaultValue: resourceConfiguration.label ||
                                resourceConfiguration.name })),
                    React.createElement(material_1.Divider, null),
                    React.createElement("div", { className: classes.fields },
                        React.createElement(material_1.Tabs, { orientation: "vertical", value: activeField.props.source, onChange: handleTabChange, className: classes.fieldList }, resourceConfiguration.fields.map(function (field) { return (React.createElement(FieldConfigurationTab_1.FieldConfigurationTab, { key: "".concat(field.props.source, "_tab"), field: field, value: field.props.source, resource: resource })); })),
                        resourceConfiguration.fields.map(function (field, index) { return (React.createElement("div", { key: "".concat(field.props.source, "_panel"), role: "tabpanel", hidden: activeField.props.source !==
                                field.props.source, id: "nav-tabpanel-".concat(field.props.source), "aria-labelledby": "nav-tab-".concat(field.props.source) }, activeField.props.source ===
                            field.props.source ? (React.createElement(FieldConfigurationFormSection_1.FieldConfigurationFormSection, { key: field.props.source, field: field, sourcePrefix: "fields[".concat(index, "]"), className: classes.fieldPanel, resource: resource })) : null)); })),
                    React.createElement(material_1.CardActions, { className: classes.actions },
                        React.createElement(react_admin_1.SaveButton, null)))))));
};
exports.ResourceConfigurationPage = ResourceConfigurationPage;
var PREFIX = 'ResourceConfigurationPage';
var classes = {
    fields: "".concat(PREFIX, "-fields"),
    fieldList: "".concat(PREFIX, "-fieldList"),
    fieldTitle: "".concat(PREFIX, "-fieldTitle"),
    fieldPanel: "".concat(PREFIX, "-fieldPanel"),
    actions: "".concat(PREFIX, "-actions"),
};
var StyledCard = (0, styles_1.styled)(material_1.Card)(function (_a) {
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