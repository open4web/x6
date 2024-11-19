"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApplication = exports.ApplicationContext = void 0;
var react_1 = require("react");
exports.ApplicationContext = (0, react_1.createContext)(undefined);
var useApplication = function () { return (0, react_1.useContext)(exports.ApplicationContext); };
exports.useApplication = useApplication;
//# sourceMappingURL=ApplicationContext.js.map