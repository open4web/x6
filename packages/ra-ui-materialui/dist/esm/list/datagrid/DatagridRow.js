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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import React, { isValidElement, cloneElement, createElement, useState, useEffect, useCallback, memo, } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { TableCell, TableRow, Checkbox } from '@mui/material';
import { RecordContextProvider, shallowEqual, useExpanded, useResourceContext, useTranslate, useCreatePath, useRecordContext, } from 'ra-core';
import { useNavigate } from 'react-router-dom';
import DatagridCell from './DatagridCell';
import ExpandRowButton from './ExpandRowButton';
import { DatagridClasses } from './useDatagridStyles';
import { useDatagridContext } from './useDatagridContext';
var computeNbColumns = function (expand, children, hasBulkActions) {
    return expand
        ? 1 + // show expand button
            (hasBulkActions ? 1 : 0) + // checkbox column
            React.Children.toArray(children).filter(function (child) { return !!child; }).length // non-null children
        : 0;
}; // we don't need to compute columns if there is no expand panel;
var DatagridRow = React.forwardRef(function (props, ref) {
    var _a, _b;
    var children = props.children, className = props.className, expand = props.expand, hasBulkActions = props.hasBulkActions, hover = props.hover, id = props.id, onToggleItem = props.onToggleItem, recordOverride = props.record, rowClick = props.rowClick, selected = props.selected, style = props.style, selectable = props.selectable, rest = __rest(props, ["children", "className", "expand", "hasBulkActions", "hover", "id", "onToggleItem", "record", "rowClick", "selected", "style", "selectable"]);
    var context = useDatagridContext();
    var translate = useTranslate();
    var record = useRecordContext(props);
    var expandable = (!context ||
        !context.isRowExpandable ||
        context.isRowExpandable(record)) &&
        expand;
    var resource = useResourceContext(props);
    var createPath = useCreatePath();
    var _c = useExpanded(resource, id, context && context.expandSingle), expanded = _c[0], toggleExpanded = _c[1];
    var _d = useState(function () {
        return computeNbColumns(expandable, children, hasBulkActions);
    }), nbColumns = _d[0], setNbColumns = _d[1];
    useEffect(function () {
        // Fields can be hidden dynamically based on permissions;
        // The expand panel must span over the remaining columns
        // So we must recompute the number of columns to span on
        var newNbColumns = computeNbColumns(expandable, children, hasBulkActions);
        if (newNbColumns !== nbColumns) {
            setNbColumns(newNbColumns);
        }
    }, [expandable, nbColumns, children, hasBulkActions]);
    var navigate = useNavigate();
    var handleToggleExpand = useCallback(function (event) {
        toggleExpanded();
        event.stopPropagation();
    }, [toggleExpanded]);
    var handleToggleSelection = useCallback(function (event) {
        if (!selectable)
            return;
        onToggleItem(id, event);
        event.stopPropagation();
    }, [id, onToggleItem, selectable]);
    var handleClick = useCallback(function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var type, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    event.persist();
                    if (!(typeof rowClick === 'function')) return [3 /*break*/, 2];
                    return [4 /*yield*/, rowClick(id, resource, record)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = rowClick;
                    _b.label = 3;
                case 3:
                    type = _a;
                    if (type === false || type == null) {
                        return [2 /*return*/];
                    }
                    if (['edit', 'show'].includes(type)) {
                        navigate(createPath({ resource: resource, id: id, type: type }));
                        return [2 /*return*/];
                    }
                    if (type === 'expand') {
                        handleToggleExpand(event);
                        return [2 /*return*/];
                    }
                    if (type === 'toggleSelection') {
                        handleToggleSelection(event);
                        return [2 /*return*/];
                    }
                    navigate(type);
                    return [2 /*return*/];
            }
        });
    }); }, [
        rowClick,
        id,
        resource,
        record,
        navigate,
        createPath,
        handleToggleExpand,
        handleToggleSelection,
    ]);
    return (React.createElement(RecordContextProvider, { value: record },
        React.createElement(TableRow, __assign({ ref: ref, className: clsx(className, (_a = {},
                _a[DatagridClasses.expandable] = expandable,
                _a[DatagridClasses.selectable] = selectable,
                _a[DatagridClasses.clickableRow] = typeof rowClick === 'function' ? true : rowClick,
                _a)), key: id, style: style, hover: hover, onClick: handleClick }, rest),
            expand && (React.createElement(TableCell, { padding: "none", className: DatagridClasses.expandIconCell }, expandable && (React.createElement(ExpandRowButton, { className: clsx(DatagridClasses.expandIcon, (_b = {},
                    _b[DatagridClasses.expanded] = expanded,
                    _b)), expanded: expanded, onClick: handleToggleExpand, expandContentId: "".concat(id, "-expand") })))),
            hasBulkActions && (React.createElement(TableCell, { padding: "checkbox" }, selectable && (React.createElement(Checkbox, { "aria-label": translate('ra.action.select_row', {
                    _: 'Select this row',
                }), color: "primary", className: "select-item ".concat(DatagridClasses.checkbox), checked: selected, onClick: handleToggleSelection })))),
            React.Children.map(children, function (field, index) {
                return isValidElement(field) ? (React.createElement(DatagridCell, __assign({ key: "".concat(id, "-").concat(field.props.source || index), className: clsx("column-".concat(field.props.source), DatagridClasses.rowCell), record: record }, { field: field, resource: resource }))) : null;
            })),
        expandable && expanded && (React.createElement(TableRow, { key: "".concat(id, "-expand"), id: "".concat(id, "-expand"), className: DatagridClasses.expandedPanel },
            React.createElement(TableCell, { colSpan: nbColumns }, isValidElement(expand)
                ? cloneElement(expand, {
                    // @ts-ignore
                    record: record,
                    resource: resource,
                    id: String(id),
                })
                : createElement(expand, {
                    record: record,
                    resource: resource,
                    id: String(id),
                }))))));
});
DatagridRow.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    // @ts-ignore
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
    id: PropTypes.any,
    onToggleItem: PropTypes.func,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    // @ts-ignore
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    selected: PropTypes.bool,
    style: PropTypes.object,
    selectable: PropTypes.bool,
};
DatagridRow.defaultProps = {
    hasBulkActions: false,
    hover: true,
    selected: false,
    selectable: true,
};
var areEqual = function (prevProps, nextProps) {
    var _1 = prevProps.children, _2 = prevProps.expand, prevPropsWithoutChildren = __rest(prevProps, ["children", "expand"]);
    var _3 = nextProps.children, _4 = nextProps.expand, nextPropsWithoutChildren = __rest(nextProps, ["children", "expand"]);
    return shallowEqual(prevPropsWithoutChildren, nextPropsWithoutChildren);
};
export var PureDatagridRow = memo(DatagridRow, areEqual);
PureDatagridRow.displayName = 'PureDatagridRow';
export default DatagridRow;
//# sourceMappingURL=DatagridRow.js.map