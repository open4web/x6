"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceOneField = void 0;
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var material_1 = require("@mui/material");
var ra_core_1 = require("ra-core");
var types_1 = require("./types");
var ReferenceField_1 = require("./ReferenceField");
/**
 * Render the related record in a one-to-one relationship
 *
 * Expects a single field as child
 *
 * @example // display the bio of the current author
 * <ReferenceOneField reference="bios" target="author_id">
 *     <TextField source="body" />
 * </ReferenceOneField>
 */
var ReferenceOneField = function (props) {
    var children = props.children, reference = props.reference, source = props.source, target = props.target, emptyText = props.emptyText, _a = props.link, link = _a === void 0 ? false : _a;
    var record = (0, ra_core_1.useRecordContext)(props);
    var createPath = (0, ra_core_1.useCreatePath)();
    var translate = (0, ra_core_1.useTranslate)();
    var _b = (0, ra_core_1.useReferenceOneFieldController)({
        record: record,
        reference: reference,
        source: source,
        target: target,
    }), isLoading = _b.isLoading, isFetching = _b.isFetching, referenceRecord = _b.referenceRecord, error = _b.error, refetch = _b.refetch;
    var resourceLinkPath = link === false
        ? false
        : createPath({
            resource: reference,
            id: referenceRecord === null || referenceRecord === void 0 ? void 0 : referenceRecord.id,
            type: typeof link === 'function'
                ? link(record, reference)
                : link,
        });
    return !record || (!isLoading && referenceRecord == null) ? (emptyText ? (react_1.default.createElement(material_1.Typography, { component: "span", variant: "body2" }, emptyText && translate(emptyText, { _: emptyText }))) : null) : (react_1.default.createElement(ra_core_1.ResourceContextProvider, { value: reference },
        react_1.default.createElement(ReferenceField_1.ReferenceFieldView, { isLoading: isLoading, isFetching: isFetching, referenceRecord: referenceRecord, resourceLinkPath: resourceLinkPath, reference: reference, refetch: refetch, error: error }, children)));
};
exports.ReferenceOneField = ReferenceOneField;
exports.ReferenceOneField.propTypes = {
    children: prop_types_1.default.node,
    className: prop_types_1.default.string,
    label: types_1.fieldPropTypes.label,
    record: prop_types_1.default.any,
    reference: prop_types_1.default.string.isRequired,
    source: prop_types_1.default.string.isRequired,
    target: prop_types_1.default.string.isRequired,
};
exports.ReferenceOneField.defaultProps = {
    source: 'id',
};
//# sourceMappingURL=ReferenceOneField.js.map