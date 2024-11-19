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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-anonymous-default-export */
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var pullAt_1 = __importDefault(require("lodash/pullAt"));
var localforage_1 = __importDefault(require("localforage"));
/**
 * Respond to react-admin data queries using a localForage for storage.
 *
 * Useful for local-first web apps.
 *
 * @example // initialize with no data
 *
 * import localForageDataProvider from 'ra-data-local-forage';
 * const dataProvider = await localForageDataProvider();
 *
 * @example // initialize with default data (will be ignored if data has been modified by user)
 *
 * import localForageDataProvider from 'ra-data-local-forage';
 * const dataProvider = await localForageDataProvider({
 *   defaultData: {
 *     posts: [
 *       { id: 0, title: 'Hello, world!' },
 *       { id: 1, title: 'FooBar' },
 *     ],
 *     comments: [
 *       { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
 *       { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
 *     ],
 *   }
 * });
 */
exports.default = (function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, defaultData, _c, prefixLocalForageKey, _d, loggingEnabled, getLocalForageData, localForageData, data, updateLocalForage, baseDataProvider;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = params || {}, _b = _a.defaultData, defaultData = _b === void 0 ? {} : _b, _c = _a.prefixLocalForageKey, prefixLocalForageKey = _c === void 0 ? 'ra-data-local-forage-' : _c, _d = _a.loggingEnabled, loggingEnabled = _d === void 0 ? false : _d;
                getLocalForageData = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var keys, keyFiltered, localForageData, _i, keyFiltered_1, key, keyWithoutPrefix, res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, localforage_1.default.keys()];
                            case 1:
                                keys = _a.sent();
                                keyFiltered = keys.filter(function (key) {
                                    return key.includes(prefixLocalForageKey);
                                });
                                if (keyFiltered.length === 0) {
                                    return [2 /*return*/, undefined];
                                }
                                localForageData = {};
                                _i = 0, keyFiltered_1 = keyFiltered;
                                _a.label = 2;
                            case 2:
                                if (!(_i < keyFiltered_1.length)) return [3 /*break*/, 5];
                                key = keyFiltered_1[_i];
                                keyWithoutPrefix = key.replace(prefixLocalForageKey, '');
                                return [4 /*yield*/, localforage_1.default.getItem(key)];
                            case 3:
                                res = _a.sent();
                                localForageData[keyWithoutPrefix] = res || [];
                                _a.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 2];
                            case 5: return [2 /*return*/, localForageData];
                        }
                    });
                }); };
                return [4 /*yield*/, getLocalForageData()];
            case 1:
                localForageData = _e.sent();
                data = localForageData !== null && localForageData !== void 0 ? localForageData : defaultData;
                updateLocalForage = function (resource) {
                    localforage_1.default.setItem("".concat(prefixLocalForageKey).concat(resource), data[resource]);
                };
                baseDataProvider = (0, ra_data_fakerest_1.default)(data, loggingEnabled);
                return [2 /*return*/, {
                        // read methods are just proxies to FakeRest
                        getList: function (resource, params) {
                            return baseDataProvider
                                .getList(resource, params)
                                .catch(function (error) {
                                if (error.code === 1) {
                                    // undefined collection error: hide the error and return an empty list instead
                                    return { data: [], total: 0 };
                                }
                                else {
                                    throw error;
                                }
                            });
                        },
                        getOne: function (resource, params) { return baseDataProvider.getOne(resource, params); },
                        getMany: function (resource, params) { return baseDataProvider.getMany(resource, params); },
                        getManyReference: function (resource, params) {
                            return baseDataProvider
                                .getManyReference(resource, params)
                                .catch(function (error) {
                                if (error.code === 1) {
                                    // undefined collection error: hide the error and return an empty list instead
                                    return { data: [], total: 0 };
                                }
                                else {
                                    throw error;
                                }
                            });
                        },
                        // update methods need to persist changes in localForage
                        update: function (resource, params) {
                            var index = data[resource].findIndex(function (record) { return record.id === params.id; });
                            data[resource][index] = __assign(__assign({}, data[resource][index]), params.data);
                            updateLocalForage(resource);
                            return baseDataProvider.update(resource, params);
                        },
                        updateMany: function (resource, params) {
                            params.ids.forEach(function (id) {
                                var index = data[resource].findIndex(function (record) { return record.id === id; });
                                data[resource][index] = __assign(__assign({}, data[resource][index]), params.data);
                            });
                            updateLocalForage(resource);
                            return baseDataProvider.updateMany(resource, params);
                        },
                        create: function (resource, params) {
                            // we need to call the fakerest provider first to get the generated id
                            return baseDataProvider
                                .create(resource, params)
                                .then(function (response) {
                                if (!data.hasOwnProperty(resource)) {
                                    data[resource] = [];
                                }
                                data[resource].push(response.data);
                                updateLocalForage(resource);
                                return response;
                            });
                        },
                        delete: function (resource, params) {
                            var index = data[resource].findIndex(function (record) { return record.id === params.id; });
                            (0, pullAt_1.default)(data[resource], [index]);
                            updateLocalForage(resource);
                            return baseDataProvider.delete(resource, params);
                        },
                        deleteMany: function (resource, params) {
                            var indexes = params.ids.map(function (id) {
                                return data[resource].findIndex(function (record) { return record.id === id; });
                            });
                            (0, pullAt_1.default)(data[resource], indexes);
                            updateLocalForage(resource);
                            return baseDataProvider.deleteMany(resource, params);
                        },
                    }];
        }
    });
}); });
//# sourceMappingURL=index.js.map