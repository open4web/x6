"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultEditorOptions = exports.RichTextInput = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var clsx_1 = __importDefault(require("clsx"));
var react_2 = require("@tiptap/react");
var starter_kit_1 = __importDefault(require("@tiptap/starter-kit"));
var extension_underline_1 = __importDefault(require("@tiptap/extension-underline"));
var extension_link_1 = __importDefault(require("@tiptap/extension-link"));
var extension_text_align_1 = __importDefault(require("@tiptap/extension-text-align"));
var extension_image_1 = __importDefault(require("@tiptap/extension-image"));
var extension_text_style_1 = __importDefault(require("@tiptap/extension-text-style"));
var extension_color_1 = require("@tiptap/extension-color");
var extension_highlight_1 = __importDefault(require("@tiptap/extension-highlight"));
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
var ra_core_1 = require("ra-core");
var ra_ui_materialui_1 = require("ra-ui-materialui");
var TiptapEditorProvider_1 = require("./TiptapEditorProvider");
var RichTextInputToolbar_1 = require("./RichTextInputToolbar");
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
var RichTextInput = function (props) {
    var className = props.className, _a = props.defaultValue, defaultValue = _a === void 0 ? '' : _a, _b = props.disabled, disabled = _b === void 0 ? false : _b, _c = props.editorOptions, editorOptions = _c === void 0 ? exports.DefaultEditorOptions : _c, fullWidth = props.fullWidth, helperText = props.helperText, label = props.label, _d = props.readOnly, readOnly = _d === void 0 ? false : _d, source = props.source, toolbar = props.toolbar;
    var resource = (0, ra_core_1.useResourceContext)(props);
    var _e = (0, ra_core_1.useInput)(__assign(__assign({}, props), { source: source, defaultValue: defaultValue })), id = _e.id, field = _e.field, isRequired = _e.isRequired, fieldState = _e.fieldState, isSubmitted = _e.formState.isSubmitted;
    var editor = (0, react_2.useEditor)(__assign(__assign({}, editorOptions), { editable: !disabled && !readOnly, content: field.value, editorProps: {
            attributes: {
                id: id,
            },
        } }));
    var error = fieldState.error, invalid = fieldState.invalid, isTouched = fieldState.isTouched;
    (0, react_1.useEffect)(function () {
        if (!editor)
            return;
        editor.commands.setContent(field.value, false, {
            preserveWhitespace: true,
        });
    }, [editor, field.value]);
    (0, react_1.useEffect)(function () {
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
    (0, react_1.useEffect)(function () {
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
    return (React.createElement(ra_ui_materialui_1.Labeled, { isRequired: isRequired, label: label, id: "".concat(id, "-label"), color: (fieldState === null || fieldState === void 0 ? void 0 : fieldState.invalid) ? 'error' : undefined, source: source, resource: resource, fullWidth: fullWidth },
        React.createElement(RichTextInputContent, { className: (0, clsx_1.default)('ra-input', "ra-input-".concat(source), className), editor: editor, error: error, helperText: helperText, id: id, isTouched: isTouched, isSubmitted: isSubmitted, invalid: invalid, toolbar: toolbar || React.createElement(RichTextInputToolbar_1.RichTextInputToolbar, null) })));
};
exports.RichTextInput = RichTextInput;
/**
 * Extracted in a separate component so that we can remove fullWidth from the props injected by Labeled
 * and avoid warnings about unknown props on Root.
 */
var RichTextInputContent = function (_a) {
    var className = _a.className, editor = _a.editor, error = _a.error, fullWidth = _a.fullWidth, helperText = _a.helperText, id = _a.id, isTouched = _a.isTouched, isSubmitted = _a.isSubmitted, invalid = _a.invalid, toolbar = _a.toolbar;
    return (React.createElement(Root, { className: className },
        React.createElement(TiptapEditorProvider_1.TiptapEditorProvider, { value: editor },
            toolbar,
            React.createElement(react_2.EditorContent, { "aria-labelledby": "".concat(id, "-label"), className: classes.editorContent, editor: editor })),
        React.createElement(material_1.FormHelperText, { className: (isTouched || isSubmitted) && invalid
                ? 'ra-rich-text-input-error'
                : '', error: (isTouched || isSubmitted) && invalid },
            React.createElement(ra_ui_materialui_1.InputHelperText, { touched: isTouched || isSubmitted, error: error === null || error === void 0 ? void 0 : error.message, helperText: helperText }))));
};
exports.DefaultEditorOptions = {
    extensions: [
        starter_kit_1.default,
        extension_underline_1.default,
        extension_link_1.default,
        extension_text_align_1.default.configure({
            types: ['heading', 'paragraph'],
        }),
        extension_image_1.default.configure({
            inline: true,
        }),
        extension_text_style_1.default,
        extension_color_1.Color,
        extension_highlight_1.default.configure({ multicolor: true }),
    ],
};
var PREFIX = 'RaRichTextInput';
var classes = {
    editorContent: "".concat(PREFIX, "-editorContent"),
};
var Root = (0, styles_1.styled)('div', {
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