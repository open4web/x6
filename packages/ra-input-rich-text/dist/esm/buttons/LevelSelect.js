import * as React from 'react';
import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslate } from 'ra-core';
import clsx from 'clsx';
import { useTiptapEditor } from '../useTiptapEditor';
export var LevelSelect = function (props) {
    var _a;
    var translate = useTranslate();
    var editor = useTiptapEditor();
    var _b = useState(null), anchorElement = _b[0], setAnchorElement = _b[1];
    var size = props.size;
    var _c = useState(options[0]), selectedOption = _c[0], setSelectedOption = _c[1];
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
    useEffect(function () {
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
        React.createElement(List, { component: "nav", "aria-label": translate('ra.tiptap.select_level', {
                _: 'Select the level',
            }), dense: true, disablePadding: true, className: classes.list },
            React.createElement(ListItem, { button: true, "aria-haspopup": "true", "aria-controls": "level-menu", "aria-label": translate('ra.tiptap.current_level', {
                    _: 'Current level',
                }), disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable), onClick: handleClickListItem, className: clsx((_a = {},
                    _a[classes.sizeSmall] = size === 'small',
                    _a[classes.sizeLarge] = size === 'large',
                    _a)) },
                React.createElement(ListItemText, { primary: translate(selectedOption.label, {
                        _: selectedOption.defaultLabel,
                    }) }),
                React.createElement(ArrowDropDownIcon, null))),
        React.createElement(Menu, { anchorEl: anchorElement, open: Boolean(anchorElement), id: "level-menu", onClose: handleClose }, options.map(function (option, index) { return (React.createElement(MenuItem, { key: option.label, selected: option === selectedOption, onClick: function (event) {
                handleMenuItemClick(event, index);
            } }, translate(option.label, { _: option.defaultLabel }))); }))));
};
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
var Root = styled('div')(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.".concat(classes.list)] = {
            borderRadius: theme.shape.borderRadius,
            border: "1px solid ".concat(alpha(theme.palette.action.active, 0.12)),
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