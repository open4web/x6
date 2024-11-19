import * as React from 'react';
import { useState } from 'react';
import { Button, Card, CardActions, CardContent, Snackbar, TextField, Typography, } from '@mui/material';
export var NewApplicationForm = function (_a) {
    var applications = _a.applications, onApplicationCreated = _a.onApplicationCreated;
    var _b = useState(), error = _b[0], setError = _b[1];
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
            React.createElement(Card, null,
                React.createElement(CardContent, null,
                    React.createElement(Typography, { component: "h1", variant: "h5" }, "Create a new application"),
                    React.createElement(TextField, { label: "The application name", name: "name" })),
                React.createElement(CardActions, null,
                    React.createElement(Button, { size: "small", type: "submit", color: "primary" }, "Create")))),
        React.createElement(Snackbar, { open: !!error, onClose: function () { return setError(undefined); }, autoHideDuration: 6000, message: error })));
};
//# sourceMappingURL=NewApplicationForm.js.map