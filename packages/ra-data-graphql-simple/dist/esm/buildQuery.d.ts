import { IntrospectionResult, BuildQuery } from 'ra-data-graphql';
export declare const buildQueryFactory: (buildVariablesImpl?: (introspectionResults: IntrospectionResult) => (resource: import("ra-data-graphql").IntrospectedResource, raFetchMethod: string, params: any, queryType: import("graphql").IntrospectionField) => {
    id: any;
} | Partial<{
    filter: {
        [key: string]: any;
    };
    page: number;
    perPage: number;
    sortField: string;
    sortOrder: string;
}>, buildGqlQueryImpl?: (introspectionResults: IntrospectionResult) => (resource: import("ra-data-graphql").IntrospectedResource, raFetchMethod: string, queryType: import("graphql").IntrospectionField, variables: any) => any, getResponseParserImpl?: (introspectionResults: IntrospectionResult) => (raFetchMethod: string, resource: import("ra-data-graphql").IntrospectedResource, queryType: import("graphql").IntrospectionField) => (response: import("@apollo/client").ApolloQueryResult<any>) => {
    data: any;
    total: any;
} | {
    data: any;
    total?: undefined;
}) => (introspectionResults: IntrospectionResult) => BuildQuery;
declare const _default: (introspectionResults: IntrospectionResult) => BuildQuery;
export default _default;
//# sourceMappingURL=buildQuery.d.ts.map