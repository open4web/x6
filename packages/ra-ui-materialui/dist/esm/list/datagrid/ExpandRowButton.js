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
import { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate } from 'ra-core';
var ExpandRowButton = function (_a) {
    var expanded = _a.expanded, expandContentId = _a.expandContentId, props = __rest(_a, ["expanded", "expandContentId"]);
    var translate = useTranslate();
    return (React.createElement(IconButton, __assign({ "aria-label": translate(expanded ? 'ra.action.close' : 'ra.action.expand'), "aria-expanded": expanded, "aria-controls": expandContentId, tabIndex: -1, "aria-hidden": "true", component: "div" }, props, { size: "small" }),
        React.createElement(ExpandMoreIcon, { fontSize: "inherit" })));
};
export default memo(ExpandRowButton);
//# sourceMappingURL=ExpandRowButton.js.map