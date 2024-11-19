import { useEffect, useState } from 'react';
import { useTiptapEditor } from '../useTiptapEditor';
/**
 * A hook that returns the current text selection in the editor.
 * @returns {(string|null)} The current text selection if any, or null.
 */
export var useEditorSelection = function () {
    var editor = useTiptapEditor();
    var _a = useState(editor
        ? editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)
        : null), selection = _a[0], setSelection = _a[1];
    useEffect(function () {
        var handleSelectionChange = function () {
            setSelection(editor
                ? editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)
                : null);
        };
        if (editor) {
            editor.on('selectionUpdate', handleSelectionChange);
        }
        return function () {
            if (editor) {
                editor.off('selectionUpdate', handleSelectionChange);
            }
        };
    }, [editor]);
    return selection;
};
//# sourceMappingURL=useEditorSelection.js.map