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
import { ToggleButton } from '@mui/material';
import FormatQuote from '@mui/icons-material/FormatQuote';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';
export var QuoteButtons = function (props) {
    var editor = useTiptapEditor();
    var translate = useTranslate();
    var _a = useState(false), isActive = _a[0], setIsActive = _a[1];
    var label = translate('ra.tiptap.blockquote', {
        _: 'Blockquote',
    });
    useEffect(function () {
        var handleUpdate = function () {
            setIsActive(editor && editor.isActive('blockquote'));
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
    return (React.createElement(ToggleButton, __assign({ "aria-label": label, title: label }, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), onClick: function () { return editor.chain().focus().toggleBlockquote().run(); }, selected: isActive, value: "quote" }),
        React.createElement(FormatQuote, { fontSize: "inherit" })));
};
//# sourceMappingURL=QuoteButtons.js.map