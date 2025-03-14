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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuery = void 0;
var merge_1 = __importDefault(require("lodash/merge"));
var ra_data_graphql_1 = __importDefault(require("ra-data-graphql"));
var buildQuery_1 = __importDefault(require("./buildQuery"));
var defaultOptions = {
    buildQuery: buildQuery_1.default,
};
exports.buildQuery = buildQuery_1.default;
exports.default = (function (options) {
    return (0, ra_data_graphql_1.default)((0, merge_1.default)({}, defaultOptions, options)).then(function (defaultDataProvider) {
        return __assign(__assign({}, defaultDataProvider), { 
            // This provider does not support multiple deletions so instead we send multiple DELETE requests
            // This can be optimized using the apollo-link-batch-http link
            deleteMany: function (resource, params) {
                var ids = params.ids, otherParams = __rest(params, ["ids"]);
                return Promise.all(ids.map(function (id) {
                    return defaultDataProvider.delete(resource, __assign({ id: id, previousData: null }, otherParams));
                })).then(function (results) {
                    var data = results.reduce(function (acc, _a) {
                        var data = _a.data;
                        return __spreadArray(__spreadArray([], acc, true), [data.id], false);
                    }, []);
                    return { data: data };
                });
            }, 
            // This provider does not support multiple deletions so instead we send multiple UPDATE requests
            // This can be optimized using the apollo-link-batch-http link
            updateMany: function (resource, params) {
                var ids = params.ids, data = params.data, otherParams = __rest(params, ["ids", "data"]);
                return Promise.all(ids.map(function (id) {
                    return defaultDataProvider.update(resource, __assign({ id: id, data: data, previousData: null }, otherParams));
                })).then(function (results) {
                    var data = results.reduce(function (acc, _a) {
                        var data = _a.data;
                        return __spreadArray(__spreadArray([], acc, true), [data.id], false);
                    }, []);
                    return { data: data };
                });
            } });
    });
});
//# sourceMappingURL=index.js.map