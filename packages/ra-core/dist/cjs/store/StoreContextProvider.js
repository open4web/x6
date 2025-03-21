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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreContextProvider = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var StoreContext_1 = require("./StoreContext");
var StoreContextProvider = function (_a) {
    var Store = _a.value, children = _a.children;
    (0, react_1.useEffect)(function () {
        Store.setup();
        return function () {
            Store.teardown();
        };
    }, [Store]);
    return (React.createElement(StoreContext_1.StoreContext.Provider, { value: Store }, children));
};
exports.StoreContextProvider = StoreContextProvider;
//# sourceMappingURL=StoreContextProvider.js.map