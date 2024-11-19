import { ReactElement, ReactNode } from 'react';
import { Editor, EditorOptions } from '@tiptap/react';
import { CommonInputProps, LabeledProps } from 'ra-ui-materialui';
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
export declare const RichTextInput: (props: RichTextInputProps) => JSX.Element;
export declare const DefaultEditorOptions: {
    extensions: (import("@tiptap/react").Extension<import("@tiptap/starter-kit").StarterKitOptions, any> | import("@tiptap/react").Mark<import("@tiptap/extension-underline").UnderlineOptions, any> | import("@tiptap/react").Node<import("@tiptap/extension-image").ImageOptions, any> | import("@tiptap/react").Extension<import("@tiptap/extension-color").ColorOptions, any>)[];
};
export declare type RichTextInputProps = CommonInputProps & Omit<LabeledProps, 'children'> & {
    disabled?: boolean;
    readOnly?: boolean;
    editorOptions?: Partial<EditorOptions>;
    toolbar?: ReactNode;
};
export declare type RichTextInputContentProps = {
    className?: string;
    editor?: Editor;
    error?: any;
    fullWidth?: boolean;
    helperText?: string | ReactElement | false;
    id: string;
    isTouched: boolean;
    isSubmitted: boolean;
    invalid: boolean;
    toolbar?: ReactNode;
};
//# sourceMappingURL=RichTextInput.d.ts.map