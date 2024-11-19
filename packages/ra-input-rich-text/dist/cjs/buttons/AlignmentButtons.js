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
exports.AlignmentButtons = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var material_1 = require("@mui/material");
var FormatAlignCenter_1 = __importDefault(require("@mui/icons-material/FormatAlignCenter"));
var FormatAlignLeft_1 = __importDefault(require("@mui/icons-material/FormatAlignLeft"));
var FormatAlignRight_1 = __importDefault(require("@mui/icons-material/FormatAlignRight"));
var FormatAlignJustify_1 = __importDefault(require("@mui/icons-material/FormatAlignJustify"));
var ra_core_1 = require("ra-core");
var useTiptapEditor_1 = require("../useTiptapEditor");
var AlignmentButtons = function (props) {
    var editor = (0, useTiptapEditor_1.useTiptapEditor)();
    var translate = (0, ra_core_1.useTranslate)();
    var _a = (0, react_1.useState)('left'), value = _a[0], setValue = _a[1];
    var leftLabel = translate('ra.tiptap.align_left', { _: 'Align left' });
    var rightLabel = translate('ra.tiptap.align_right', { _: 'Align right' });
    var centerLabel = translate('ra.tiptap.align_center', { _: 'Center' });
    var justifyLabel = translate('ra.tiptap.align_justify', { _: 'Justify' });
    (0, react_1.useEffect)(function () {
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
    return (React.createElement(material_1.ToggleButtonGroup, __assign({}, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), exclusive: true, onChange: handleChange, value: value }),
        React.createElement(material_1.ToggleButton, { value: "left", "aria-label": leftLabel, title: leftLabel },
            React.createElement(FormatAlignLeft_1.default, { fontSize: "inherit" })),
        React.createElement(material_1.ToggleButton, { value: "center", "aria-label": centerLabel, title: centerLabel },
            React.createElement(FormatAlignCenter_1.default, { fontSize: "inherit" })),
        React.createElement(material_1.ToggleButton, { value: "right", "aria-label": rightLabel, title: rightLabel },
            React.createElement(FormatAlignRight_1.default, { fontSize: "inherit" })),
        React.createElement(material_1.ToggleButton, { value: "justify", "aria-label": justifyLabel, title: justifyLabel },
            React.createElement(FormatAlignJustify_1.default, { fontSize: "inherit" }))));
};
exports.AlignmentButtons = AlignmentButtons;
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