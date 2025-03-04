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
import set from 'lodash/set';
import removeEmpty from '../../util/removeEmpty';
import removeKey from '../../util/removeKey';
export var SET_SORT = 'SET_SORT';
export var SORT_ASC = 'ASC';
export var SORT_DESC = 'DESC';
export var SET_PAGE = 'SET_PAGE';
export var SET_PER_PAGE = 'SET_PER_PAGE';
export var SET_FILTER = 'SET_FILTER';
export var SHOW_FILTER = 'SHOW_FILTER';
export var HIDE_FILTER = 'HIDE_FILTER';
var oppositeOrder = function (direction) {
    return direction === SORT_DESC ? SORT_ASC : SORT_DESC;
};
/**
 * This reducer is for the react-router query string.
 */
export var queryReducer = function (previousState, action) {
    var _a;
    switch (action.type) {
        case SET_SORT:
            if (action.payload.field === previousState.sort) {
                return __assign(__assign({}, previousState), { order: oppositeOrder(previousState.order), page: 1 });
            }
            return __assign(__assign({}, previousState), { sort: action.payload.field, order: action.payload.order || SORT_ASC, page: 1 });
        case SET_PAGE:
            return __assign(__assign({}, previousState), { page: action.payload });
        case SET_PER_PAGE:
            return __assign(__assign({}, previousState), { page: 1, perPage: action.payload });
        case SET_FILTER: {
            return __assign(__assign({}, previousState), { page: 1, filter: action.payload.filter, displayedFilters: action.payload.displayedFilters
                    ? action.payload.displayedFilters
                    : previousState.displayedFilters });
        }
        case SHOW_FILTER: {
            if (previousState.displayedFilters &&
                previousState.displayedFilters[action.payload.filterName]) {
                // the filter is already shown
                return previousState;
            }
            return __assign(__assign({}, previousState), { filter: typeof action.payload.defaultValue !== 'undefined'
                    ? set(previousState.filter, action.payload.filterName, action.payload.defaultValue)
                    : previousState.filter, 
                // we don't use lodash.set() for displayed filters
                // to avoid problems with compound filter names (e.g. 'author.name')
                displayedFilters: __assign(__assign({}, previousState.displayedFilters), (_a = {}, _a[action.payload.filterName] = true, _a)) });
        }
        case HIDE_FILTER: {
            return __assign(__assign({}, previousState), { filter: removeEmpty(removeKey(previousState.filter, action.payload)), 
                // we don't use lodash.set() for displayed filters
                // to avoid problems with compound filter names (e.g. 'author.name')
                displayedFilters: previousState.displayedFilters
                    ? Object.keys(previousState.displayedFilters).reduce(function (filters, filter) {
                        var _a;
                        return filter !== action.payload
                            ? __assign(__assign({}, filters), (_a = {}, _a[filter] = true, _a)) : filters;
                    }, {})
                    : previousState.displayedFilters });
        }
        default:
            return previousState;
    }
};
export default queryReducer;
//# sourceMappingURL=queryReducer.js.map