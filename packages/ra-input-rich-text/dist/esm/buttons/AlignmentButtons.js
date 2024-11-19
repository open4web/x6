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
import { useEffect, useState } from 'react';
import { ToggleButton, ToggleButtonGroup, } from '@mui/material';
import FormatAlignCenter from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRight from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';
export var AlignmentButtons = function (props) {
    var editor = useTiptapEditor();
    var translate = useTranslate();
    var _a = useState('left'), value = _a[0], setValue = _a[1];
    var leftLabel = translate('ra.tiptap.align_left', { _: 'Align left' });
    var rightLabel = translate('ra.tiptap.align_right', { _: 'Align right' });
    var centerLabel = translate('ra.tiptap.align_center', { _: 'Center' });
    var justifyLabel = translate('ra.tiptap.align_justify', { _: 'Justify' });
    useEffect(function () {
        var handleUpdate = function () {
            setValue(function (currentValue) {
                return AlignmentValues.reduce(function (acc, value) {
                    if (editor && editor.isActive({ textAlign: value })) {
                        return value;
                    }
                    return acc;
                }, currentValue);
            });
        };
        if (editor) {
            editor.on('update', handleUpdate);
            editor.on('selectionUpdate', handleUpdate);
        }
        return function () {
            if (editor) {
                editor.off('update', handleUpdate);
                editor.off('selectionUpdate', handleUpdate);
            }
        };
    }, [editor]);
    var handleChange = function (event, newFormat) {
        if (AlignmentActions[newFormat]) {
            AlignmentActions[newFormat](editor);
        }
    };
    return (React.createElement(ToggleButtonGroup, __assign({}, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), exclusive: true, onChange: handleChange, value: value }),
        React.createElement(ToggleButton, { value: "left", "aria-label": leftLabel, title: leftLabel },
            React.createElement(FormatAlignLeft, { fontSize: "inherit" })),
        React.createElement(ToggleButton, { value: "center", "aria-label": centerLabel, title: centerLabel },
            React.createElement(FormatAlignCenter, { fontSize: "inherit" })),
        React.createElement(ToggleButton, { value: "right", "aria-label": rightLabel, title: rightLabel },
            React.createElement(FormatAlignRight, { fontSize: "inherit" })),
        React.createElement(ToggleButton, { value: "justify", "aria-label": justifyLabel, title: justifyLabel },
            React.createElement(FormatAlignJustify, { fontSize: "inherit" }))));
};
var AlignmentValues = ['left', 'center', 'right', 'justify', 'code'];
var AlignmentActions = {
    left: function (editor) { return editor.chain().focus().setTextAlign('left').run(); },
    center: function (editor) {
        return editor.chain().focus().setTextAlign('center').run();
    },
    right: function (editor) {
        return editor.chain().focus().setTextAlign('right').run();
    },
    justify: function (editor) {
        return editor.chain().focus().setTextAlign('justify').run();
    },
};
//# sourceMappingURL=AlignmentButtons.js.map