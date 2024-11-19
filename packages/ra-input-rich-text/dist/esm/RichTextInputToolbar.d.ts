import { ReactNode } from 'react';
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
export declare const RichTextInputToolbar: (props: RichTextInputToolbarProps) => JSX.Element;
export declare type RichTextInputToolbarProps = {
    children?: ReactNode;
    size?: 'small' | 'medium' | 'large';
};
//# sourceMappingURL=RichTextInputToolbar.d.ts.map