"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTiptapEditor = void 0;
var react_1 = require("react");
var TiptapEditorContext_1 = require("./TiptapEditorContext");
var useTiptapEditor = function () {
    var _a = (0, react_1.useState)(false), ready = _a[0], setReady = _a[1];
    var editor = (0, react_1.useContext)(TiptapEditorContext_1.TiptapEditorContext);
    (0, react_1.useEffect)(function () {
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
exports.useTiptapEditor = useTiptapEditor;
//# sourceMappingURL=useTiptapEditor.js.map