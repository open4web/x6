import * as React from 'react';
import { TiptapEditorContext } from './TiptapEditorContext';
export var TiptapEditorProvider = function (_a) {
    var children = _a.children, value = _a.value;
    return (React.createElement(TiptapEditorContext.Provider, { value: value }, children));
};
//# sourceMappingURL=TiptapEditorProvider.js.map