import { IntrospectionField } from 'graphql';
import { IntrospectionResult, IntrospectedResource } from 'ra-data-graphql';
declare const _default: (introspectionResults: IntrospectionResult) => (resource: IntrospectedResource, raFetchMethod: string, params: any, queryType: IntrospectionField) => {
    id: any;
} | Partial<{
    filter: {
        [key: string]: any;
    };
    page: number;
    perPage: number;
    sortField: string;
    sortOrder: string;
}>;
export default _default;
//# sourceMappingURL=buildVariables.d.ts.map