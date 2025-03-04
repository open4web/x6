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
import React from 'react';
import Tab from '@mui/material/Tab';
import { useTranslate } from 'ra-core';
import { capitalize } from 'inflection';
/**
 * Single tab that selects a locale in a TranslatableFields component.
 * @see TranslatableFields
 */
export var TranslatableFieldsTab = function (props) {
    var locale = props.locale, _a = props.groupKey, groupKey = _a === void 0 ? '' : _a, rest = __rest(props, ["locale", "groupKey"]);
    var translate = useTranslate();
    return (React.createElement(Tab, __assign({ id: "translatable-header-".concat(groupKey).concat(locale), label: translate("ra.locales.".concat(groupKey).concat(locale), {
            _: capitalize(locale),
        }) }, rest)));
};
//# sourceMappingURL=TranslatableFieldsTab.js.map