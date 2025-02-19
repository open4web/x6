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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@apollo/client");
exports.default = (function (options) {
    if (!options) {
        return new client_1.ApolloClient({
            cache: new client_1.InMemoryCache().restore({}),
        });
    }
    var _a = options.cache, cache = _a === void 0 ? new client_1.InMemoryCache().restore({}) : _a, uri = options.uri, _b = options.link, link = _b === void 0 ? !!uri ? new client_1.HttpLink({ uri: uri }) : undefined : _b, otherOptions = __rest(options, ["cache", "uri", "link"]);
    return new client_1.ApolloClient(__assign({ link: link, cache: cache }, otherOptions));
});
//# sourceMappingURL=buildApolloClient.js.map