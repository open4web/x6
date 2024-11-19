"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportResourceDialog = void 0;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var react_dropzone_1 = require("react-dropzone");
var react_query_1 = require("react-query");
var react_admin_1 = require("react-admin");
var react_router_dom_1 = require("react-router-dom");
var useImportResourceFromCsv_1 = require("./useImportResourceFromCsv");
var ImportResourceDialog = function (props) {
    var _a = (0, react_1.useState)(), file = _a[0], setFile = _a[1];
    var _b = (0, react_1.useState)(''), resource = _b[0], setResource = _b[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var queryClient = (0, react_query_1.useQueryClient)();
    var notify = (0, react_admin_1.useNotify)();
    var handleClose = function () {
        if (props.onClose) {
            props.onClose();
        }
    };
    var _c = (0, useImportResourceFromCsv_1.useImportResourceFromCsv)(), parsing = _c[0], importResource = _c[1];
    var onDrop = function (acceptedFiles) {
        if (acceptedFiles.length > 0) {
            var acceptedFile = acceptedFiles[0];
            if (acceptedFile) {
                setFile(acceptedFile);
                setResource(acceptedFile.name.split('.')[0]);
            }
        }
    };
    var handleSubmit = function (event) {
        event.preventDefault();
        if (resource && file) {
            importResource(resource, file)
                .then(function (_a) {
                var resource = _a.resource, resourceAlreadyExists = _a.resourceAlreadyExists;
                handleClose();
                navigate("/".concat(resource));
                if (resourceAlreadyExists) {
                    // If we imported more records for an existing resource,
                    // we must refresh the list
                    queryClient.refetchQueries([resource, 'getList']);
                }
            })
                .catch(function () {
                notify('An error occured while handling this CSV file');
            });
        }
    };
    var _d = (0, react_dropzone_1.useDropzone)({
        accept: 'text/csv',
        onDrop: onDrop,
    }), getRootProps = _d.getRootProps, getInputProps = _d.getInputProps;
    var _e = getRootProps(), ref = _e.ref, rootProps = __rest(_e, ["ref"]);
    return (react_1.default.createElement(material_1.Dialog, __assign({}, props, { "aria-labelledby": "import-resource-dialog-title", "aria-describedby": "import-resource-dialog-description" }),
        react_1.default.createElement("form", { onSubmit: handleSubmit },
            react_1.default.createElement(material_1.DialogTitle, { id: "import-resource-dialog-title" }, "Import a new resource"),
            parsing ? (react_1.default.createElement(material_1.DialogContent, null,
                react_1.default.createElement(material_1.DialogContentText, { id: "alert-dialog-description" }, "Generating the user interface for the resource, please wait..."))) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(material_1.DialogContent, __assign({}, rootProps),
                        react_1.default.createElement("input", __assign({ "aria-label": "CSV File", "aria-describedby": "#csv-description" }, getInputProps())),
                        react_1.default.createElement(material_1.DialogContentText, { id: "alert-dialog-description" }, "Welcome to react-admin no-code!"),
                        react_1.default.createElement(material_1.DialogContentText, { id: "csv-description" }, "Drop a csv file here or click here to choose a local file."))),
                !!file && (react_1.default.createElement(material_1.DialogContent, null,
                    react_1.default.createElement(material_1.TextField, { label: "Resource name", value: resource, onChange: function (event) {
                            return setResource(event.target.value);
                        }, autoFocus: true, onFocus: function (e) { return e.currentTarget.select(); } }))))),
            react_1.default.createElement(material_1.DialogActions, null,
                !!file && resource && (react_1.default.createElement(material_1.Button, { disabled: parsing, type: "submit" }, "Import")),
                react_1.default.createElement(material_1.Button, { disabled: parsing, onClick: function () { return handleClose(); } }, "Cancel")))));
};
exports.ImportResourceDialog = ImportResourceDialog;
//# sourceMappingURL=ImportResourceDialog.js.map