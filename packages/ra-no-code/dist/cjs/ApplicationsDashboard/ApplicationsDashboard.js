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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsDashboard = void 0;
var React = __importStar(require("react"));
var styles_1 = require("@mui/material/styles");
var react_1 = require("react");
var material_1 = require("@mui/material");
var styles_2 = require("@mui/material/styles");
var react_admin_1 = require("react-admin");
var Folder_1 = __importDefault(require("@mui/icons-material/Folder"));
var NewApplicationForm_1 = require("./NewApplicationForm");
var applicationStorage_1 = require("./applicationStorage");
var PREFIX = 'ApplicationsDashboard';
var classes = {
    main: "".concat(PREFIX, "-main"),
    title: "".concat(PREFIX, "-title"),
    applications: "".concat(PREFIX, "-applications"),
    logo: "".concat(PREFIX, "-logo"),
};
var StyledContainer = (0, styles_1.styled)(material_1.Container)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.".concat(classes.main)] = {
            width: '100vw',
            height: '100vh',
            display: 'flex',
            paddingTop: theme.spacing(4),
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #00023b 0%, #00023b 50%, #313264 100%)',
        },
        _b["& .".concat(classes.title)] = {
            color: theme.palette.common.white,
            marginBottom: theme.spacing(4),
            textAlign: 'center',
        },
        _b["& .".concat(classes.applications)] = {
            marginTop: theme.spacing(4),
        },
        _b["& .".concat(classes.logo)] = {
            height: 100,
        },
        _b);
});
var defaultTheme = (0, styles_2.createTheme)(react_admin_1.defaultTheme);
var ApplicationsDashboard = function (_a) {
    var onApplicationSelected = _a.onApplicationSelected, _b = _a.theme, theme = _b === void 0 ? defaultTheme : _b;
    return (React.createElement(styles_2.ThemeProvider, { theme: (0, styles_2.createTheme)(theme) },
        React.createElement(Applications, { onApplicationSelected: onApplicationSelected })));
};
exports.ApplicationsDashboard = ApplicationsDashboard;
var Applications = function (_a) {
    var onApplicationSelected = _a.onApplicationSelected;
    var _b = (0, react_1.useState)(function () {
        return (0, applicationStorage_1.loadApplicationsFromStorage)();
    }), applications = _b[0], setApplications = _b[1];
    var handleApplicationCreated = function (application) {
        setApplications(function (previous) {
            var newApplications = __spreadArray(__spreadArray([], previous, true), [application], false);
            (0, applicationStorage_1.storeApplicationsInStorage)(newApplications);
            return newApplications;
        });
    };
    return (
    // @ts-ignore
    React.createElement(StyledContainer, { component: "main", className: classes.main },
        React.createElement("img", { className: classes.logo, src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTMxIDEzMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTMxIDEzMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiMyMjI0NTg7fQoJLnN0MXtmaWxsOiM1MTUzN0Q7fQoJLnN0MntmaWxsOiNBM0E0Qjk7fQoJLnN0M3tmaWxsOiMwMDAyM0I7fQoJLnN0NHtmaWxsOiNGRkZGRkY7fQoJLnN0NXtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KPC9zdHlsZT4KPHRpdGxlPkxvZ29fc29tYnJlX2FpPC90aXRsZT4KPGcgaWQ9IlJlY3RhbmdsZV81NiI+Cgk8Zz4KCQk8cmVjdCB4PSIxOS4xIiB5PSIxOSIgdHJhbnNmb3JtPSJtYXRyaXgoMC41IC0wLjg2NiAwLjg2NiAwLjUgLTIzLjkyMjYgODkuNTQ2KSIgY2xhc3M9InN0MCIgd2lkdGg9IjkyLjkiIGhlaWdodD0iOTIuOSIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04MywxMzAuM0wwLjgsODIuOUw0OC4yLDAuN2w4Mi4yLDQ3LjVMODMsMTMwLjN6IE0zLjUsODIuMWw3OC43LDQ1LjVsNDUuNS03OC43TDQ5LDMuNEwzLjUsODIuMXoiLz4KCTwvZz4KPC9nPgo8ZyBpZD0iUmVjdGFuZ2xlXzU2LTIiPgoJPGc+CgkJPHJlY3QgeD0iMTkiIHk9IjE5LjEiIHRyYW5zZm9ybT0ibWF0cml4KDAuODY2IC0wLjUgMC41IDAuODY2IC0yMy45Nzc3IDQxLjUyNykiIGNsYXNzPSJzdDAiIHdpZHRoPSI5Mi45IiBoZWlnaHQ9IjkyLjkiLz4KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDcuOSwxMzFMMCw0OEw4My4xLDBsNDgsODMuMUw0Ny45LDEzMXogTTQuMSw0OS4xbDQ1LDc3LjlsNzcuOS00NUw4Miw0LjFMNC4xLDQ5LjF6Ii8+Cgk8L2c+CjwvZz4KPGcgaWQ9IlJlY3RhbmdsZV81Ni0zIj4KCTxnPgoJCTxyZWN0IHg9IjE5LjEiIHk9IjE5IiBjbGFzcz0ic3QzIiB3aWR0aD0iOTIuOSIgaGVpZ2h0PSI5Mi45Ii8+CgkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTExNC41LDExNC41SDE2LjZWMTYuNWg5Ny45VjExNC41eiBNMjEuNiwxMDkuNWg4Ny45VjIxLjVIMjEuNlYxMDkuNXoiLz4KCTwvZz4KPC9nPgo8ZyBpZD0iUmEiPgoJPGcgY2xhc3M9InN0NSI+CgkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTU5LDg2LjdsLTYuNy0xOS4yaC0xLjJIMzguOXYxOS4yaC01LjZWMzguNWgxOC41YzMuNiwwLDYuMywwLjYsOC4xLDEuOGMxLjgsMS4yLDMsMi44LDMuNSw0LjgKCQkJYzAuNSwyLDAuOCw0LjYsMC44LDcuOGMwLDMuNS0wLjQsNi40LTEuMyw4LjdjLTAuOCwyLjMtMi42LDMuOS01LjMsNC44TDY1LDg2LjdINTl6IE01NS43LDYxLjZjMS4yLTAuNywyLTEuNywyLjQtMwoJCQljMC40LTEuMywwLjYtMy4yLDAuNi01LjZjMC0yLjUtMC4yLTQuMy0wLjUtNS42Yy0wLjMtMS4zLTEuMS0yLjItMi4zLTIuOWMtMS4yLTAuNy0zLTEtNS41LTFIMzguOXYxOS4xSDUwCgkJCUM1Mi41LDYyLjYsNTQuNCw2Mi4zLDU1LjcsNjEuNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNNzQuMyw4NWMtMS42LTEuNS0yLjUtNC4yLTIuNS04LjJjMC0yLjcsMC4zLTQuOCwwLjktNi4zYzAuNi0xLjUsMS42LTIuNiwzLTMuM2MxLjQtMC43LDMuNC0xLDYtMQoJCQljMS4zLDAsNS4xLDAuMSwxMS40LDAuM3YtMi40YzAtMi45LTAuMi01LTAuNy02LjJjLTAuNS0xLjItMS4zLTItMi42LTIuNGMtMS4yLTAuMy0zLjMtMC41LTYuMy0wLjVjLTEuMywwLTMsMC4xLTQuOSwwLjIKCQkJYy0yLDAuMS0zLjYsMC4zLTQuOCwwLjV2LTQuM2MzLjMtMC43LDcuMS0xLDExLjQtMWMzLjcsMCw2LjUsMC40LDguNCwxLjJjMS44LDAuOCwzLjEsMi4yLDMuOCw0LjFjMC43LDEuOSwxLDQuNywxLDguNHYyMi41aC00LjgKCQkJbC0wLjMtNWgtMC4zYy0wLjgsMi4yLTIuMiwzLjctNC4xLDQuNGMtMS45LDAuNy00LjEsMS4xLTYuNiwxLjFDNzguNiw4Ny4yLDc2LDg2LjUsNzQuMyw4NXogTTg5LjEsODJjMS4yLTAuNCwyLjItMS4yLDIuOC0yLjQKCQkJYzAuOS0xLjgsMS4zLTQuMywxLjMtNy4zdi0yaC0xMGMtMS43LDAtMywwLjItMy44LDAuNWMtMC44LDAuMy0xLjQsMC45LTEuNywxLjhjLTAuMywwLjktMC41LDIuMi0wLjUsNGMwLDEuOCwwLjIsMy4xLDAuNiwzLjkKCQkJYzAuNCwwLjgsMS4xLDEuNCwyLDEuOGMxLDAuMywyLjUsMC41LDQuNSwwLjVDODYuMiw4Mi42LDg3LjgsODIuNCw4OS4xLDgyeiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo=", alt: "react-admin logo" }),
        React.createElement(material_1.Typography, { component: "h2", variant: "h2", className: classes.title }, "Welcome to React-admin"),
        React.createElement(NewApplicationForm_1.NewApplicationForm, { applications: applications, onApplicationCreated: handleApplicationCreated }),
        applications.length > 0 && (React.createElement(material_1.Card, { className: classes.applications },
            React.createElement(material_1.List, null, applications.map(function (application) { return (React.createElement(material_1.ListItem, { key: application.name, button: true, onClick: function () {
                    return onApplicationSelected(application);
                } },
                React.createElement(material_1.ListItemAvatar, null,
                    React.createElement(material_1.Avatar, null,
                        React.createElement(Folder_1.default, null))),
                React.createElement(material_1.ListItemText, { primary: application.name, secondary: new Date(application.created_at).toLocaleDateString() }))); }))))));
};
//# sourceMappingURL=ApplicationsDashboard.js.map