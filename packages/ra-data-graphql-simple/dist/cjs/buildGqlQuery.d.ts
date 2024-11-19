import { IntrospectionResult, IntrospectedResource } from 'ra-data-graphql';
import { ArgumentNode, IntrospectionField, IntrospectionInputValue, IntrospectionNamedTypeRef, IntrospectionObjectType, TypeNode, VariableDefinitionNode } from 'graphql';
declare const _default: (introspectionResults: IntrospectionResult) => (resource: IntrospectedResource, raFetchMethod: string, queryType: IntrospectionField, variables: any) => any;
export default _default;
export declare const buildFields: (introspectionResults: IntrospectionResult, paths?: any[]) => (fields: any) => any;
export declare const buildFragments: (introspectionResults: IntrospectionResult) => (possibleTypes: readonly IntrospectionNamedTypeRef<IntrospectionObjectType>[]) => any[];
export declare const buildArgs: (query: IntrospectionField, variables: any) => ArgumentNode[];
export declare const buildApolloArgs: (query: IntrospectionField, variables: any) => VariableDefinitionNode[];
export declare const getArgType: (arg: IntrospectionInputValue) => TypeNode;
//# sourceMappingURL=buildGqlQuery.d.ts.map