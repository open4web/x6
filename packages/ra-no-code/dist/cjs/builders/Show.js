"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowForm = exports.Show = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var ResourceConfiguration_1 = require("../ResourceConfiguration");
var getFieldFromFieldDefinition_1 = require("./getFieldFromFieldDefinition");
var Show = function () { return (react_1.default.createElement(react_admin_1.Show, null,
    react_1.default.createElement(exports.ShowForm, null))); };
exports.Show = Show;
var ShowForm = function () {
    var resource = (0, react_admin_1.useResourceContext)();
    var resources = (0, ResourceConfiguration_1.useResourcesConfiguration)()[0];
    var resourceConfiguration = (0, ResourceConfiguration_1.useResourceConfiguration)(resource)[0];
    return (react_1.default.createElement(react_admin_1.SimpleShowLayout, null, resourceConfiguration.fields
        .filter(function (definition) { return definition.views.includes('show'); })
        .map(function (definition) {
        return (0, getFieldFromFieldDefinition_1.getFieldFromFieldDefinition)(definition, resources);
    })));
};
exports.ShowForm = ShowForm;
//# sourceMappingURL=Show.js.map