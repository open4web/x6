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
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import FormatListNumbered from '@mui/icons-material/FormatListNumbered';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';
export var ListButtons = function (props) {
    var editor = useTiptapEditor();
    var translate = useTranslate();
    var bulletListLabel = translate('ra.tiptap.list_bulleted', {
        _: 'Bulleted list',
    });
    var numberListLabel = translate('ra.tiptap.list_numbered', {
        _: 'Numbered list',
    });
    var _a = useState(), value = _a[0], setValue = _a[1];
    var handleChange = function (event, newFormat) {
        ListValues.forEach(function (format) {
            var shouldBeDeactivated = editor && editor.isActive(format) && newFormat !== format;
            var shouldBeActivated = editor && !editor.isActive(format) && newFormat === format;
            if (shouldBeDeactivated || shouldBeActivated) {
                ListActions[format](editor);
            }
        });
    };
    useEffect(function () {
        var handleUpdate = function () {
            setValue(function () {
                return ListValues.reduce(function (acc, value) {
                    if (editor && editor.isActive(value)) {
                        return value;
                    }
                    return acc;
                }, undefined);
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
    return (React.createElement(ToggleButtonGroup, __assign({}, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), exclusive: true, onChange: handleChange, value: value }),
        React.createElement(ToggleButton, { value: "bulletList", "aria-label": bulletListLabel, title: bulletListLabel },
            React.createElement(FormatListBulleted, { fontSize: "inherit" })),
        React.createElement(ToggleButton, { value: "orderedList", "aria-label": numberListLabel, title: numberListLabel },
            React.createElement(FormatListNumbered, { fontSize: "inherit" }))));
};
var ListValues = ['bulletList', 'orderedList'];
var ListActions = {
    bulletList: function (editor) {
        return editor.chain().focus().toggleBulletList().run();
    },
    orderedList: function (editor) {
        return editor.chain().focus().toggleOrderedList().run();
    },
};
//# sourceMappingURL=ListButtons.js.map