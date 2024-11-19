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
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Tab } from '@mui/material';
import { useTranslateLabel } from 'react-admin';
var PREFIX = 'FieldConfigurationTab';
var classes = {
    root: "".concat(PREFIX, "-root"),
    selected: "".concat(PREFIX, "-selected"),
};
var StyledTab = styled(Tab)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.MuiTab-root"] = {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            textTransform: 'none',
            minHeight: 0,
            fontWeight: 'normal',
        },
        _b["& .Mui-selected"] = {
            fontWeight: 'bold',
        },
        _b);
});
export var FieldConfigurationTab = function (_a) {
    var field = _a.field, resource = _a.resource, props = __rest(_a, ["field", "resource"]);
    var translateLabel = useTranslateLabel();
    var labelArgs = {
        source: field.props.source,
        resource: resource,
        label: field.props.label,
    };
    return (React.createElement(StyledTab, __assign({}, props, { key: field.props.source, label: translateLabel(labelArgs), id: "nav-tab-".concat(field.props.source), "aria-controls": "nav-tabpanel-".concat(field.props.source), classes: classes })));
};
//# sourceMappingURL=FieldConfigurationTab.js.map