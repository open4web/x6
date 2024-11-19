"use strict";
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
exports.LevelSelect = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
var ArrowDropDown_1 = __importDefault(require("@mui/icons-material/ArrowDropDown"));
var ra_core_1 = require("ra-core");
var clsx_1 = __importDefault(require("clsx"));
var useTiptapEditor_1 = require("../useTiptapEditor");
var LevelSelect = function (props) {
    var _a;
    var translate = (0, ra_core_1.useTranslate)();
    var editor = (0, useTiptapEditor_1.useTiptapEditor)();
    var _b = (0, react_1.useState)(null), anchorElement = _b[0], setAnchorElement = _b[1];
    var size = props.size;
    var _c = (0, react_1.useState)(options[0]), selectedOption = _c[0], setSelectedOption = _c[1];
    var handleMenuItemClick = function (event, index) {
        setAnchorElement(null);
        var selectedItem = options[index];
        if (selectedItem.value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        }
        else if (selectedItem.value === 'heading') {
            editor
                .chain()
                .focus()
                .setHeading({ level: selectedItem.level })
                .run();
        }
    };
    var handleClickListItem = function (event) {
        setAnchorElement(event.currentTarget);
    };
    var handleClose = function (event) {
        setAnchorElement(null);
    };
    (0, react_1.useEffect)(function () {
        var handleUpdate = function () {
            setSelectedOption(function (currentOption) {
                return options.reduce(function (acc, option) {
                    if (editor) {
                        if (option.value === 'paragraph' &&
                            editor.isActive('paragraph')) {
                            return option;
                        }
                        if (editor.isActive('heading', {
                            level: option.level,
                        })) {
                            return option;
                        }
                    }
                    return acc;
                }, currentOption);
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
    return (React.createElement(Root, null,
        React.createElement(material_1.List, { component: "nav", "aria-label": translate('ra.tiptap.select_level', {
                _: 'Select the level',
            }), dense: true, disablePadding: true, className: classes.list },
            React.createElement(material_1.ListItem, { button: true, "aria-haspopup": "true", "aria-controls": "level-menu", "aria-label": translate('ra.tiptap.current_level', {
                    _: 'Current level',
                }), disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), onClick: handleClickListItem, className: (0, clsx_1.default)((_a = {},
                    _a[classes.sizeSmall] = size === 'small',
                    _a[classes.sizeLarge] = size === 'large',
                    _a)) },
                React.createElement(material_1.ListItemText, { primary: translate(selectedOption.label, {
                        _: selectedOption.defaultLabel,
                    }) }),
                React.createElement(ArrowDropDown_1.default, null))),
        React.createElement(material_1.Menu, { anchorEl: anchorElement, open: Boolean(anchorElement), id: "level-menu", onClose: handleClose }, options.map(function (option, index) { return (React.createElement(material_1.MenuItem, { key: option.label, selected: option === selectedOption, onClick: function (event) {
                handleMenuItemClick(event, index);
            } }, translate(option.label, { _: option.defaultLabel }))); }))));
};
exports.LevelSelect = LevelSelect;
var options = [
    {
        label: 'ra.tiptap.paragraph',
        defaultLabel: 'Normal',
        value: 'paragraph',
    },
    {
        label: 'ra.tiptap.heading1',
        defaultLabel: 'Heading 1',
        value: 'heading',
        level: 1,
    },
    {
        label: 'ra.tiptap.heading2',
        defaultLabel: 'Heading 2',
        value: 'heading',
        level: 2,
    },
    {
        label: 'ra.tiptap.heading3',
        defaultLabel: 'Heading 3',
        value: 'heading',
        level: 3,
    },
    {
        label: 'ra.tiptap.heading4',
        defaultLabel: 'Heading 4',
        value: 'heading',
        level: 4,
    },
    {
        label: 'ra.tiptap.heading5',
        defaultLabel: 'Heading 5',
        value: 'heading',
        level: 5,
    },
    {
        label: 'ra.tiptap.heading6',
        defaultLabel: 'Heading 6',
        value: 'heading',
        level: 6,
    },
];
var PREFIX = 'RaRichTextInputLevelSelect';
var classes = {
    list: "".concat(PREFIX, "-list"),
    sizeSmall: "".concat(PREFIX, "-sizeSmall"),
    sizeLarge: "".concat(PREFIX, "-sizeLarge"),
};
var Root = (0, styles_1.styled)('div')(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.".concat(classes.list)] = {
            borderRadius: theme.shape.borderRadius,
            border: "1px solid ".concat((0, styles_1.alpha)(theme.palette.action.active, 0.12)),
        },
        _b["& .".concat(classes.sizeSmall)] = {
            paddingTop: 1,
            paddingBottom: 1,
            '& .MuiTypography-root': {
                fontSize: theme.typography.pxToRem(13),
            },
        },
        _b["& .".concat(classes.sizeLarge)] = {
            paddingTop: 8,
            paddingBottom: 8,
            '& .MuiTypography-root': {
                fontSize: theme.typography.pxToRem(15),
            },
        },
        _b);
});
//# sourceMappingURL=LevelSelect.js.map