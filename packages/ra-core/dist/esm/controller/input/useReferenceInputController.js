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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useGetList } from '../../dataProvider';
import { useReference } from '../useReference';
import { useReferenceParams } from './useReferenceParams';
var defaultReferenceSource = function (resource, source) {
    return "".concat(resource, "@").concat(source);
};
/**
 * A hook for choosing a reference record. Useful for foreign keys.
 *
 * This hook fetches the possible values in the reference resource
 * (using `dataProvider.getList()`), it returns the possible choices
 * as the `choices` attribute.
 *
 * @example
 * const {
 *      choices, // the available reference resource
 * } = useReferenceInputController({
 *      input, // the input props
 *      resource: 'comments',
 *      reference: 'posts',
 *      source: 'post_id',
 * });
 *
 * The hook also allow to filter results. It returns a `setFilters`
 * function. It uses the value to create a filter for the query.
 * You can also add a permanentFilter to further filter the result:
 *
 * @example
 * const {
 *      choices, // the available reference resource
 *      setFilter,
 * } = useReferenceInputController({
 *      input, // the input props
 *      resource: 'comments',
 *      reference: 'posts',
 *      source: 'post_id',
 *      permanentFilter: {
 *          author: 'john'
 *      },
 * });
 */
export var useReferenceInputController = function (props) {
    var debounce = props.debounce, enableGetChoices = props.enableGetChoices, filter = props.filter, _a = props.page, initialPage = _a === void 0 ? 1 : _a, _b = props.perPage, initialPerPage = _b === void 0 ? 25 : _b, initialSort = props.sort, _c = props.queryOptions, queryOptions = _c === void 0 ? {} : _c, reference = props.reference, source = props.source;
    var meta = queryOptions.meta, otherQueryOptions = __rest(queryOptions, ["meta"]);
    var _d = useReferenceParams({
        resource: reference,
        page: initialPage,
        perPage: initialPerPage,
        sort: initialSort,
        debounce: debounce,
        filter: filter,
    }), params = _d[0], paramsModifiers = _d[1];
    // selection logic
    var currentValue = useWatch({ name: source });
    var isGetMatchingEnabled = enableGetChoices
        ? enableGetChoices(params.filterValues)
        : true;
    // fetch possible values
    var _e = useGetList(reference, {
        pagination: {
            page: params.page,
            perPage: params.perPage,
        },
        sort: { field: params.sort, order: params.order },
        filter: __assign(__assign({}, params.filter), filter),
        meta: meta,
    }, __assign({ enabled: isGetMatchingEnabled, keepPreviousData: true }, otherQueryOptions)), _f = _e.data, possibleValuesData = _f === void 0 ? [] : _f, total = _e.total, pageInfo = _e.pageInfo, possibleValuesFetching = _e.isFetching, possibleValuesLoading = _e.isLoading, possibleValuesError = _e.error, refetchGetList = _e.refetch;
    // fetch current value
    var _g = useReference({
        id: currentValue,
        reference: reference,
        options: {
            enabled: currentValue != null && currentValue !== '',
        },
    }), referenceRecord = _g.referenceRecord, refetchReference = _g.refetch, referenceError = _g.error, referenceLoading = _g.isLoading, referenceFetching = _g.isFetching;
    // add current value to possible sources
    var finalData, finalTotal;
    if (!referenceRecord ||
        possibleValuesData.find(function (record) { return record.id === referenceRecord.id; })) {
        finalData = possibleValuesData;
        finalTotal = total;
    }
    else {
        finalData = __spreadArray([referenceRecord], possibleValuesData, true);
        finalTotal = total == null ? undefined : total + 1;
    }
    var refetch = useCallback(function () {
        refetchGetList();
        refetchReference();
    }, [refetchGetList, refetchReference]);
    var currentSort = useMemo(function () { return ({
        field: params.sort,
        order: params.order,
    }); }, [params.sort, params.order]);
    return {
        sort: currentSort,
        allChoices: finalData,
        availableChoices: possibleValuesData,
        selectedChoices: [referenceRecord],
        displayedFilters: params.displayedFilters,
        error: referenceError || possibleValuesError,
        filter: params.filter,
        filterValues: params.filterValues,
        hideFilter: paramsModifiers.hideFilter,
        isFetching: referenceFetching || possibleValuesFetching,
        isLoading: referenceLoading || possibleValuesLoading,
        page: params.page,
        perPage: params.perPage,
        refetch: refetch,
        resource: reference,
        setFilters: paramsModifiers.setFilters,
        setPage: paramsModifiers.setPage,
        setPerPage: paramsModifiers.setPerPage,
        setSort: paramsModifiers.setSort,
        showFilter: paramsModifiers.showFilter,
        source: source,
        total: finalTotal,
        hasNextPage: pageInfo
            ? pageInfo.hasNextPage
            : total != null
                ? params.page * params.perPage < total
                : undefined,
        hasPreviousPage: pageInfo ? pageInfo.hasPreviousPage : params.page > 1,
        isFromReference: true,
    };
};
//# sourceMappingURL=useReferenceInputController.js.map