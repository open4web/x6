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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_TYPES = exports.MUTATION_TYPES = exports.QUERY_TYPES = void 0;
var merge_1 = __importDefault(require("lodash/merge"));
var get_1 = __importDefault(require("lodash/get"));
var pluralize_1 = __importDefault(require("pluralize"));
var ra_core_1 = require("ra-core");
var buildApolloClient_1 = __importDefault(require("./buildApolloClient"));
var constants_1 = require("./constants");
var introspection_1 = require("./introspection");
__exportStar(require("./introspection"), exports);
exports.QUERY_TYPES = constants_1.QUERY_TYPES;
exports.MUTATION_TYPES = constants_1.MUTATION_TYPES;
exports.ALL_TYPES = constants_1.ALL_TYPES;
var RaFetchMethodMap = {
    getList: ra_core_1.GET_LIST,
    getMany: ra_core_1.GET_MANY,
    getManyReference: ra_core_1.GET_MANY_REFERENCE,
    getOne: ra_core_1.GET_ONE,
    create: ra_core_1.CREATE,
    delete: ra_core_1.DELETE,
    deleteMany: ra_core_1.DELETE_MANY,
    update: ra_core_1.UPDATE,
    updateMany: ra_core_1.UPDATE_MANY,
};
var defaultOptions = {
    resolveIntrospection: introspection_1.introspectSchema,
    introspection: {
        operationNames: (_a = {},
            _a[ra_core_1.GET_LIST] = function (resource) { return "all".concat((0, pluralize_1.default)(resource.name)); },
            _a[ra_core_1.GET_ONE] = function (resource) { return "".concat(resource.name); },
            _a[ra_core_1.GET_MANY] = function (resource) { return "all".concat((0, pluralize_1.default)(resource.name)); },
            _a[ra_core_1.GET_MANY_REFERENCE] = function (resource) { return "all".concat((0, pluralize_1.default)(resource.name)); },
            _a[ra_core_1.CREATE] = function (resource) { return "create".concat(resource.name); },
            _a[ra_core_1.UPDATE] = function (resource) { return "update".concat(resource.name); },
            _a[ra_core_1.DELETE] = function (resource) { return "delete".concat(resource.name); },
            _a),
        exclude: undefined,
        include: undefined,
    },
};
var getOptions = function (options, raFetchMethod, resource) {
    if (typeof options === 'function') {
        return options(resource, raFetchMethod);
    }
    return options;
};
exports.default = (function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, clientObject, clientOptions, introspection, resolveIntrospection, buildQueryFactory, _b, override, otherOptions, client, introspectionResults, raDataProvider;
    return __generator(this, function (_c) {
        _a = (0, merge_1.default)({}, defaultOptions, options), clientObject = _a.client, clientOptions = _a.clientOptions, introspection = _a.introspection, resolveIntrospection = _a.resolveIntrospection, buildQueryFactory = _a.buildQuery, _b = _a.override, override = _b === void 0 ? {} : _b, otherOptions = __rest(_a, ["client", "clientOptions", "introspection", "resolveIntrospection", "buildQuery", "override"]);
        if (override && process.env.NODE_ENV === 'production') {
            console.warn(
            // eslint-disable-line
            'The override option is deprecated. You should instead wrap the buildQuery function provided by the dataProvider you use.');
        }
        client = clientObject || (0, buildApolloClient_1.default)(clientOptions);
        raDataProvider = new Proxy(defaultDataProvider, {
            get: function (target, name) {
                if (typeof name === 'symbol' || name === 'then') {
                    return;
                }
                var raFetchMethod = RaFetchMethodMap[name];
                return function (resource, params) { return __awaiter(void 0, void 0, void 0, function () {
                    var buildQuery, overriddenBuildQuery, _a, parseResponse, query, operation, apolloQuery_1, apolloQuery;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!introspection) return [3 /*break*/, 2];
                                return [4 /*yield*/, resolveIntrospection(client, introspection)];
                            case 1:
                                introspectionResults = _b.sent();
                                _b.label = 2;
                            case 2:
                                buildQuery = buildQueryFactory(introspectionResults);
                                overriddenBuildQuery = (0, get_1.default)(override, "".concat(resource, ".").concat(raFetchMethod));
                                _a = overriddenBuildQuery
                                    ? __assign(__assign({}, buildQuery(raFetchMethod, resource, params)), overriddenBuildQuery(params)) : buildQuery(raFetchMethod, resource, params), parseResponse = _a.parseResponse, query = __rest(_a, ["parseResponse"]);
                                operation = getQueryOperation(query.query);
                                if (operation === 'query') {
                                    apolloQuery_1 = __assign(__assign(__assign({}, query), { fetchPolicy: 'network-only' }), getOptions(otherOptions.query, raFetchMethod, resource));
                                    return [2 /*return*/, (client
                                            // @ts-ignore
                                            .query(apolloQuery_1)
                                            .then(function (response) { return parseResponse(response); })
                                            .catch(handleError))];
                                }
                                apolloQuery = __assign({ mutation: query.query, variables: query.variables }, getOptions(otherOptions.mutation, raFetchMethod, resource));
                                return [2 /*return*/, (client
                                        // @ts-ignore
                                        .mutate(apolloQuery)
                                        .then(parseResponse)
                                        .catch(handleError))];
                        }
                    });
                }); };
            },
        });
        return [2 /*return*/, raDataProvider];
    });
}); });
var handleError = function (error) {
    var _a, _b;
    if (error === null || error === void 0 ? void 0 : error.networkError) {
        throw new ra_core_1.HttpError((_a = error === null || error === void 0 ? void 0 : error.networkError) === null || _a === void 0 ? void 0 : _a.message, (_b = error === null || error === void 0 ? void 0 : error.networkError) === null || _b === void 0 ? void 0 : _b.statusCode);
    }
    throw new ra_core_1.HttpError(error.message, 200, error);
};
var getQueryOperation = function (query) {
    if (query && query.definitions && query.definitions.length > 0) {
        return query.definitions[0].operation;
    }
    throw new Error('Unable to determine the query operation');
};
// Only used to initialize proxy
var defaultDataProvider = {
    create: function () { return Promise.resolve({ data: null }); },
    delete: function () { return Promise.resolve({ data: null }); },
    deleteMany: function () { return Promise.resolve({ data: [] }); },
    getList: function () { return Promise.resolve({ data: [], total: 0 }); },
    getMany: function () { return Promise.resolve({ data: [] }); },
    getManyReference: function () { return Promise.resolve({ data: [], total: 0 }); },
    getOne: function () { return Promise.resolve({ data: null }); },
    update: function () { return Promise.resolve({ data: null }); },
    updateMany: function () { return Promise.resolve({ data: [] }); }, // avoids adding a context in tests
};
//# sourceMappingURL=index.js.map