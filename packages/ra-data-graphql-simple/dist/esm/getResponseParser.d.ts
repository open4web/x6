import { IntrospectionResult, IntrospectedResource } from 'ra-data-graphql';
import { IntrospectionField } from 'graphql';
import { ApolloQueryResult } from '@apollo/client';
declare const _default: (introspectionResults: IntrospectionResult) => (raFetchMethod: string, resource: IntrospectedResource, queryType: IntrospectionField) => (response: ApolloQueryResult<any>) => {
    data: any;
    total: any;
} | {
    data: any;
    total?: undefined;
};
export default _default;
//# sourceMappingURL=getResponseParser.d.ts.map