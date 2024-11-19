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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldDefinitionsFromRecords = void 0;
var react_admin_1 = require("react-admin");
var getFieldDefinitionsFromRecords = function (records) {
    var values = (0, react_admin_1.getValuesFromRecords)(records);
    return Object.keys(values).map(function (key) {
        var inferedDefinition = (0, react_admin_1.inferTypeFromValues)(key, values[key]);
        return __assign(__assign({}, inferedDefinition), { options: inferedDefinition.type === 'reference'
                ? {
                    referenceField: 'id',
                    selectionType: 'select',
                }
                : undefined, views: ['list', 'create', 'edit', 'show'] });
    });
};
exports.getFieldDefinitionsFromRecords = getFieldDefinitionsFromRecords;
//# sourceMappingURL=getFieldDefinitionsFromRecords.js.map