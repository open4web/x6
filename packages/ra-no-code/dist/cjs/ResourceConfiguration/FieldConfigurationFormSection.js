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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldConfigurationFormSection = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var FieldTypeInput_1 = require("./FieldConfiguration/FieldTypeInput");
var FieldViewsInput_1 = require("./FieldConfiguration/FieldViewsInput");
var ConfigurationInputsFromFieldDefinition_1 = require("./ConfigurationInputsFromFieldDefinition");
var FieldConfigurationFormSection = function (props) {
    var sourcePrefix = props.sourcePrefix, field = props.field, resource = props.resource;
    var translateLabel = (0, react_admin_1.useTranslateLabel)();
    var labelArgs = {
        source: field.props.source,
        resource: resource,
        label: field.props.label,
    };
    return (React.createElement(material_1.CardContent, null,
        React.createElement(react_admin_1.TextInput, { source: "".concat(sourcePrefix, ".props.source"), label: "Source", fullWidth: true, disabled: true }),
        React.createElement(react_admin_1.TextInput, { source: "".concat(sourcePrefix, ".props.label"), label: "Label", fullWidth: true, defaultValue: translateLabel(labelArgs) }),
        React.createElement(FieldTypeInput_1.FieldTypeInput, { source: "".concat(sourcePrefix, ".type"), label: "Type", fullWidth: true }),
        React.createElement(FieldViewsInput_1.FieldViewsInput, { source: "".concat(sourcePrefix, ".views"), label: "Views", fullWidth: true }),
        React.createElement(ConfigurationInputsFromFieldDefinition_1.ConfigurationInputsFromFieldDefinition, { definition: field, sourcePrefix: sourcePrefix })));
};
exports.FieldConfigurationFormSection = FieldConfigurationFormSection;
//# sourceMappingURL=FieldConfigurationFormSection.js.map