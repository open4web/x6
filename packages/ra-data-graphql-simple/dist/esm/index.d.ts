import { BuildQueryFactory, Options } from 'ra-data-graphql';
import { DataProvider } from 'ra-core';
export declare const buildQuery: (introspectionResults: import("ra-data-graphql").IntrospectionResult) => import("ra-data-graphql").BuildQuery;
declare const _default: (options: Omit<Options, 'buildQuery'> & {
    buildQuery?: BuildQueryFactory;
}) => Promise<DataProvider>;
export default _default;
//# sourceMappingURL=index.d.ts.map