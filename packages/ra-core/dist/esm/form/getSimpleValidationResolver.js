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
/**
 * Convert a simple validation function that returns an object matching the form shape with errors
 * to a validation resolver compatible with react-hook-form.
 *
 * @example
 * const validate = (values: any) => {
 *     if (values.username == null || values.username.trim() === '') {
 *         return { username: 'Required' };
 *     }
 * }
 *
 * const validationResolver = getSimpleValidationResolver(validate);
 *
 * const UserForm = () => (
 *     <Form
 *         defaultValues={{ username: 'John' }}
 *         validationResolver={validationResolver}
 *     >
 *         <TextField source="username" />
 *     </Form>
 * );
 */
export var getSimpleValidationResolver = function (validate) { return function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, transformedErrors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, validate(data)];
            case 1:
                errors = _a.sent();
                // If there are no errors, early return the form values
                if (!errors || isEmptyObject(errors)) {
                    return [2 /*return*/, { values: data, errors: {} }];
                }
                transformedErrors = transformErrorFields(errors);
                // Sometimes we still need to transform the error object to realize there are actually
                // no errors in it.
                //   e.g. with an ArrayInput we can get something like: `{backlinks: [{}, {}]}`
                // If, after transformation, there are no errors, we return the form values
                if (!transformedErrors || isEmptyObject(transformedErrors)) {
                    return [2 /*return*/, { values: data, errors: {} }];
                }
                // Else return the errors and no values
                return [2 /*return*/, {
                        values: {},
                        errors: transformedErrors,
                    }];
        }
    });
}); }; };
var transformErrorFields = function (error) {
    return Object.keys(error).reduce(function (acc, field) {
        var _a, _b, _c;
        // Handle arrays
        if (Array.isArray(error[field])) {
            var arrayHasErrors_1 = false;
            var transformedArrayErrors = error[field].map(function (item) {
                if (!isEmptyObject(item)) {
                    arrayHasErrors_1 = true;
                }
                return transformErrorFields(item);
            });
            if (!arrayHasErrors_1) {
                return acc;
            }
            return __assign(__assign({}, acc), (_a = {}, _a[field] = transformedArrayErrors, _a));
        }
        // Handle objects
        if (isEmptyObject(error[field])) {
            return acc;
        }
        if (typeof error[field] === 'object' &&
            !isRaTranslationObj(error[field])) {
            return __assign(__assign({}, acc), (_b = {}, _b[field] = transformErrorFields(error[field]), _b));
        }
        // Handle leaf (either primary type or RaTranslationObj)
        return __assign(__assign({}, acc), (_c = {}, _c[field] = addTypeAndMessage(error[field]), _c));
    }, {});
};
var addTypeAndMessage = function (error) { return ({
    type: 'manual',
    message: error,
}); };
var isRaTranslationObj = function (obj) {
    return Object.keys(obj).includes('message') && Object.keys(obj).includes('args');
};
var isEmptyObject = function (obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
};
//# sourceMappingURL=getSimpleValidationResolver.js.map