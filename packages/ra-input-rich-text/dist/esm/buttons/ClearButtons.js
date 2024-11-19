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
import * as React from 'react';
import { ToggleButton } from '@mui/material';
import FormatClear from '@mui/icons-material/FormatClear';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';
export var ClearButtons = function (props) {
    var editor = useTiptapEditor();
    var translate = useTranslate();
    var label = translate('ra.tiptap.clear_format', {
        _: 'Clear format',
    });
    return (React.createElement(ToggleButton, __assign({ "aria-label": label, title: label }, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), value: "clear", onClick: function () { return editor.chain().focus().unsetAllMarks().run(); } }),
        React.createElement(FormatClear, { fontSize: "inherit" })));
};
//# sourceMappingURL=ClearButtons.js.map