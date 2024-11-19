import buildVariables from './buildVariables';
import buildGqlQuery from './buildGqlQuery';
import getResponseParser from './getResponseParser';
export var buildQueryFactory = function (buildVariablesImpl, buildGqlQueryImpl, getResponseParserImpl) {
    if (buildVariablesImpl === void 0) { buildVariablesImpl = buildVariables; }
    if (buildGqlQueryImpl === void 0) { buildGqlQueryImpl = buildGqlQuery; }
    if (getResponseParserImpl === void 0) { getResponseParserImpl = getResponseParser; }
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
export default buildQueryFactory(buildVariables, buildGqlQuery, getResponseParser);
//# sourceMappingURL=buildQuery.js.map