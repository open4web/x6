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
import * as React from 'react';
import { InferenceTypes, SelectInput } from 'react-admin';
export var FieldTypeInput = function (props) { return (React.createElement(SelectInput, __assign({ choices: INFERENCE_TYPES }, props))); };
var INFERENCE_TYPES = InferenceTypes.map(function (type) { return ({
    id: type,
    name: type,
}); });
//# sourceMappingURL=FieldTypeInput.js.map