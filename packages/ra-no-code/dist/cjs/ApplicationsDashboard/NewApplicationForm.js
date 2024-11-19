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
exports.NewApplicationForm = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var material_1 = require("@mui/material");
var NewApplicationForm = function (_a) {
    var applications = _a.applications, onApplicationCreated = _a.onApplicationCreated;
    var _b = (0, react_1.useState)(), error = _b[0], setError = _b[1];
    var handleSubmit = function (event) {
        event.preventDefault();
        var target = event.target;
        var name = target.name.value;
        if (!name) {
            return;
        }
        if (applications.some(function (application) { return application.name === name; })) {
            setError('An application with this name already exists');
            return;
        }
        onApplicationCreated({
            name: name,
            created_at: new Date(),
        });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("form", { onSubmit: handleSubmit },
            React.createElement(material_1.Card, null,
                React.createElement(material_1.CardContent, null,
                    React.createElement(material_1.Typography, { component: "h1", variant: "h5" }, "Create a new application"),
                    React.createElement(material_1.TextField, { label: "The application name", name: "name" })),
                React.createElement(material_1.CardActions, null,
                    React.createElement(material_1.Button, { size: "small", type: "submit", color: "primary" }, "Create")))),
        React.createElement(material_1.Snackbar, { open: !!error, onClose: function () { return setError(undefined); }, autoHideDuration: 6000, message: error })));
};
exports.NewApplicationForm = NewApplicationForm;
//# sourceMappingURL=NewApplicationForm.js.map