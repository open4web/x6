import { isMatch, isValid, parseISO } from 'date-fns';
export var isNumeric = function (value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
};
export var valuesAreNumeric = function (values) { return values.every(isNumeric); };
export var isInteger = function (value) {
    return Number.isInteger(value) || !isNaN(parseInt(value));
};
export var valuesAreInteger = function (values) { return values.every(isInteger); };
export var isBoolean = function (value) { return typeof value === 'boolean'; };
export var valuesAreBoolean = function (values) { return values.every(isBoolean); };
export var isBooleanString = function (value) {
    return ['true', 'false'].includes(value.toString().toLowerCase());
};
export var valuesAreBooleanString = function (values) {
    return values.every(isBooleanString);
};
export var isString = function (value) { return typeof value === 'string'; };
export var valuesAreString = function (values) { return values.every(isString); };
var HtmlRegexp = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i;
export var isHtml = function (value) { return !value || HtmlRegexp.test(value); };
export var valuesAreHtml = function (values) { return values.every(isHtml); };
var UrlRegexp = /http(s*):\/\/.*/i;
export var isUrl = function (value) { return !value || UrlRegexp.test(value); };
export var valuesAreUrl = function (values) { return values.every(isUrl); };
var ImageUrlRegexp = /http(s*):\/\/.*\.(jpeg|jpg|jfif|pjpeg|pjp|png|svg|gif|webp|apng|bmp|ico|cur|tif|tiff)/i;
export var isImageUrl = function (value) { return !value || ImageUrlRegexp.test(value); };
export var valuesAreImageUrl = function (values) { return values.every(isImageUrl); };
// This is a very simple regex to find emails
// It is NOT meant to validate emails as the spec is way more complicated but is
// enough for our inference needs
var EmailRegexp = /@{1}/;
export var isEmail = function (value) { return !value || EmailRegexp.test(value); };
export var valuesAreEmail = function (values) { return values.every(isEmail); };
export var isArray = function (value) { return Array.isArray(value); };
export var valuesAreArray = function (values) { return values.every(isArray); };
export var isDate = function (value) { return !value || value instanceof Date; };
export var valuesAreDate = function (values) { return values.every(isDate); };
export var isDateString = function (value) {
    return !value ||
        (typeof value === 'string' &&
            (isMatch(value, 'MM/dd/yyyy') ||
                isMatch(value, 'MM/dd/yy') ||
                isValid(parseISO(value))));
};
export var valuesAreDateString = function (values) {
    return values.every(isDateString);
};
export var isObject = function (value) {
    return Object.prototype.toString.call(value) === '[object Object]';
};
export var valuesAreObject = function (values) { return values.every(isObject); };
//# sourceMappingURL=assertions.js.map