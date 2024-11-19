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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { AlignmentButtons, ClearButtons, FormatButtons, LevelSelect, ListButtons, LinkButtons, QuoteButtons, ImageButtons, ColorButtons, } from './buttons';
/**
 * A toolbar for the <RichTextInput>.
 * @param props The toolbar props.
 * @param {ReactNode} props.children The toolbar children, usually many <ToggleButton>.
 * @param {'small' | 'medium' | 'large'} props.size The default size to apply to the **default** children.
 *
 * @example <caption>Customizing the size</caption>
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
 * @example <caption>Customizing the children</caption>
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
export var RichTextInputToolbar = function (props) {
    var _a = props.size, size = _a === void 0 ? 'medium' : _a, _b = props.children, children = _b === void 0 ? (React.createElement(React.Fragment, null,
        React.createElement(LevelSelect, { size: size }),
        React.createElement(FormatButtons, { size: size }),
        React.createElement(ColorButtons, { size: size }),
        React.createElement(AlignmentButtons, { size: size }),
        React.createElement(ListButtons, { size: size }),
        React.createElement(LinkButtons, { size: size }),
        React.createElement(ImageButtons, { size: size }),
        React.createElement(QuoteButtons, { size: size }),
        React.createElement(ClearButtons, { size: size }))) : _b, rest = __rest(props, ["size", "children"]);
    return (React.createElement(Root, __assign({ className: classes.root }, rest), children));
};
var PREFIX = 'RaRichTextInputToolbar';
var classes = {
    root: "".concat(PREFIX, "-root"),
};
var Root = styled('div')(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.".concat(classes.root)] = {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            '& > *': {
                marginRight: theme.spacing(1),
                marginBottom: theme.spacing(1),
            },
            '& > *:last-child': {
                marginRight: 0,
            },
        },
        _b);
});
//# sourceMappingURL=RichTextInputToolbar.js.map