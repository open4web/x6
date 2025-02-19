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
import { IconButton, Tooltip } from '@mui/material';
import { useTranslate } from 'ra-core';
/**
 * An IconButton with a tooltip which ensures the tooltip is closed on click to avoid ghost tooltips
 * when the button position changes.
 */
export var IconButtonWithTooltip = function (_a) {
    var label = _a.label, onClick = _a.onClick, props = __rest(_a, ["label", "onClick"]);
    var translate = useTranslate();
    var _b = React.useState(false), open = _b[0], setOpen = _b[1];
    var handleClose = function () {
        setOpen(false);
    };
    var handleOpen = function () {
        setOpen(true);
    };
    var translatedLabel = translate(label, { _: label });
    var handleClick = function (event) {
        handleClose();
        onClick(event);
    };
    return (React.createElement(Tooltip, { title: translatedLabel, open: open, onOpen: handleOpen, onClose: handleClose },
        React.createElement(IconButton, __assign({ "aria-label": translatedLabel, onClick: handleClick }, props))));
};
//# sourceMappingURL=IconButtonWithTooltip.js.map