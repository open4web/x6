"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusForArrayInput = exports.getSelectedReferencesStatus = exports.REFERENCES_STATUS_EMPTY = exports.REFERENCES_STATUS_INCOMPLETE = exports.REFERENCES_STATUS_READY = exports.getStatusForInput = void 0;
var isMatchingReferencesError = function (matchingReferences) {
    return matchingReferences && matchingReferences.error !== undefined;
};
var getStatusForInput = function (_a) {
    var field = _a.field, matchingReferences = _a.matchingReferences, referenceRecord = _a.referenceRecord, _b = _a.translate, translate = _b === void 0 ? function (x) { return x; } : _b;
    var matchingReferencesError = isMatchingReferencesError(matchingReferences)
        ? translate(matchingReferences.error, {
            _: matchingReferences.error,
        })
        : null;
    var selectedReferenceError = field.value && !referenceRecord
        ? translate('ra.input.references.single_missing', {
            _: 'ra.input.references.single_missing',
        })
        : null;
    return {
        waiting: (field.value && selectedReferenceError && !matchingReferences) ||
            (!field.value && !matchingReferences),
        error: (field.value &&
            selectedReferenceError &&
            matchingReferencesError) ||
            (!field.value && matchingReferencesError)
            ? field.value
                ? selectedReferenceError
                : matchingReferencesError
            : null,
        warning: selectedReferenceError || matchingReferencesError,
        choices: Array.isArray(matchingReferences)
            ? matchingReferences
            : [referenceRecord].filter(function (choice) { return choice; }),
    };
};
exports.getStatusForInput = getStatusForInput;
exports.REFERENCES_STATUS_READY = 'REFERENCES_STATUS_READY';
exports.REFERENCES_STATUS_INCOMPLETE = 'REFERENCES_STATUS_INCOMPLETE';
exports.REFERENCES_STATUS_EMPTY = 'REFERENCES_STATUS_EMPTY';
var getSelectedReferencesStatus = function (field, referenceRecords) {
    return !field.value || field.value.length === referenceRecords.length
        ? exports.REFERENCES_STATUS_READY
        : referenceRecords.length > 0
            ? exports.REFERENCES_STATUS_INCOMPLETE
            : exports.REFERENCES_STATUS_EMPTY;
};
exports.getSelectedReferencesStatus = getSelectedReferencesStatus;
var getStatusForArrayInput = function (_a) {
    var field = _a.field, matchingReferences = _a.matchingReferences, referenceRecords = _a.referenceRecords, _b = _a.translate, translate = _b === void 0 ? function (x) { return x; } : _b;
    // selectedReferencesDataStatus can be "empty" (no data was found for references from input.value)
    // or "incomplete" (Not all of the reference data was found)
    // or "ready" (all references data was found or there is no references from input.value)
    var selectedReferencesDataStatus = (0, exports.getSelectedReferencesStatus)(field, referenceRecords);
    var matchingReferencesError = isMatchingReferencesError(matchingReferences)
        ? translate(matchingReferences.error, {
            _: matchingReferences.error,
        })
        : null;
    var choices = Array.isArray(matchingReferences)
        ? referenceRecords.concat(matchingReferences.filter(function (choice) {
            return referenceRecords.findIndex(function (c) { return c.id === choice.id; }) === -1;
        }))
        : referenceRecords;
    return {
        waiting: (!matchingReferences &&
            field.value &&
            selectedReferencesDataStatus === exports.REFERENCES_STATUS_EMPTY) ||
            (!matchingReferences && !field.value),
        error: matchingReferencesError &&
            (!field.value ||
                (field.value &&
                    selectedReferencesDataStatus === exports.REFERENCES_STATUS_EMPTY))
            ? translate('ra.input.references.all_missing', {
                _: 'ra.input.references.all_missing',
            })
            : null,
        warning: matchingReferencesError ||
            (field.value &&
                selectedReferencesDataStatus !== exports.REFERENCES_STATUS_READY)
            ? matchingReferencesError ||
                translate('ra.input.references.many_missing', {
                    _: 'ra.input.references.many_missing',
                })
            : null,
        choices: choices,
    };
};
exports.getStatusForArrayInput = getStatusForArrayInput;
//# sourceMappingURL=referenceDataStatus.js.map