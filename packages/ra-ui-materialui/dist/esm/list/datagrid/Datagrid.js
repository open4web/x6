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
import * as React from 'react';
import { cloneElement, createElement, isValidElement, useCallback, useRef, useEffect, useMemo, } from 'react';
import PropTypes from 'prop-types';
import { sanitizeListRestProps, useListContext, } from 'ra-core';
import { Table } from '@mui/material';
import clsx from 'clsx';
import union from 'lodash/union';
import difference from 'lodash/difference';
import { DatagridHeader } from './DatagridHeader';
import DatagridLoading from './DatagridLoading';
import DatagridBody, { PureDatagridBody } from './DatagridBody';
import DatagridContextProvider from './DatagridContextProvider';
import { DatagridClasses, DatagridRoot } from './useDatagridStyles';
import { BulkActionsToolbar } from '../BulkActionsToolbar';
import { BulkDeleteButton } from '../../button';
var defaultBulkActionButtons = React.createElement(BulkDeleteButton, null);
/**
 * The Datagrid component renders a list of records as a table.
 * It is usually used as a child of the <List> and <ReferenceManyField> components.
 *
 * Props:
 *  - body
 *  - bulkActionButtons
 *  - children
 *  - empty
 *  - expand
 *  - header
 *  - hover
 *  - isRowExpandable
 *  - isRowSelectable
 *  - optimized
 *  - rowStyle
 *  - rowClick
 *  - size
 *  - sx
 *
 * @example // Display all posts as a datagrid
 * const postRowStyle = (record, index) => ({
 *     backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = (props) => (
 *     <List {...props}>
 *         <Datagrid rowStyle={postRowStyle}>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <TextField source="body" />
 *             <EditButton />
 *         </Datagrid>
 *     </List>
 * );
 *
 * @example // Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 *
 * @example // Usage outside of a <List> or a <ReferenceManyField>.
 *
 * const sort = { field: 'published_at', order: 'DESC' };
 *
 * export const MyCustomList = (props) => {
 *     const { data, total, isLoading } = useGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: sort }
 *     );
 *
 *     return (
 *         <Datagrid
 *             data={data}
 *             total={total}
 *             isLoading={isLoading}
 *             sort={sort}
 *             selectedIds={[]}
 *             setSort={() => {
 *                 console.log('set sort');
 *             }}
 *             onSelect={() => {
 *                 console.log('on select');
 *             }}
 *             onToggleItem={() => {
 *                 console.log('on toggle item');
 *             }}
 *         >
 *             <TextField source="id" />
 *             <TextField source="title" />
 *         </Datagrid>
 *     );
 * }
 */
