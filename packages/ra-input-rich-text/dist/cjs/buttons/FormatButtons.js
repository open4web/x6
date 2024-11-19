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
exports.FormatButtons = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var material_1 = require("@mui/material");
var FormatBold_1 = __importDefault(require("@mui/icons-material/FormatBold"));
var FormatItalic_1 = __importDefault(require("@mui/icons-material/FormatItalic"));
var FormatUnderlined_1 = __importDefault(require("@mui/icons-material/FormatUnderlined"));
var FormatStrikethrough_1 = __importDefault(require("@mui/icons-material/FormatStrikethrough"));
var Code_1 = __importDefault(require("@mui/icons-material/Code"));
var ra_core_1 = require("ra-core");
var useTiptapEditor_1 = require("../useTiptapEditor");
var FormatButtons = function (props) {
    var editor = (0, useTiptapEditor_1.useTiptapEditor)();
    var translate = (0, ra_core_1.useTranslate)();
    var _a = (0, react_1.useState)([]), values = _a[0], setValues = _a[1];
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
    (0, react_1.useEffect)(function () {
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
    return (React.createElement(material_1.ToggleButtonGroup, __assign({}, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), onChange: handleChange, value: values }),
        React.createElement(material_1.ToggleButton, { value: "bold", "aria-label": boldLabel, title: boldLabel },
            React.createElement(FormatBold_1.default, { fontSize: "inherit" })),
        React.createElement(material_1.ToggleButton, { value: "italic", "aria-label": italicLabel, title: italicLabel },
            React.createElement(FormatItalic_1.default, { fontSize: "inherit" })),
        React.createElement(material_1.ToggleButton, { value: "underline", "aria-label": underlineLabel, title: underlineLabel },
            React.createElement(FormatUnderlined_1.default, { fontSize: "inherit" })),
        React.createElement(material_1.ToggleButton, { value: "strike", "aria-label": strikeLabel, title: strikeLabel },
            React.createElement(FormatStrikethrough_1.default, { fontSize: "inherit" })),
        React.createElement(material_1.ToggleButton, { value: "code", "aria-label": codeLabel, title: codeLabel },
            React.createElement(Code_1.default, { fontSize: "inherit" }))));
};
exports.FormatButtons = FormatButtons;
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