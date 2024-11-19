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
exports.Root = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var Admin_1 = require("./Admin");
var ApplicationContext_1 = require("./ApplicationContext");
var ApplicationsDashboard_1 = require("./ApplicationsDashboard");
var Root = function (_a) {
    var theme = _a.theme;
    var _b = (0, react_1.useState)(), application = _b[0], setApplication = _b[1];
    var handleExitApplication = function () {
        setApplication(undefined);
    };
    var handleApplicationSelected = function (selectedApplication) {
        setApplication(selectedApplication);
    };
    var context = (0, react_1.useMemo)(function () { return ({
        application: application,
        onExit: handleExitApplication,
    }); }, [application]);
    if (context.application) {
        return (React.createElement(ApplicationContext_1.ApplicationContext.Provider, { value: context },
            React.createElement(Admin_1.Admin, { theme: theme })));
    }
    return (React.createElement(ApplicationsDashboard_1.ApplicationsDashboard, { onApplicationSelected: handleApplicationSelected, theme: theme }));
};
exports.Root = Root;
//# sourceMappingURL=Root.js.map