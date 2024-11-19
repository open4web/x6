import { useContext, useEffect, useState } from 'react';
import { TiptapEditorContext } from './TiptapEditorContext';
export var useTiptapEditor = function () {
    var _a = useState(false), ready = _a[0], setReady = _a[1];
    var editor = useContext(TiptapEditorContext);
    useEffect(function () {
        var onReady = function () {
            setReady(true);
        };
        if (editor != null) {
            // This ensure support for hot reload
            setReady(editor.isEditable);
            editor.on('create', onReady);
        }
        return function () {
            if (editor != null) {
                editor.off('create', onReady);
            }
        };
    }, [editor]);
    if (ready) {
        return editor;
    }
    return null;
};
//# sourceMappingURL=useTiptapEditor.js.map