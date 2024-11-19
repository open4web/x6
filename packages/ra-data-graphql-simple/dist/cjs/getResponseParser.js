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
var ra_core_1 = require("ra-core");
exports.default = (function (introspectionResults) { return function (raFetchMethod, resource, queryType) { return function (response) {
    var data = response.data;
    if (raFetchMethod === ra_core_1.GET_LIST ||
        raFetchMethod === ra_core_1.GET_MANY ||
        raFetchMethod === ra_core_1.GET_MANY_REFERENCE) {
        return {
            data: response.data.items.map(sanitizeResource),
            total: response.data.total.count,
        };
    }
    return { data: sanitizeResource(data.data) };
}; }; });
var sanitizeResource = function (data) {
    var result = Object.keys(data).reduce(function (acc, key) {
        var _a, _b, _c, _d, _e;
        if (key.startsWith('_')) {
            return acc;
        }
        var dataForKey = data[key];
        if (dataForKey === null || dataForKey === undefined) {
            return acc;
        }
        if (Array.isArray(dataForKey)) {
            if (typeof dataForKey[0] === 'object' &&
                dataForKey[0] != null &&
                // If there is no id, it's not a reference but an embedded array
                dataForKey[0].id != null) {
                return __assign(__assign({}, acc), (_a = {}, _a[key] = dataForKey.map(sanitizeResource), _a["".concat(key, "Ids")] = dataForKey.map(function (d) { return d.id; }), _a));
            }
            else {
                return __assign(__assign({}, acc), (_b = {}, _b[key] = dataForKey, _b));
            }
        }
        if (typeof dataForKey === 'object' &&
            dataForKey != null &&
            // If there is no id, it's not a reference but an embedded object
            dataForKey.id != null) {
            return __assign(__assign(__assign({}, acc), (dataForKey &&
                dataForKey.id && (_c = {},
                _c["".concat(key, ".id")] = dataForKey.id,
                _c))), (_d = {}, _d[key] = dataForKey.__typename
                ? sanitizeResource(dataForKey)
                : dataForKey, _d));
        }
        return __assign(__assign({}, acc), (_e = {}, _e[key] = dataForKey, _e));
    }, {});
    return result;
};
//# sourceMappingURL=getResponseParser.js.map