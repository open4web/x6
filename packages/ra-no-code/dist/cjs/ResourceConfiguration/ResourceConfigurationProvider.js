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
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_KEY = exports.ResourceConfigurationProvider = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var ResourceConfigurationContext_1 = require("./ResourceConfigurationContext");
var ResourceConfigurationProvider = function (_a) {
    var children = _a.children, dataProvider = _a.dataProvider, _b = _a.storageKey, storageKey = _b === void 0 ? exports.STORAGE_KEY : _b;
    var _c = (0, react_1.useState)(function () { return loadConfigurationsFromLocalStorage(storageKey); }), resources = _c[0], setInternalResources = _c[1];
    var setResources = (0, react_1.useCallback)(function (value) {
        setInternalResources(function (prevState) {
            var newState = value(prevState);
            // eslint-disable-next-line
            if (newState != undefined) {
                window.localStorage.setItem(storageKey, JSON.stringify(newState));
            }
            else {
                window.localStorage.removeItem(storageKey);
            }
            return newState;
        });
    }, [storageKey]);
    var addResource = (0, react_1.useCallback)(function (resource) {
        setResources(function (current) {
            var _a;
            var allResources = current || {};
            if (allResources[resource.name]) {
                return allResources;
            }
            return __assign(__assign({}, current), (_a = {}, _a[resource.name] = resource, _a));
        });
    }, [setResources]);
    var updateResource = (0, react_1.useCallback)(function (name, newResource) {
        setResources(function (current) {
            var _a;
            var allResources = current || {};
            var resource = allResources[name];
            if (!resource) {
                return allResources;
            }
            var nextResources = __assign(__assign({}, current), (_a = {}, _a[name] = __assign(__assign({}, current[name]), newResource), _a));
            return nextResources;
        });
    }, [setResources]);
    var removeResource = (0, react_1.useCallback)(function (name) {
        setResources(function (current) {
            var allResources = current || {};
            var resourceToRemove = allResources[name];
            if (!resourceToRemove) {
                return allResources;
            }
            deleteResourceData(name, dataProvider);
            var _a = current, _b = name, currentResource = _a[_b], nextResources = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            return nextResources;
        });
    }, [dataProvider, setResources]);
    var context = (0, react_1.useMemo)(function () {
        return [
            resources,
            {
                addResource: addResource,
                updateResource: updateResource,
                removeResource: removeResource,
            },
        ];
    }, [resources, addResource, updateResource, removeResource]);
    return (React.createElement(ResourceConfigurationContext_1.ResourceConfigurationContext.Provider, { value: context }, children));
};
exports.ResourceConfigurationProvider = ResourceConfigurationProvider;
exports.STORAGE_KEY = '@@ra-no-code';
var loadConfigurationsFromLocalStorage = function (storageKey) {
    var storedResourceDefinitions = window.localStorage.getItem(storageKey);
    if (!storedResourceDefinitions) {
        return {};
    }
    var resourceDefinitions = JSON.parse(storedResourceDefinitions);
    return resourceDefinitions;
};
var deleteResourceData = function (resource, dataProvider, numberOfRecordsToDelete) {
    if (numberOfRecordsToDelete === void 0) { numberOfRecordsToDelete = 10000; }
    return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, total;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataProvider.getList(resource, {
                        pagination: { page: 1, perPage: numberOfRecordsToDelete },
                        sort: { field: 'id', order: 'ASC' },
                        filter: {},
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, total = _a.total;
                    return [4 /*yield*/, dataProvider.deleteMany(resource, {
                            ids: data.map(function (_a) {
                                var id = _a.id;
                                return id;
                            }),
                        })];
                case 2:
                    _b.sent();
                    if (total > numberOfRecordsToDelete) {
                        return [2 /*return*/, deleteResourceData(resource, dataProvider, numberOfRecordsToDelete)];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
//# sourceMappingURL=ResourceConfigurationProvider.js.map