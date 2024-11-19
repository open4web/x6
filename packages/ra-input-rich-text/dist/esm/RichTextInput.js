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
import { useEffect } from 'react';
import clsx from 'clsx';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useInput, useResourceContext } from 'ra-core';
import { InputHelperText, Labeled, } from 'ra-ui-materialui';
import { TiptapEditorProvider } from './TiptapEditorProvider';
import { RichTextInputToolbar } from './RichTextInputToolbar';
/**
 * A rich text editor for the react-admin that is accessible and supports translations. Based on [Tiptap](https://www.tiptap.dev/).
 * @param props The input props. Accept all common react-admin input props.
 * @param {EditorOptions} props.editorOptions The options to pass to the Tiptap editor.
 * @param {ReactNode} props.toolbar The toolbar containing the editors commands.
 *
 * @example <caption>Customizing the editors options</caption>
 * import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
 * const MyRichTextInput = (props) => (
 *     <RichTextInput
 *         toolbar={<RichTextInputToolbar size="large" />}
 *         label="Body"
 *         source="body"
 *         {...props}
 *     />
 * );
 *
 * @example <caption>Customizing the toolbar size</caption>
 * import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
 * const MyRichTextInput = (props) => (
 *     <RichTextInput
 *         toolbar={<RichTextInputToolbar size="large" />}
 *         label="Body"
 *         source="body"
 *         {...props}
 *     />
 * );
 *
 * @example <caption>Customizing the toolbar commands</caption>
 * import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
 * const MyRichTextInput = ({ size, ...props }) => (
 *     <RichTextInput
 *         toolbar={(
 *             <RichTextInputToolbar>
 *                 <LevelSelect size={size} />
 *                 <FormatButtons size={size} />
 *                 <ColorButtons size={size} />
 *                 <ListButtons size={size} />
 *                 <LinkButtons size={size} />
 *                 <ImageButtons size={size} />
 *                 <QuoteButtons size={size} />
 *                 <ClearButtons size={size} />
 *             </RichTextInputToolbar>
 *         )}
 *         label="Body"
 *         source="body"
 *         {...props}
 *     />
 * );
 */
export var RichTextInput = function (props) {
    var className = props.className, _a = props.defaultValue, defaultValue = _a === void 0 ? '' : _a, _b = props.disabled, disabled = _b === void 0 ? false : _b, _c = props.editorOptions, editorOptions = _c === void 0 ? DefaultEditorOptions : _c, fullWidth = props.fullWidth, helperText = props.helperText, label = props.label, _d = props.readOnly, readOnly = _d === void 0 ? false : _d, source = props.source, toolbar = props.toolbar;
    var resource = useResourceContext(props);
    var _e = useInput(__assign(__assign({}, props), { source: source, defaultValue: defaultValue })), id = _e.id, field = _e.field, isRequired = _e.isRequired, fieldState = _e.fieldState, isSubmitted = _e.formState.isSubmitted;
    var editor = useEditor(__assign(__assign({}, editorOptions), { editable: !disabled && !readOnly, content: field.value, editorProps: {
            attributes: {
                id: id,
            },
        } }));
    var error = fieldState.error, invalid = fieldState.invalid, isTouched = fieldState.isTouched;
    useEffect(function () {
        if (!editor)
            return;
        editor.commands.setContent(field.value, false, {
            preserveWhitespace: true,
        });
    }, [editor, field.value]);
    useEffect(function () {
        if (!editor)
            return;
        editor.setOptions({
            editable: !disabled && !readOnly,
            editorProps: {
                attributes: {
                    id: id,
                },
            },
        });
    }, [disabled, editor, readOnly, id]);
    useEffect(function () {
        if (!editor) {
            return;
        }
        var handleEditorUpdate = function () {
            if (editor.isEmpty) {
                field.onChange('');
                field.onBlur();
                return;
            }
            var html = editor.getHTML();
            field.onChange(html);
            field.onBlur();
        };
        editor.on('update', handleEditorUpdate);
        return function () {
            editor.off('update', handleEditorUpdate);
        };
    }, [editor, field]);
    return (React.createElement(Labeled, { isRequired: isRequired, label: label, id: "".concat(id, "-label"), color: (fieldState === null || fieldState === void 0 ? void 0 : fieldState.invalid) ? 'error' : undefined, source: source, resource: resource, fullWidth: fullWidth },
        React.createElement(RichTextInputContent, { className: clsx('ra-input', "ra-input-".concat(source), className), editor: editor, error: error, helperText: helperText, id: id, isTouched: isTouched, isSubmitted: isSubmitted, invalid: invalid, toolbar: toolbar || React.createElement(RichTextInputToolbar, null) })));
};
/**
 * Extracted in a separate component so that we can remove fullWidth from the props injected by Labeled
 * and avoid warnings about unknown props on Root.
 */
var RichTextInputContent = function (_a) {
    var className = _a.className, editor = _a.editor, error = _a.error, fullWidth = _a.fullWidth, helperText = _a.helperText, id = _a.id, isTouched = _a.isTouched, isSubmitted = _a.isSubmitted, invalid = _a.invalid, toolbar = _a.toolbar;
    return (React.createElement(Root, { className: className },
        React.createElement(TiptapEditorProvider, { value: editor },
            toolbar,
            React.createElement(EditorContent, { "aria-labelledby": "".concat(id, "-label"), className: classes.editorContent, editor: editor })),
        React.createElement(FormHelperText, { className: (isTouched || isSubmitted) && invalid
                ? 'ra-rich-text-input-error'
                : '', error: (isTouched || isSubmitted) && invalid },
            React.createElement(InputHelperText, { touched: isTouched || isSubmitted, error: error === null || error === void 0 ? void 0 : error.message, helperText: helperText }))));
};
export var DefaultEditorOptions = {
    extensions: [
        StarterKit,
        Underline,
        Link,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Image.configure({
            inline: true,
        }),
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
    ],
};
var PREFIX = 'RaRichTextInput';
var classes = {
    editorContent: "".concat(PREFIX, "-editorContent"),
};
var Root = styled('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        _b["& .".concat(classes.editorContent)] = {
            width: '100%',
            '& .ProseMirror': {
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.23)'
                    : 'rgba(255, 255, 255, 0.23)',
                borderRadius: theme.shape.borderRadius,
                borderStyle: 'solid',
                borderWidth: '1px',
                padding: theme.spacing(1),
                '&[contenteditable="false"], &[contenteditable="false"]:hover, &[contenteditable="false"]:focus': {
                    backgroundColor: theme.palette.action.disabledBackground,
                },
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                },
                '&:focus': {
                    backgroundColor: theme.palette.background.default,
                },
                '& p': {
                    margin: '0 0 1em 0',
                    '&:last-child': {
                        marginBottom: 0,
                    },
                },
            },
        },
        _b);
});
//# sourceMappingURL=RichTextInput.js.map