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
import { Box, Card, ToggleButton, ToggleButtonGroup, } from '@mui/material';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { useTranslate } from 'ra-core';
import { useTheme } from 'ra-ui-materialui';
import { useTiptapEditor } from '../useTiptapEditor';
import { grey, red, orange, yellow, green, blue, purple, } from '@mui/material/colors';
var ColorType;
(function (ColorType) {
    ColorType["FONT"] = "font";
    ColorType["BACKGROUND"] = "background";
})(ColorType || (ColorType = {}));
export var ColorButtons = function (props) {
    var translate = useTranslate();
    var editor = useTiptapEditor();
    var _a = React.useState(false), showColorChoiceDialog = _a[0], setShowColorChoiceDialog = _a[1];
    var _b = React.useState(ColorType.FONT), colorType = _b[0], setColorType = _b[1];
    var colorLabel = translate('ra.tiptap.color', { _: 'Color' });
    var highlightLabel = translate('ra.tiptap.highlight', { _: 'Highlight' });
    var displayColorChoiceDialog = function (colorType) {
        setShowColorChoiceDialog(true);
        setColorType(colorType);
    };
    return editor ? (React.createElement(Box, { sx: { position: 'relative' } },
        React.createElement(OutsideListener, { onClick: function () { return setShowColorChoiceDialog(false); } },
            React.createElement(ToggleButtonGroup, null,
                React.createElement(ToggleButton, __assign({ "aria-label": colorLabel, title: colorLabel }, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), value: "color", onClick: function () { return displayColorChoiceDialog(ColorType.FONT); } }),
                    React.createElement(FormatColorTextIcon, { fontSize: "inherit" })),
                React.createElement(ToggleButton, __assign({ "aria-label": highlightLabel, title: highlightLabel }, props, { disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), value: "highlight", onClick: function () {
                        return displayColorChoiceDialog(ColorType.BACKGROUND);
                    } }),
                    React.createElement(FontDownloadIcon, { fontSize: "inherit" }))),
            showColorChoiceDialog && (React.createElement(ColorChoiceDialog, { editor: editor, close: function () { return setShowColorChoiceDialog(false); }, colorType: colorType }))))) : null;
};
var ColorChoiceDialog = function (_a) {
    var _b, _c;
    var editor = _a.editor, close = _a.close, colorType = _a.colorType;
    var theme = useTheme()[0];
    var colors = [grey, red, orange, yellow, green, blue, purple];
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
    return (React.createElement(Card, { sx: {
            position: 'absolute',
            top: 38,
            left: colorType === ColorType.FONT ? 0 : '50%',
            p: 1,
            border: "1px solid ".concat((_c = (_b = theme === null || theme === void 0 ? void 0 : theme.palette) === null || _b === void 0 ? void 0 : _b.background) === null || _c === void 0 ? void 0 : _c.default),
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: 1,
        } }, shades.map(function (shade, line) { return (React.createElement(Box, { key: "shade-".concat(shade), sx: { display: 'flex', flexDirection: 'row', gap: 1 } }, colors.map(function (color, row) { return (React.createElement(Box, { key: "color-".concat(line * colors.length + row + 1), sx: {
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