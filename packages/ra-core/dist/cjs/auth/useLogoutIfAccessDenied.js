"use strict";
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
var react_1 = require("react");
var useAuthProvider_1 = __importDefault(require("./useAuthProvider"));
var useLogout_1 = __importDefault(require("./useLogout"));
var notification_1 = require("../notification");
var react_router_1 = require("react-router");
var timer;
/**
 * Returns a callback used to call the authProvider.checkError() method
 * and an error from the dataProvider. If the authProvider rejects the call,
 * the hook logs the user out and shows a logged out notification.
 *
 * Used in the useDataProvider hook to check for access denied responses
 * (e.g. 401 or 403 responses) and trigger a logout.
 *
 * @see useLogout
 * @see useDataProvider
 *
 * @returns {Function} logoutIfAccessDenied callback
 *
 * @example
 *
 * import { useLogoutIfAccessDenied, useNotify, DataProviderContext } from 'react-admin';
 *
 * const FetchRestrictedResource = () => {
 *     const dataProvider = useContext(DataProviderContext);
 *     const logoutIfAccessDenied = useLogoutIfAccessDenied();
 *     const notify = useNotify()
 *     useEffect(() => {
 *         dataProvider.getOne('secret', { id: 123 })
 *             .catch(error => {
 *                  logoutIfAccessDenied(error);
 *                  notify('server error', 'warning');
 *              })
 *     }, []);
 *     // ...
 * }
 */
var useLogoutIfAccessDenied = function () {
    var authProvider = (0, useAuthProvider_1.default)();
    var logout = (0, useLogout_1.default)();
    var notify = (0, notification_1.useNotify)();
    var navigate = (0, react_router_1.useNavigate)();
    var logoutIfAccessDenied = (0, react_1.useCallback)(function (error, disableNotification) {
        return authProvider
            .checkError(error)
            .then(function () { return false; })
            .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
            var logoutUser, shouldNotify, redirectTo;
            var _a;
            return __generator(this, function (_b) {
                logoutUser = (_a = e === null || e === void 0 ? void 0 : e.logoutUser) !== null && _a !== void 0 ? _a : true;
                //manual debounce
                if (timer) {
                    // side effects already triggered in this tick, exit
                    return [2 /*return*/, true];
                }
                timer = setTimeout(function () {
                    timer = undefined;
                }, 0);
                shouldNotify = !(disableNotification ||
                    (e && e.message === false) ||
                    (error && error.message === false));
                if (shouldNotify) {
                    // notify only if not yet logged out
                    authProvider
                        .checkAuth({})
                        .then(function () {
                        if (logoutUser) {
                            notify(getErrorMessage(e, 'ra.notification.logged_out'), { type: 'warning' });
                        }
                        else {
                            notify(getErrorMessage(e, 'ra.notification.not_authorized'), { type: 'warning' });
                        }
                    })
                        .catch(function () { });
                }
                redirectTo = e && e.redirectTo
                    ? e.redirectTo
                    : error && error.redirectTo
                        ? error.redirectTo
                        : undefined;
                if (logoutUser) {
                    logout({}, redirectTo);
                }
                else {
                    navigate(redirectTo);
                }
                return [2 /*return*/, true];
            });
        }); });
    }, [authProvider, logout, notify, navigate]);
    return authProvider
        ? logoutIfAccessDenied
        : logoutIfAccessDeniedWithoutProvider;
};
var logoutIfAccessDeniedWithoutProvider = function () { return Promise.resolve(false); };
var getErrorMessage = function (error, defaultMessage) {
    return typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
            ? defaultMessage
            : error.message;
};
exports.default = useLogoutIfAccessDenied;
//# sourceMappingURL=useLogoutIfAccessDenied.js.map