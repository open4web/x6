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
exports.ListButtons = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var material_1 = require("@mui/material");
var FormatListBulleted_1 = __importDefault(require("@mui/icons-material/FormatListBulleted"));
var FormatListNumbered_1 = __importDefault(require("@mui/icons-material/FormatListNumbered"));
var ra_core_1 = require("ra-core");
var useTiptapEditor_1 = require("../useTiptapEditor");
var ListButtons = function (props) {
    var editor = (0, useTiptapEditor_1.useTiptapEditor)();
    var translate = (0, ra_core_1.useTranslate)();
    var bulletListLabel = translate('ra.tiptap.list_bulleted', {
        _: 'Bulleted list',
    });
    var numberListLabel = translate('ra.tiptap.list_numbered', {
        _: 'Numbered list',
    });
    var _a = (0, react_1.useState)(), value = _a[0], setValue = _a[1];
    var handleChange = function (event, newFormat) {
        ListValues.forEach(function (format) {
            var shouldBeDeactivated = editor && editor.isActive(format) && newFormat !== format;
            var shouldBeActivated = editor && !editor.isActive(format) && newFormat === format;
            if (shouldBeDeactivated || shouldBeActivated) {
                ListActions[format](editor);
            }
        });
    };
    (0, react_1.useEffect)(function () {
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
    return (React.createElement(material_1.ToggleButtonGroup, __assign({}, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), exclusive: true, onChange: handleChange, value: value }),
        React.createElement(material_1.ToggleButton, { value: "bulletList", "aria-label": bulletListLabel, title: bulletListLabel },
            React.createElement(FormatListBulleted_1.default, { fontSize: "inherit" })),
        React.createElement(material_1.ToggleButton, { value: "orderedList", "aria-label": numberListLabel, title: numberListLabel },
            React.createElement(FormatListNumbered_1.default, { fontSize: "inherit" }))));
};
exports.ListButtons = ListButtons;
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