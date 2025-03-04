"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceError = void 0;
var React = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var TextField_1 = __importDefault(require("@mui/material/TextField"));
var ReferenceError = function (_a) {
    var label = _a.label, error = _a.error;
    return (React.createElement(TextField_1.default, { error: true, disabled: true, label: label, helperText: error === null || error === void 0 ? void 0 : error.message, margin: "normal" }));
};
exports.ReferenceError = ReferenceError;
exports.ReferenceError.propTypes = {
    error: prop_types_1.default.object.isRequired,
    label: prop_types_1.default.oneOfType([
        prop_types_1.default.string,
        prop_types_1.default.element,
        prop_types_1.default.bool,
    ]),
};
//# sourceMappingURL=ReferenceError.js.map