export var Datagrid = React.forwardRef(function (props, ref) {
    var _a = props.optimized, optimized = _a === void 0 ? false : _a, _b = props.body, body = _b === void 0 ? optimized ? PureDatagridBody : DatagridBody : _b, _c = props.header, header = _c === void 0 ? DatagridHeader : _c, children = props.children, className = props.className, empty = props.empty, expand = props.expand, _d = props.bulkActionButtons, bulkActionButtons = _d === void 0 ? defaultBulkActionButtons : _d, hover = props.hover, isRowSelectable = props.isRowSelectable, isRowExpandable = props.isRowExpandable, resource = props.resource, rowClick = props.rowClick, rowStyle = props.rowStyle, _e = props.size, size = _e === void 0 ? 'small' : _e, sx = props.sx, _f = props.expandSingle, expandSingle = _f === void 0 ? false : _f, rest = __rest(props, ["optimized", "body", "header", "children", "className", "empty", "expand", "bulkActionButtons", "hover", "isRowSelectable", "isRowExpandable", "resource", "rowClick", "rowStyle", "size", "sx", "expandSingle"]);
    var _g = useListContext(props), sort = _g.sort, data = _g.data, isLoading = _g.isLoading, onSelect = _g.onSelect, onToggleItem = _g.onToggleItem, selectedIds = _g.selectedIds, setSort = _g.setSort, total = _g.total;
    var hasBulkActions = !!bulkActionButtons !== false;
    var contextValue = useMemo(function () { return ({ isRowExpandable: isRowExpandable, expandSingle: expandSingle }); }, [
        isRowExpandable,
        expandSingle,
    ]);
    var lastSelected = useRef(null);
    useEffect(function () {
        if (!selectedIds || selectedIds.length === 0) {
            lastSelected.current = null;
        }
    }, [JSON.stringify(selectedIds)]); // eslint-disable-line react-hooks/exhaustive-deps
    // we manage row selection at the datagrid level to allow shift+click to select an array of rows
    var handleToggleItem = useCallback(function (id, event) {
        var ids = data.map(function (record) { return record.id; });
        var lastSelectedIndex = ids.indexOf(lastSelected.current);
        lastSelected.current = event.target.checked ? id : null;
        if (event.shiftKey && lastSelectedIndex !== -1) {
            var index = ids.indexOf(id);
            var idsBetweenSelections = ids.slice(Math.min(lastSelectedIndex, index), Math.max(lastSelectedIndex, index) + 1);
            var newSelectedIds = event.target.checked
                ? union(selectedIds, idsBetweenSelections)
                : difference(selectedIds, idsBetweenSelections);
            onSelect(isRowSelectable
                ? newSelectedIds.filter(function (id) {
                    return isRowSelectable(data.find(function (record) { return record.id === id; }));
                })
                : newSelectedIds);
        }
        else {
            onToggleItem(id);
        }
    }, [data, isRowSelectable, onSelect, onToggleItem, selectedIds]);
    if (isLoading === true) {
        return (React.createElement(DatagridLoading, { className: className, expand: expand, hasBulkActions: hasBulkActions, nbChildren: React.Children.count(children), size: size }));
    }
    /**
     * Once loaded, the data for the list may be empty. Instead of
     * displaying the table header with zero data rows,
     * the datagrid displays nothing or a custom empty component.
     */
    if (data == null || data.length === 0 || total === 0) {
        if (empty) {
            return empty;
        }
        return null;
    }
    /**
     * After the initial load, if the data for the list isn't empty,
     * and even if the data is refreshing (e.g. after a filter change),
     * the datagrid displays the current data.
     */
    return (React.createElement(DatagridContextProvider, { value: contextValue },
        React.createElement(DatagridRoot, { sx: sx },
            bulkActionButtons !== false ? (React.createElement(BulkActionsToolbar, { selectedIds: selectedIds }, isValidElement(bulkActionButtons)
                ? bulkActionButtons
                : defaultBulkActionButtons)) : null,
            React.createElement("div", { className: DatagridClasses.tableWrapper },
                React.createElement(Table, __assign({ ref: ref, className: clsx(DatagridClasses.table, className), size: size }, sanitizeRestProps(rest)),
                    createOrCloneElement(header, {
                        children: children,
                        sort: sort,
                        data: data,
                        hasExpand: !!expand,
                        hasBulkActions: hasBulkActions,
                        isRowSelectable: isRowSelectable,
                        onSelect: onSelect,
                        resource: resource,
                        selectedIds: selectedIds,
                        setSort: setSort,
                    }, children),
                    createOrCloneElement(body, {
                        expand: expand,
                        rowClick: rowClick,
                        data: data,
                        hasBulkActions: hasBulkActions,
                        hover: hover,
                        onToggleItem: handleToggleItem,
                        resource: resource,
                        rowStyle: rowStyle,
                        selectedIds: selectedIds,
                        isRowSelectable: isRowSelectable,
                    }, children))))));
});
var createOrCloneElement = function (element, props, children) {
    return isValidElement(element)
        ? cloneElement(element, props, children)
        : createElement(element, props, children);
};
Datagrid.propTypes = {
    // @ts-ignore
    body: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    // @ts-ignore-line
    bulkActionButtons: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.arrayOf(PropTypes.any),
    empty: PropTypes.element,
    // @ts-ignore
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    // @ts-ignore
    header: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hover: PropTypes.bool,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    setSort: PropTypes.func,
    total: PropTypes.number,
    isRowSelectable: PropTypes.func,
    isRowExpandable: PropTypes.func,
    expandSingle: PropTypes.bool,
};
var injectedProps = [
    'isRequired',
    'setFilter',
    'setPagination',
    'limitChoicesToValue',
    'translateChoice',
    // Datagrid may be used as an alternative to SelectInput
    'field',
    'fieldState',
    'formState',
];
var sanitizeRestProps = function (props) {
    return Object.keys(sanitizeListRestProps(props))
        .filter(function (propName) { return !injectedProps.includes(propName); })
        .reduce(function (acc, key) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[key] = props[key], _a)));
    }, {});
};
Datagrid.displayName = 'Datagrid';
//# sourceMappingURL=Datagrid.js.map