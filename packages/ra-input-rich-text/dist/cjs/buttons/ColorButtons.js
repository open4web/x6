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
exports.ColorButtons = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var FormatColorText_1 = __importDefault(require("@mui/icons-material/FormatColorText"));
var FontDownload_1 = __importDefault(require("@mui/icons-material/FontDownload"));
var ra_core_1 = require("ra-core");
var ra_ui_materialui_1 = require("ra-ui-materialui");
var useTiptapEditor_1 = require("../useTiptapEditor");
var colors_1 = require("@mui/material/colors");
var ColorType;
(function (ColorType) {
    ColorType["FONT"] = "font";
    ColorType["BACKGROUND"] = "background";
})(ColorType || (ColorType = {}));
var ColorButtons = function (props) {
    var translate = (0, ra_core_1.useTranslate)();
    var editor = (0, useTiptapEditor_1.useTiptapEditor)();
    var _a = React.useState(false), showColorChoiceDialog = _a[0], setShowColorChoiceDialog = _a[1];
    var _b = React.useState(ColorType.FONT), colorType = _b[0], setColorType = _b[1];
    var colorLabel = translate('ra.tiptap.color', { _: 'Color' });
    var highlightLabel = translate('ra.tiptap.highlight', { _: 'Highlight' });
    var displayColorChoiceDialog = function (colorType) {
        setShowColorChoiceDialog(true);
        setColorType(colorType);
    };
    return editor ? (React.createElement(material_1.Box, { sx: { position: 'relative' } },
        React.createElement(OutsideListener, { onClick: function () { return setShowColorChoiceDialog(false); } },
            React.createElement(material_1.ToggleButtonGroup, null,
                React.createElement(material_1.ToggleButton, __assign({ "aria-label": colorLabel, title: colorLabel }, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), value: "color", onClick: function () { return displayColorChoiceDialog(ColorType.FONT); } }),
                    React.createElement(FormatColorText_1.default, { fontSize: "inherit" })),
                React.createElement(material_1.ToggleButton, __assign({ "aria-label": highlightLabel, title: highlightLabel }, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), value: "highlight", onClick: function () {
                        return displayColorChoiceDialog(ColorType.BACKGROUND);
                    } }),
                    React.createElement(FontDownload_1.default, { fontSize: "inherit" }))),
            showColorChoiceDialog && (React.createElement(ColorChoiceDialog, { editor: editor, close: function () { return setShowColorChoiceDialog(false); }, colorType: colorType }))))) : null;
};
exports.ColorButtons = ColorButtons;
var ColorChoiceDialog = function (_a) {
    var _b, _c;
    var editor = _a.editor, close = _a.close, colorType = _a.colorType;
    var theme = (0, ra_ui_materialui_1.useTheme)()[0];
    var colors = [colors_1.grey, colors_1.red, colors_1.orange, colors_1.yellow, colors_1.green, colors_1.blue, colors_1.purple];
    var shades = [900, 700, 500, 300, 100];
    var selectColor = function (color) {
        if (colorType === ColorType.FONT) {
            editor.chain().focus().setColor(color).run();
        }
        else {
            editor.chain().focus().toggleHighlight({ color: color }).run();
        }
        close();
    };
    return (React.createElement(material_1.Card, { sx: {
            position: 'absolute',
            top: 38,
            left: colorType === ColorType.FONT ? 0 : '50%',
            p: 1,
            border: "1px solid ".concat((_c = (_b = theme === null || theme === void 0 ? void 0 : theme.palette) === null || _b === void 0 ? void 0 : _b.background) === null || _c === void 0 ? void 0 : _c.default),
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: 1,
        } }, shades.map(function (shade, line) { return (React.createElement(material_1.Box, { key: "shade-".concat(shade), sx: { display: 'flex', flexDirection: 'row', gap: 1 } }, colors.map(function (color, row) { return (React.createElement(material_1.Box, { key: "color-".concat(line * colors.length + row + 1), sx: {
            width: 16,
            height: 16,
            cursor: 'pointer',
            // @ts-ignore
            backgroundColor: color[shade],
        }, 
        // @ts-ignore
        onClick: function () { return selectColor(color[shade]); } })); }))); })));
};
/**
 * Component that listens if you click outside of it
 */
var OutsideListener = function (_a) {
    var className = _a.className, onClick = _a.onClick, children = _a.children;
    var wrapperRef = React.useRef(null);
    useOutsideListener(wrapperRef, onClick);
    return (React.createElement("div", { className: className, ref: wrapperRef }, children));
};
/**
 * Hook that listens clicks outside of the passed ref
 */
var useOutsideListener = function (ref, onClick) {
    React.useEffect(function () {
        var handleClickOutside = function (event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClick();
            }
        };
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, onClick]);
};
//# sourceMappingURL=ColorButtons.js.map