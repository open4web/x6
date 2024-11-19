import { DataProvider } from 'ra-core';
/**
 * Respond to react-admin data queries using a localForage for storage.
 *
 * Useful for local-first web apps.
 *
 * @example // initialize with no data
 *
 * import localForageDataProvider from 'ra-data-local-forage';
 * const dataProvider = await localForageDataProvider();
 *
 * @example // initialize with default data (will be ignored if data has been modified by user)
 *
 * import localForageDataProvider from 'ra-data-local-forage';
 * const dataProvider = await localForageDataProvider({
 *   defaultData: {
 *     posts: [
 *       { id: 0, title: 'Hello, world!' },
 *       { id: 1, title: 'FooBar' },
 *     ],
 *     comments: [
 *       { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
 *       { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
 *     ],
 *   }
 * });
 */
declare const _default: (params?: LocalForageDataProviderParams) => Promise<DataProvider>;
export default _default;
export interface LocalForageDataProviderParams {
    defaultData?: any;
    prefixLocalForageKey?: string;
    loggingEnabled?: boolean;
}
//# sourceMappingURL=index.d.ts.map