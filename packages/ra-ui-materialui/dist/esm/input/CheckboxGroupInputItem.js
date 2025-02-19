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
var _a;
import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useChoices } from 'ra-core';
export var CheckboxGroupInputItem = function (props) {
    var id = props.id, choice = props.choice, className = props.className, fullWidth = props.fullWidth, onChange = props.onChange, optionText = props.optionText, optionValue = props.optionValue, options = props.options, translateChoice = props.translateChoice, value = props.value, labelPlacement = props.labelPlacement, rest = __rest(props, ["id", "choice", "className", "fullWidth", "onChange", "optionText", "optionValue", "options", "translateChoice", "value", "labelPlacement"]);
    var _a = useChoices({
        optionText: optionText,
        optionValue: optionValue,
        translateChoice: translateChoice,
    }), getChoiceText = _a.getChoiceText, getChoiceValue = _a.getChoiceValue;
    var choiceName = getChoiceText(choice);
    return (React.createElement(StyledFormControlLabel, { htmlFor: "".concat(id, "_").concat(getChoiceValue(choice)), key: getChoiceValue(choice), onChange: onChange, className: className, control: React.createElement(Checkbox, __assign({ id: "".concat(id, "_").concat(getChoiceValue(choice)), color: "primary", className: CheckboxGroupInputItemClasses.checkbox, checked: value
                ? value.find(function (v) { return v == getChoiceValue(choice); }) !== // eslint-disable-line eqeqeq
                    undefined
                : false, value: String(getChoiceValue(choice)) }, options, rest)), label: choiceName, labelPlacement: labelPlacement }));
};
var PREFIX = 'RaCheckboxGroupInputItem';
export var CheckboxGroupInputItemClasses = {
    checkbox: "".concat(PREFIX, "-checkbox"),
};
var StyledFormControlLabel = styled(FormControlLabel, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})((_a = {},
    _a["& .".concat(CheckboxGroupInputItemClasses.checkbox)] = {
        height: 32,
    },
    _a));
//# sourceMappingURL=CheckboxGroupInputItem.js.map