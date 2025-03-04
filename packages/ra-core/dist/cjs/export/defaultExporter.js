"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dist_1 = __importDefault(require("jsonexport/dist"));
var downloadCSV_1 = __importDefault(require("./downloadCSV"));
var defaultExporter = function (data, _, __, resource) {
    return (0, dist_1.default)(data, function (err, csv) { return (0, downloadCSV_1.default)(csv, resource); });
};
exports.default = defaultExporter;
//# sourceMappingURL=defaultExporter.js.map