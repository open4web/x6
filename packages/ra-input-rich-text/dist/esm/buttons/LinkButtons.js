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
import InsertLink from '@mui/icons-material/InsertLink';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';
import { useEditorSelection } from './useEditorSelection';
export var LinkButtons = function (props) {
    var editor = useTiptapEditor();
    var translate = useTranslate();
    var currentTextSelection = useEditorSelection();
    var label = translate('ra.tiptap.link', {
        _: 'Add a link',
    });
    var handleClick = function () {
        if (!editor.can().setLink({ href: '' })) {
            return;
        }
        var url = window.prompt('URL');
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    };
    return (React.createElement(ToggleButton, __assign({ "aria-label": label, title: label }, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable) || !currentTextSelection, value: "link", onClick: handleClick, selected: editor && editor.isActive('link') }),
        React.createElement(InsertLink, { fontSize: "inherit" })));
};
//# sourceMappingURL=LinkButtons.js.map