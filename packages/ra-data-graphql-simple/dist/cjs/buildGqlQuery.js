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
exports.getArgType = exports.buildApolloArgs = exports.buildArgs = exports.buildFragments = exports.buildFields = void 0;
var ra_core_1 = require("ra-core");
var ra_data_graphql_1 = require("ra-data-graphql");
var graphql_1 = require("graphql");
var gqlTypes = __importStar(require("graphql-ast-types-browser"));
var getFinalType_1 = __importDefault(require("./getFinalType"));
var isList_1 = __importDefault(require("./isList"));
var isRequired_1 = __importDefault(require("./isRequired"));
exports.default = (function (introspectionResults) { return function (resource, raFetchMethod, queryType, variables) {
    var sortField = variables.sortField, sortOrder = variables.sortOrder, metaVariables = __rest(variables, ["sortField", "sortOrder"]);
    var apolloArgs = (0, exports.buildApolloArgs)(queryType, variables);
    var args = (0, exports.buildArgs)(queryType, variables);
    var metaArgs = (0, exports.buildArgs)(queryType, metaVariables);
    var fields = (0, exports.buildFields)(introspectionResults)(resource.type.fields);
    if (raFetchMethod === ra_core_1.GET_LIST ||
        raFetchMethod === ra_core_1.GET_MANY ||
        raFetchMethod === ra_core_1.GET_MANY_REFERENCE) {
        return gqlTypes.document([
            gqlTypes.operationDefinition('query', gqlTypes.selectionSet([
                gqlTypes.field(gqlTypes.name(queryType.name), gqlTypes.name('items'), args, null, gqlTypes.selectionSet(fields)),
                gqlTypes.field(gqlTypes.name("_".concat(queryType.name, "Meta")), gqlTypes.name('total'), metaArgs, null, gqlTypes.selectionSet([
                    gqlTypes.field(gqlTypes.name('count')),
                ])),
            ]), gqlTypes.name(queryType.name), apolloArgs),
        ]);
    }
    if (raFetchMethod === ra_core_1.DELETE) {
        return gqlTypes.document([
            gqlTypes.operationDefinition('mutation', gqlTypes.selectionSet([
                gqlTypes.field(gqlTypes.name(queryType.name), gqlTypes.name('data'), args, null, gqlTypes.selectionSet(fields)),
            ]), gqlTypes.name(queryType.name), apolloArgs),
        ]);
    }
    return gqlTypes.document([
        gqlTypes.operationDefinition(ra_data_graphql_1.QUERY_TYPES.includes(raFetchMethod) ? 'query' : 'mutation', gqlTypes.selectionSet([
            gqlTypes.field(gqlTypes.name(queryType.name), gqlTypes.name('data'), args, null, gqlTypes.selectionSet(fields)),
        ]), gqlTypes.name(queryType.name), apolloArgs),
    ]);
}; });
var buildFields = function (introspectionResults, paths) {
    if (paths === void 0) { paths = []; }
    return function (fields) {
        return fields.reduce(function (acc, field) {
            var type = (0, getFinalType_1.default)(field.type);
            if (type.name.startsWith('_')) {
                return acc;
            }
            if (type.kind !== graphql_1.TypeKind.OBJECT && type.kind !== graphql_1.TypeKind.INTERFACE) {
                return __spreadArray(__spreadArray([], acc, true), [gqlTypes.field(gqlTypes.name(field.name))], false);
            }
            var linkedResource = introspectionResults.resources.find(function (r) { return r.type.name === type.name; });
            if (linkedResource) {
                return __spreadArray(__spreadArray([], acc, true), [
                    gqlTypes.field(gqlTypes.name(field.name), null, null, null, gqlTypes.selectionSet([gqlTypes.field(gqlTypes.name('id'))])),
                ], false);
            }
            var linkedType = introspectionResults.types.find(function (t) { return t.name === type.name; });
            if (linkedType && !paths.includes(linkedType.name)) {
                var possibleTypes = linkedType.possibleTypes || [];
                return __spreadArray(__spreadArray([], acc, true), [
                    gqlTypes.field(gqlTypes.name(field.name), null, null, null, gqlTypes.selectionSet(__spreadArray(__spreadArray([], (0, exports.buildFragments)(introspectionResults)(possibleTypes), true), (0, exports.buildFields)(introspectionResults, __spreadArray(__spreadArray([], paths, true), [
                        linkedType.name,
                    ], false))(linkedType.fields), true))),
                ], false);
            }
            // NOTE: We might have to handle linked types which are not resources but will have to be careful about
            // ending with endless circular dependencies
            return acc;
        }, []);
    };
};
exports.buildFields = buildFields;
var buildFragments = function (introspectionResults) { return function (possibleTypes) {
    return possibleTypes.reduce(function (acc, possibleType) {
        var type = (0, getFinalType_1.default)(possibleType);
        var linkedType = introspectionResults.types.find(function (t) { return t.name === type.name; });
        return __spreadArray(__spreadArray([], acc, true), [
            gqlTypes.inlineFragment(gqlTypes.selectionSet((0, exports.buildFields)(introspectionResults)(linkedType.fields)), gqlTypes.namedType(gqlTypes.name(type.name))),
        ], false);
    }, []);
}; };
exports.buildFragments = buildFragments;
var buildArgs = function (query, variables) {
    if (query.args.length === 0) {
        return [];
    }
    var validVariables = Object.keys(variables).filter(function (k) { return typeof variables[k] !== 'undefined'; });
    var args = query.args
        .filter(function (a) { return validVariables.includes(a.name); })
        .reduce(function (acc, arg) { return __spreadArray(__spreadArray([], acc, true), [
        gqlTypes.argument(gqlTypes.name(arg.name), gqlTypes.variable(gqlTypes.name(arg.name))),
    ], false); }, []);
    return args;
};
exports.buildArgs = buildArgs;
var buildApolloArgs = function (query, variables) {
    if (query.args.length === 0) {
        return [];
    }
    var validVariables = Object.keys(variables).filter(function (k) { return typeof variables[k] !== 'undefined'; });
    var args = query.args
        .filter(function (a) { return validVariables.includes(a.name); })
        .reduce(function (acc, arg) {
        return __spreadArray(__spreadArray([], acc, true), [
            gqlTypes.variableDefinition(gqlTypes.variable(gqlTypes.name(arg.name)), (0, exports.getArgType)(arg)),
        ], false);
    }, []);
    return args;
};
exports.buildApolloArgs = buildApolloArgs;
var getArgType = function (arg) {
    var type = (0, getFinalType_1.default)(arg.type);
    var required = (0, isRequired_1.default)(arg.type);
    var list = (0, isList_1.default)(arg.type);
    if (list) {
        if (required) {
            return gqlTypes.listType(gqlTypes.nonNullType(gqlTypes.namedType(gqlTypes.name(type.name))));
        }
        return gqlTypes.listType(gqlTypes.namedType(gqlTypes.name(type.name)));
    }
    if (required) {
        return gqlTypes.nonNullType(gqlTypes.namedType(gqlTypes.name(type.name)));
    }
    return gqlTypes.namedType(gqlTypes.name(type.name));
};
exports.getArgType = getArgType;
//# sourceMappingURL=buildGqlQuery.js.map