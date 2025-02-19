export var getMutationMode = function (mutationMode, undoable) {
    if (mutationMode) {
        return mutationMode;
    }
    switch (undoable) {
        case true:
            return 'undoable';
        case false:
            return 'pessimistic';
        default:
            return 'undoable';
    }
};
//# sourceMappingURL=getMutationMode.js.map