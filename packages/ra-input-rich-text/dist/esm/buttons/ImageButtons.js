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
import ImageIcon from '@mui/icons-material/Image';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';
export var ImageButtons = function (props) {
    var translate = useTranslate();
    var editor = useTiptapEditor();
    var label = translate('ra.tiptap.image', { _: 'Image' });
    var addImage = React.useCallback(function () {
        var url = window.prompt(translate('ra.tiptap.image_dialog', { _: 'Image URL' }));
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor, translate]);
    return editor ? (React.createElement(ToggleButton, __assign({ "aria-label": label, title: label }, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), value: "image", onClick: addImage }),
        React.createElement(ImageIcon, { fontSize: "inherit" }))) : null;
};
//# sourceMappingURL=ImageButtons.js.map