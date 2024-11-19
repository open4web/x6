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
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from 'react-query';
import { useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { useImportResourceFromCsv } from './useImportResourceFromCsv';
export var ImportResourceDialog = function (props) {
    var _a = useState(), file = _a[0], setFile = _a[1];
    var _b = useState(''), resource = _b[0], setResource = _b[1];
    var navigate = useNavigate();
    var queryClient = useQueryClient();
    var notify = useNotify();
    var handleClose = function () {
        if (props.onClose) {
            props.onClose();
        }
    };
    var _c = useImportResourceFromCsv(), parsing = _c[0], importResource = _c[1];
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
    var _d = useDropzone({
        accept: 'text/csv',
        onDrop: onDrop,
    }), getRootProps = _d.getRootProps, getInputProps = _d.getInputProps;
    var _e = getRootProps(), ref = _e.ref, rootProps = __rest(_e, ["ref"]);
    return (React.createElement(Dialog, __assign({}, props, { "aria-labelledby": "import-resource-dialog-title", "aria-describedby": "import-resource-dialog-description" }),
        React.createElement("form", { onSubmit: handleSubmit },
            React.createElement(DialogTitle, { id: "import-resource-dialog-title" }, "Import a new resource"),
            parsing ? (React.createElement(DialogContent, null,
                React.createElement(DialogContentText, { id: "alert-dialog-description" }, "Generating the user interface for the resource, please wait..."))) : (React.createElement(React.Fragment, null,
                React.createElement(React.Fragment, null,
                    React.createElement(DialogContent, __assign({}, rootProps),
                        React.createElement("input", __assign({ "aria-label": "CSV File", "aria-describedby": "#csv-description" }, getInputProps())),
                        React.createElement(DialogContentText, { id: "alert-dialog-description" }, "Welcome to react-admin no-code!"),
                        React.createElement(DialogContentText, { id: "csv-description" }, "Drop a csv file here or click here to choose a local file."))),
                !!file && (React.createElement(DialogContent, null,
                    React.createElement(TextField, { label: "Resource name", value: resource, onChange: function (event) {
                            return setResource(event.target.value);
                        }, autoFocus: true, onFocus: function (e) { return e.currentTarget.select(); } }))))),
            React.createElement(DialogActions, null,
                !!file && resource && (React.createElement(Button, { disabled: parsing, type: "submit" }, "Import")),
                React.createElement(Button, { disabled: parsing, onClick: function () { return handleClose(); } }, "Cancel")))));
};
//# sourceMappingURL=ImportResourceDialog.js.map