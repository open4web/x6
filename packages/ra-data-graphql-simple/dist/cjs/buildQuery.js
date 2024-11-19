"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQueryFactory = void 0;
var buildVariables_1 = __importDefault(require("./buildVariables"));
var buildGqlQuery_1 = __importDefault(require("./buildGqlQuery"));
var getResponseParser_1 = __importDefault(require("./getResponseParser"));
var buildQueryFactory = function (buildVariablesImpl, buildGqlQueryImpl, getResponseParserImpl) {
    if (buildVariablesImpl === void 0) { buildVariablesImpl = buildVariables_1.default; }
    if (buildGqlQueryImpl === void 0) { buildGqlQueryImpl = buildGqlQuery_1.default; }
    if (getResponseParserImpl === void 0) { getResponseParserImpl = getResponseParser_1.default; }
    return function (introspectionResults) {
        var knownResources = introspectionResults.resources.map(function (r) { return r.type.name; });
        var buildQuery = function (raFetchType, resourceName, params) {
            var resource = introspectionResults.resources.find(function (r) { return r.type.name === resourceName; });
            if (!resource) {
                throw new Error("Unknown resource ".concat(resourceName, ". Make sure it has been declared on your server side schema. Known resources are ").concat(knownResources.join(', ')));
            }
            var queryType = resource[raFetchType];
            if (!queryType) {
                throw new Error("No query or mutation matching fetch type ".concat(raFetchType, " could be found for resource ").concat(resource.type.name));
            }
            var variables = buildVariablesImpl(introspectionResults)(resource, raFetchType, params, queryType);
            var query = buildGqlQueryImpl(introspectionResults)(resource, raFetchType, queryType, variables);
            var parseResponse = getResponseParserImpl(introspectionResults)(raFetchType, resource, queryType);
            return {
                query: query,
                variables: variables,
                parseResponse: parseResponse,
            };
        };
        return buildQuery;
    };
};
exports.buildQueryFactory = buildQueryFactory;
exports.default = (0, exports.buildQueryFactory)(buildVariables_1.default, buildGqlQuery_1.default, getResponseParser_1.default);
//# sourceMappingURL=buildQuery.js.map