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
exports.FormDataConsumerView = void 0;
var React = __importStar(require("react"));
var react_hook_form_1 = require("react-hook-form");
var get_1 = __importDefault(require("lodash/get"));
var warning_1 = __importDefault(require("../util/warning"));
/**
 * Get the current (edited) value of the record from the form and pass it
 * to a child function
 *
 * @example
 *
 * const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <BooleanInput source="hasEmail" />
 *             <FormDataConsumer>
 *                 {({ formData, ...rest }) => formData.hasEmail &&
 *                      <TextInput source="email" {...rest} />
 *                 }
 *             </FormDataConsumer>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example
 *
 * const OrderEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <SelectInput source="country" choices={countries} />
 *             <FormDataConsumer>
 *                 {({ formData, ...rest }) =>
 *                      <SelectInput
 *                          source="city"
 *                          choices={getCitiesFor(formData.country)}
 *                          {...rest}
 *                      />
 *                 }
 *             </FormDataConsumer>
 *         </SimpleForm>
 *     </Edit>
 * );
 */
var FormDataConsumer = function (props) {
    var formData = (0, react_hook_form_1.useWatch)();
    return React.createElement(exports.FormDataConsumerView, __assign({ formData: formData }, props));
};
var FormDataConsumerView = function (props) {
    var children = props.children, form = props.form, formData = props.formData, source = props.source, index = props.index, rest = __rest(props, ["children", "form", "formData", "source", "index"]);
    var scopedFormData = formData;
    var getSource;
    var getSourceHasBeenCalled = false;
    var ret;
    // If we have an index, we are in an iterator like component (such as the SimpleFormIterator)
    if (typeof index !== 'undefined' && source) {
        scopedFormData = (0, get_1.default)(formData, source);
        getSource = function (scopedSource) {
            getSourceHasBeenCalled = true;
            return "".concat(source, ".").concat(scopedSource);
        };
        ret = children(__assign({ formData: formData, scopedFormData: scopedFormData, getSource: getSource }, rest));
    }
    else {
        ret = children(__assign({ formData: formData }, rest));
    }
    (0, warning_1.default)(typeof index !== 'undefined' && ret && !getSourceHasBeenCalled, "You're using a FormDataConsumer inside an ArrayInput and you did not call the getSource function supplied by the FormDataConsumer component. This is required for your inputs to get the proper source.\n\n<ArrayInput source=\"users\">\n    <SimpleFormIterator>\n        <TextInput source=\"name\" />\n\n        <FormDataConsumer>\n            {({\n                formData, // The whole form data\n                scopedFormData, // The data for this item of the ArrayInput\n                getSource, // A function to get the valid source inside an ArrayInput\n                ...rest,\n            }) =>\n                scopedFormData.name ? (\n                    <SelectInput\n                        source={getSource('role')} // Will translate to \"users[0].role\"\n                        choices={[{id: 1, name: 'Admin'}, {id: 2, name: 'User'},\n                        {...rest}\n                    />\n                ) : null\n            }\n        </FormDataConsumer>\n    </SimpleFormIterator>\n</ArrayInput>");
    return ret === undefined ? null : ret;
};
exports.FormDataConsumerView = FormDataConsumerView;
exports.default = FormDataConsumer;
//# sourceMappingURL=FormDataConsumer.js.map