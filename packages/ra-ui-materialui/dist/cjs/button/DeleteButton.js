"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteButton = void 0;
var React = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var ra_core_1 = require("ra-core");
var DeleteWithUndoButton_1 = require("./DeleteWithUndoButton");
var DeleteWithConfirmButton_1 = require("./DeleteWithConfirmButton");
/**
 * Button used to delete a single record. Added by default by the <Toolbar> of edit and show views.
 *
 * @typedef {Object} Props The props you can use (other props are injected if you used it in the <Toolbar>)
 * @prop {boolean} mutationMode Either 'pessimistic', 'optimistic' or 'undoable'. Determine whether the deletion uses an undo button in a notification or a confirmation dialog. Defaults to 'undoable'.
 * @prop {Object} record The current resource record
 * @prop {string} className
 * @prop {string} label Button label. Defaults to 'ra.action.delete, translated.
 * @prop {boolean} disabled Disable the button.
 * @prop {string} variant MUI variant for the button. Defaults to 'contained'.
 * @prop {ReactElement} icon Override the icon. Defaults to the Delete icon from MUI.
 *
 * @param {Props} props
 *
 * @example Usage in the <TopToolbar> of an <Edit> form
 *
 * import * as React from 'react';
 * import { Edit, DeleteButton, TopToolbar } from 'react-admin';
 *
 * const EditActions = props => {
 *     const { data, resource } = props;
 *     return (
 *         <TopToolbar>
 *             <DeleteButton
 *                 mutationMode="pessimistic" // Renders the <DeleteWithConfirmButton>
 *             />
 *         </TopToolbar>
 *     );
 * };
 *
 * const Edit = props => {
 *     return <Edit actions={<EditActions />} {...props} />;
 * };
 */
var DeleteButton = function (props) {
    var mutationMode = props.mutationMode, rest = __rest(props, ["mutationMode"]);
    var record = (0, ra_core_1.useRecordContext)(props);
    var saveContext = (0, ra_core_1.useSaveContext)(props);
    if (!record || record.id == null) {
        return null;
    }
    var finalMutationMode = mutationMode
        ? mutationMode
        : (saveContext === null || saveContext === void 0 ? void 0 : saveContext.mutationMode)
            ? saveContext.mutationMode
            : 'undoable';
    return finalMutationMode === 'undoable' ? (
    // @ts-ignore I looked for the error for one hour without finding it
    React.createElement(DeleteWithUndoButton_1.DeleteWithUndoButton, __assign({ record: record }, rest))) : (React.createElement(DeleteWithConfirmButton_1.DeleteWithConfirmButton, __assign({ 
        // @ts-ignore I looked for the error for one hour without finding it
        mutationMode: finalMutationMode, record: record }, rest)));
};
exports.DeleteButton = DeleteButton;
exports.DeleteButton.propTypes = {
    label: prop_types_1.default.string,
    mutationMode: prop_types_1.default.oneOf(['pessimistic', 'optimistic', 'undoable']),
    record: prop_types_1.default.any,
    // @ts-ignore
    redirect: prop_types_1.default.oneOfType([
        prop_types_1.default.string,
        prop_types_1.default.bool,
        prop_types_1.default.func,
    ]),
    resource: prop_types_1.default.string,
    icon: prop_types_1.default.element,
};
//# sourceMappingURL=DeleteButton.js.map