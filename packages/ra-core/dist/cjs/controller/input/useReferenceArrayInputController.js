"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReferenceArrayInputController = void 0;
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var dataProvider_1 = require("../../dataProvider");
var useReferenceParams_1 = require("./useReferenceParams");
/**
 * Prepare data for the ReferenceArrayInput components
 *
 * @example
 *
 * const { allChoices, availableChoices, selectedChoices, error, isFetching, isLoading } = useReferenceArrayInputController({
 *      record: { referenceIds: ['id1', 'id2']};
 *      reference: 'reference';
 *      resource: 'resource';
 *      source: 'referenceIds';
 * });
 *
 * @param {Object} props
 * @param {Object} props.record The current resource record
 * @param {string} props.reference The linked resource name
 * @param {string} props.resource The current resource name
 * @param {string} props.source The key of the linked resource identifier
 *
 * @param {Props} props
 *
 * @return {Object} controllerProps Fetched data and callbacks for the ReferenceArrayInput components
 */
var useReferenceArrayInputController = function (props) {
    var _a;
    var debounce = props.debounce, enableGetChoices = props.enableGetChoices, filter = props.filter, _b = props.page, initialPage = _b === void 0 ? 1 : _b, _c = props.perPage, initialPerPage = _c === void 0 ? 25 : _c, _d = props.sort, initialSort = _d === void 0 ? { field: 'id', order: 'DESC' } : _d, _e = props.queryOptions, queryOptions = _e === void 0 ? {} : _e, reference = props.reference, source = props.source;
    var getValues = (0, react_hook_form_1.useFormContext)().getValues;
    // When we change the defaultValue of the child input using react-hook-form resetField function,
    // useWatch does not seem to get the new value. We fallback to getValues to get it.
    var value = (_a = (0, react_hook_form_1.useWatch)({ name: source })) !== null && _a !== void 0 ? _a : getValues(source);
    /**
     * Get the records related to the current value (with getMany)
     */
    var _f = (0, dataProvider_1.useGetManyAggregate)(reference, {
        ids: value || EmptyArray,
    }, {
        enabled: value != null && value.length > 0,
    }), referenceRecords = _f.data, errorGetMany = _f.error, isLoadingGetMany = _f.isLoading, isFetchingGetMany = _f.isFetching, refetchGetMany = _f.refetch;
    var _g = (0, useReferenceParams_1.useReferenceParams)({
        resource: reference,
        page: initialPage,
        perPage: initialPerPage,
        sort: initialSort,
        debounce: debounce,
        filter: filter,
    }), params = _g[0], paramsModifiers = _g[1];
    // filter out not found references - happens when the dataProvider doesn't guarantee referential integrity
    var finalReferenceRecords = referenceRecords
        ? referenceRecords.filter(Boolean)
        : [];
    var isGetMatchingEnabled = enableGetChoices
        ? enableGetChoices(params.filterValues)
        : true;
    var _h = (0, dataProvider_1.useGetList)(reference, {
        pagination: {
            page: params.page,
            perPage: params.perPage,
        },
        sort: { field: params.sort, order: params.order },
        filter: __assign(__assign({}, params.filter), filter),
    }, __assign({ retry: false, enabled: isGetMatchingEnabled }, queryOptions)), matchingReferences = _h.data, total = _h.total, pageInfo = _h.pageInfo, errorGetList = _h.error, isLoadingGetList = _h.isLoading, isFetchingGetList = _h.isFetching, refetchGetMatching = _h.refetch;
    // We merge the currently selected records with the matching ones, otherwise
    // the component displaying the currently selected records may fail
    var finalMatchingReferences = matchingReferences && matchingReferences.length > 0
        ? mergeReferences(matchingReferences, finalReferenceRecords)
        : finalReferenceRecords.length > 0
            ? finalReferenceRecords
            : matchingReferences;
    var refetch = (0, react_1.useCallback)(function () {
        refetchGetMany();
        refetchGetMatching();
    }, [refetchGetMany, refetchGetMatching]);
    var currentSort = (0, react_1.useMemo)(function () { return ({
        field: params.sort,
        order: params.order,
    }); }, [params.sort, params.order]);
    return {
        sort: currentSort,
        allChoices: finalMatchingReferences,
        availableChoices: matchingReferences,
        selectedChoices: finalReferenceRecords,
        displayedFilters: params.displayedFilters,
        error: errorGetMany || errorGetList,
        filter: filter,
        filterValues: params.filterValues,
        hideFilter: paramsModifiers.hideFilter,
        isFetching: isFetchingGetMany || isFetchingGetList,
        isLoading: isLoadingGetMany || isLoadingGetList,
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
        total: total,
        hasNextPage: pageInfo
            ? pageInfo.hasNextPage
            : total != null
                ? params.page * params.perPage < total
                : undefined,
        hasPreviousPage: pageInfo ? pageInfo.hasPreviousPage : params.page > 1,
        isFromReference: true,
    };
};
exports.useReferenceArrayInputController = useReferenceArrayInputController;
var EmptyArray = [];
// concatenate and deduplicate two lists of records
var mergeReferences = function (ref1, ref2) {
    var res = __spreadArray([], ref1, true);
    var ids = ref1.map(function (ref) { return ref.id; });
    ref2.forEach(function (ref) {
        if (!ids.includes(ref.id)) {
            ids.push(ref.id);
            res.push(ref);
        }
    });
    return res;
};
//# sourceMappingURL=useReferenceArrayInputController.js.map