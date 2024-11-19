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
import { GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE, CREATE, UPDATE, DELETE, } from 'ra-core';
import getFinalType from './getFinalType';
import isList from './isList';
export default (function (introspectionResults) { return function (resource, raFetchMethod, params, queryType) {
    var _a;
    var preparedParams = prepareParams(params, queryType, introspectionResults);
    switch (raFetchMethod) {
        case GET_LIST: {
            return buildGetListVariables(introspectionResults)(resource, raFetchMethod, preparedParams);
        }
        case GET_MANY:
            return {
                filter: { ids: preparedParams.ids },
            };
        case GET_MANY_REFERENCE: {
            var variables = buildGetListVariables(introspectionResults)(resource, raFetchMethod, preparedParams);
            variables.filter = __assign(__assign({}, variables.filter), (_a = {}, _a[preparedParams.target] = preparedParams.id, _a));
            return variables;
        }
        case GET_ONE:
        case DELETE:
            return {
                id: preparedParams.id,
            };
        case CREATE:
        case UPDATE: {
            return buildCreateUpdateVariables(resource, raFetchMethod, preparedParams, queryType);
        }
    }
}; });
var sanitizeValue = function (type, value) {
    if (type.name === 'Int') {
        return parseInt(value, 10);
    }
    if (type.name === 'Float') {
        return parseFloat(value);
    }
    return value;
};
var castType = function (value, type) {
    var realType = type.kind === 'NON_NULL' ? type.ofType : type;
    switch ("".concat(realType.kind, ":").concat(realType.name)) {
        case 'SCALAR:Int':
            return Number(value);
        case 'SCALAR:String':
            return String(value);
        case 'SCALAR:Boolean':
            return Boolean(value);
        default:
            return value;
    }
};
var prepareParams = function (params, queryType, introspectionResults) {
    var result = {};
    if (!params) {
        return params;
    }
    Object.keys(params).forEach(function (key) {
        var param = params[key];
        var arg = null;
        if (!param) {
            result[key] = param;
            return;
        }
        if (queryType && Array.isArray(queryType.args)) {
            arg = queryType.args.find(function (item) { return item.name === key; });
        }
        if (param instanceof File) {
            result[key] = param;
            return;
        }
        if (param instanceof Date) {
            result[key] = param.toISOString();
            return;
        }
        if (param instanceof Object &&
            !Array.isArray(param) &&
            arg &&
            arg.type.kind === 'INPUT_OBJECT') {
            var args = introspectionResults.types.find(function (item) {
                return item.kind === arg.type.kind && item.name === arg.type.name;
            }).inputFields;
            result[key] = prepareParams(param, { args: args }, introspectionResults);
            return;
        }
        if (param instanceof Object &&
            !(param instanceof Date) &&
            !Array.isArray(param)) {
            result[key] = prepareParams(param, queryType, introspectionResults);
            return;
        }
        if (!arg) {
            result[key] = param;
            return;
        }
        result[key] = castType(param, arg.type);
    });
    return result;
};
var buildGetListVariables = function (introspectionResults) { return function (resource, raFetchMethod, params) {
    var variables = { filter: {} };
    if (params.filter) {
        variables.filter = Object.keys(params.filter).reduce(function (acc, key) {
            var _a, _b, _c, _d, _e, _f, _g;
            var _h, _j;
            if (key === 'ids') {
                return __assign(__assign({}, acc), { ids: params.filter[key] });
            }
            if (typeof params.filter[key] === 'object') {
                var type = introspectionResults.types.find(function (t) { return t.name === "".concat(resource.type.name, "Filter"); });
                var filterSome = (_h = type === null || type === void 0 ? void 0 : type.inputFields) === null || _h === void 0 ? void 0 : _h.find(function (t) { return t.name === "".concat(key, "_some"); });
                if (filterSome) {
                    var filter = Object.keys(params.filter[key]).reduce(function (acc, k) {
                        var _a;
                        return (__assign(__assign({}, acc), (_a = {}, _a["".concat(k, "_in")] = params.filter[key][k], _a)));
                    }, {});
                    return __assign(__assign({}, acc), (_a = {}, _a["".concat(key, "_some")] = filter, _a));
                }
            }
            var parts = key.split('.');
            if (parts.length > 1) {
                if (parts[1] === 'id') {
                    var type_1 = introspectionResults.types.find(function (t) { return t.name === "".concat(resource.type.name, "Filter"); });
                    var filterSome = (_j = type_1 === null || type_1 === void 0 ? void 0 : type_1.inputFields) === null || _j === void 0 ? void 0 : _j.find(function (t) { return t.name === "".concat(parts[0], "_some"); });
                    if (filterSome) {
                        return __assign(__assign({}, acc), (_b = {}, _b["".concat(parts[0], "_some")] = { id: params.filter[key] }, _b));
                    }
                    return __assign(__assign({}, acc), (_c = {}, _c[parts[0]] = { id: params.filter[key] }, _c));
                }
                var resourceField_1 = resource.type.fields.find(function (f) { return f.name === parts[0]; });
                var type = getFinalType(resourceField_1.type);
                return __assign(__assign({}, acc), (_d = {}, _d[key] = sanitizeValue(type, params.filter[key]), _d));
            }
            var resourceField = resource.type.fields.find(function (f) { return f.name === key; });
            if (resourceField) {
                var type_2 = getFinalType(resourceField.type);
                var isAList = isList(resourceField.type);
                if (isAList) {
                    return __assign(__assign({}, acc), (_e = {}, _e[key] = Array.isArray(params.filter[key])
                        ? params.filter[key].map(function (value) {
                            return sanitizeValue(type_2, value);
                        })
                        : sanitizeValue(type_2, [params.filter[key]]), _e));
                }
                return __assign(__assign({}, acc), (_f = {}, _f[key] = sanitizeValue(type_2, params.filter[key]), _f));
            }
            return __assign(__assign({}, acc), (_g = {}, _g[key] = params.filter[key], _g));
        }, {});
    }
    if (params.pagination) {
        variables.page = parseInt(params.pagination.page, 10) - 1;
        variables.perPage = parseInt(params.pagination.perPage, 10);
    }
    if (params.sort) {
        variables.sortField = params.sort.field;
        variables.sortOrder = params.sort.order;
    }
    return variables;
}; };
var buildCreateUpdateVariables = function (resource, raFetchMethod, _a, queryType) {
    var id = _a.id, data = _a.data;
    return Object.keys(data).reduce(function (acc, key) {
        var _a, _b, _c;
        if (Array.isArray(data[key])) {
            var arg = queryType.args.find(function (a) { return a.name === "".concat(key, "Ids"); });
            if (arg) {
                return __assign(__assign({}, acc), (_a = {}, _a["".concat(key, "Ids")] = data[key].map(function (_a) {
                    var id = _a.id;
                    return id;
                }), _a));
            }
        }
        if (typeof data[key] === 'object') {
            var arg = queryType.args.find(function (a) { return a.name === "".concat(key, "Id"); });
            if (arg) {
                return __assign(__assign({}, acc), (_b = {}, _b["".concat(key, "Id")] = data[key].id, _b));
            }
        }
        return __assign(__assign({}, acc), (_c = {}, _c[key] = data[key], _c));
    }, { id: id });
};
//# sourceMappingURL=buildVariables.js.map