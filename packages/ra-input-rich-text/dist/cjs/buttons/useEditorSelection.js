"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditorSelection = void 0;
var react_1 = require("react");
var useTiptapEditor_1 = require("../useTiptapEditor");
/**
 * A hook that returns the current text selection in the editor.
 * @returns {(string|null)} The current text selection if any, or null.
 */
var useEditorSelection = function () {
    var editor = (0, useTiptapEditor_1.useTiptapEditor)();
    var _a = (0, react_1.useState)(editor
        ? editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)
        : null), selection = _a[0], setSelection = _a[1];
    (0, react_1.useEffect)(function () {
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
exports.useEditorSelection = useEditorSelection;
//# sourceMappingURL=useEditorSelection.js.map