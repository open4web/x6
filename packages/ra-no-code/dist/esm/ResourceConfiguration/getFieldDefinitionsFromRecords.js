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
import { getValuesFromRecords, inferTypeFromValues, } from 'react-admin';
export var getFieldDefinitionsFromRecords = function (records) {
    var values = getValuesFromRecords(records);
    return Object.keys(values).map(function (key) {
        var inferedDefinition = inferTypeFromValues(key, values[key]);
        return __assign(__assign({}, inferedDefinition), { options: inferedDefinition.type === 'reference'
                ? {
                    referenceField: 'id',
                    selectionType: 'select',
                }
                : undefined, views: ['list', 'create', 'edit', 'show'] });
    });
};
//# sourceMappingURL=getFieldDefinitionsFromRecords.js.map