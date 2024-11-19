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
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';
import FormatStrikethrough from '@mui/icons-material/FormatStrikethrough';
import Code from '@mui/icons-material/Code';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';
export var FormatButtons = function (props) {
    var editor = useTiptapEditor();
    var translate = useTranslate();
    var _a = useState([]), values = _a[0], setValues = _a[1];
    var boldLabel = translate('ra.tiptap.bold', {
        _: 'Bold',
    });
    var italicLabel = translate('ra.tiptap.italic', {
        _: 'Italic',
    });
    var underlineLabel = translate('ra.tiptap.underline', {
        _: 'Underline',
    });
    var strikeLabel = translate('ra.tiptap.strike', {
        _: 'Strikethrough',
    });
    var codeLabel = translate('ra.tiptap.code', {
        _: 'Code',
    });
    useEffect(function () {
        var handleUpdate = function () {
            setValues(function () {
                return FormatValues.reduce(function (acc, value) {
                    if (editor && editor.isActive(value)) {
                        acc.push(value);
                    }
                    return acc;
                }, []);
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
    var handleChange = function (event, newFormats) {
        FormatValues.forEach(function (format) {
            var shouldBeDeactivated = editor &&
                editor.isActive(format) &&
                !newFormats.includes(format);
            var shouldBeActivated = editor &&
                !editor.isActive(format) &&
                newFormats.includes(format);
            if (shouldBeDeactivated || shouldBeActivated) {
                FormatActions[format](editor);
            }
        });
    };
    return (React.createElement(ToggleButtonGroup, __assign({}, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), onChange: handleChange, value: values }),
        React.createElement(ToggleButton, { value: "bold", "aria-label": boldLabel, title: boldLabel },
            React.createElement(FormatBold, { fontSize: "inherit" })),
        React.createElement(ToggleButton, { value: "italic", "aria-label": italicLabel, title: italicLabel },
            React.createElement(FormatItalic, { fontSize: "inherit" })),
        React.createElement(ToggleButton, { value: "underline", "aria-label": underlineLabel, title: underlineLabel },
            React.createElement(FormatUnderlined, { fontSize: "inherit" })),
        React.createElement(ToggleButton, { value: "strike", "aria-label": strikeLabel, title: strikeLabel },
            React.createElement(FormatStrikethrough, { fontSize: "inherit" })),
        React.createElement(ToggleButton, { value: "code", "aria-label": codeLabel, title: codeLabel },
            React.createElement(Code, { fontSize: "inherit" }))));
};
var FormatValues = ['bold', 'italic', 'underline', 'strike', 'code'];
var FormatActions = {
    bold: function (editor) { return editor.chain().focus().toggleBold().run(); },
    italic: function (editor) { return editor.chain().focus().toggleItalic().run(); },
    underline: function (editor) {
        return editor.chain().focus().toggleUnderline().run();
    },
    strike: function (editor) { return editor.chain().focus().toggleStrike().run(); },
    code: function (editor) { return editor.chain().focus().toggleCode().run(); },
};
//# sourceMappingURL=FormatButtons.js.map