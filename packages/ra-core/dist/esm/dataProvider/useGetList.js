var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useMemo } from 'react';
import { useQuery, useQueryClient, } from 'react-query';
import { useDataProvider } from './useDataProvider';
/**
 * Call the dataProvider.getList() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { isLoading: true, refetch }
 * - success: { data: [data from store], total: [total from response], isLoading: false, refetch }
 * - error: { error: [error from response], isLoading: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Params} params The getList parameters { pagination, sort, filter, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @prop params.sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @prop params.filter The request filters, e.g. { title: 'hello, world' }
 * @prop params.meta Optional meta parameters
 *
 * @returns The current request state. Destructure as { data, total, error, isLoading, refetch }.
 *
 * @example
 *
 * import { useGetList } from 'react-admin';
 *
 * const LatestNews = () => {
 *     const { data, total, isLoading, error } = useGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
 *     );
 *     if (isLoading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{data.map(item =>
 *         <li key={item.id}>{item.title}</li>
 *     )}</ul>;
 * };
 */
export var useGetList = function (resource, params, options) {
    if (params === void 0) { params = {}; }
    var _a = params.pagination, pagination = _a === void 0 ? { page: 1, perPage: 25 } : _a, _b = params.sort, sort = _b === void 0 ? { field: 'id', order: 'DESC' } : _b, _c = params.filter, filter = _c === void 0 ? {} : _c, meta = params.meta;
    var dataProvider = useDataProvider();
    var queryClient = useQueryClient();
    var result = useQuery([resource, 'getList', { pagination: pagination, sort: sort, filter: filter, meta: meta }], function () {
        return dataProvider
            .getList(resource, {
            pagination: pagination,
            sort: sort,
            filter: filter,
            meta: meta,
        })
            .then(function (_a) {
            var data = _a.data, total = _a.total, pageInfo = _a.pageInfo;
            return ({
                data: data,
                total: total,
                pageInfo: pageInfo,
            });
        });
    }, __assign(__assign({}, options), { onSuccess: function (value) {
            var data = value.data;
            // optimistically populate the getOne cache
            data.forEach(function (record) {
                queryClient.setQueryData([resource, 'getOne', { id: String(record.id), meta: meta }], function (oldRecord) { return oldRecord !== null && oldRecord !== void 0 ? oldRecord : record; });
            });
            // execute call-time onSuccess if provided
            if (options === null || options === void 0 ? void 0 : options.onSuccess) {
                options.onSuccess(value);
            }
        } }));
    return useMemo(function () {
        var _a, _b, _c;
        return result.data
            ? __assign(__assign({}, result), { data: (_a = result.data) === null || _a === void 0 ? void 0 : _a.data, total: (_b = result.data) === null || _b === void 0 ? void 0 : _b.total, pageInfo: (_c = result.data) === null || _c === void 0 ? void 0 : _c.pageInfo }) : result;
    }, [result]);
};
//# sourceMappingURL=useGetList.js.map