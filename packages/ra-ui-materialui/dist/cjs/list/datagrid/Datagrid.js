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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Datagrid = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var prop_types_1 = __importDefault(require("prop-types"));
var ra_core_1 = require("ra-core");
var material_1 = require("@mui/material");
var clsx_1 = __importDefault(require("clsx"));
var union_1 = __importDefault(require("lodash/union"));
var difference_1 = __importDefault(require("lodash/difference"));
var DatagridHeader_1 = require("./DatagridHeader");
var DatagridLoading_1 = __importDefault(require("./DatagridLoading"));
var DatagridBody_1 = __importStar(require("./DatagridBody"));
var DatagridContextProvider_1 = __importDefault(require("./DatagridContextProvider"));
var useDatagridStyles_1 = require("./useDatagridStyles");
var BulkActionsToolbar_1 = require("../BulkActionsToolbar");
var button_1 = require("../../button");
var defaultBulkActionButtons = React.createElement(button_1.BulkDeleteButton, null);
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
exports.Datagrid = React.forwardRef(function (props, ref) {
    var _a = props.optimized, optimized = _a === void 0 ? false : _a, _b = props.body, body = _b === void 0 ? optimized ? DatagridBody_1.PureDatagridBody : DatagridBody_1.default : _b, _c = props.header, header = _c === void 0 ? DatagridHeader_1.DatagridHeader : _c, children = props.children, className = props.className, empty = props.empty, expand = props.expand, _d = props.bulkActionButtons, bulkActionButtons = _d === void 0 ? defaultBulkActionButtons : _d, hover = props.hover, isRowSelectable = props.isRowSelectable, isRowExpandable = props.isRowExpandable, resource = props.resource, rowClick = props.rowClick, rowStyle = props.rowStyle, _e = props.size, size = _e === void 0 ? 'small' : _e, sx = props.sx, _f = props.expandSingle, expandSingle = _f === void 0 ? false : _f, rest = __rest(props, ["optimized", "body", "header", "children", "className", "empty", "expand", "bulkActionButtons", "hover", "isRowSelectable", "isRowExpandable", "resource", "rowClick", "rowStyle", "size", "sx", "expandSingle"]);
    var _g = (0, ra_core_1.useListContext)(props), sort = _g.sort, data = _g.data, isLoading = _g.isLoading, onSelect = _g.onSelect, onToggleItem = _g.onToggleItem, selectedIds = _g.selectedIds, setSort = _g.setSort, total = _g.total;
    var hasBulkActions = !!bulkActionButtons !== false;
    var contextValue = (0, react_1.useMemo)(function () { return ({ isRowExpandable: isRowExpandable, expandSingle: expandSingle }); }, [
        isRowExpandable,
        expandSingle,
    ]);
    var lastSelected = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (!selectedIds || selectedIds.length === 0) {
            lastSelected.current = null;
        }
    }, [JSON.stringify(selectedIds)]); // eslint-disable-line react-hooks/exhaustive-deps
    // we manage row selection at the datagrid level to allow shift+click to select an array of rows
    var handleToggleItem = (0, react_1.useCallback)(function (id, event) {
        var ids = data.map(function (record) { return record.id; });
        var lastSelectedIndex = ids.indexOf(lastSelected.current);
        lastSelected.current = event.target.checked ? id : null;
        if (event.shiftKey && lastSelectedIndex !== -1) {
            var index = ids.indexOf(id);
            var idsBetweenSelections = ids.slice(Math.min(lastSelectedIndex, index), Math.max(lastSelectedIndex, index) + 1);
            var newSelectedIds = event.target.checked
                ? (0, union_1.default)(selectedIds, idsBetweenSelections)
                : (0, difference_1.default)(selectedIds, idsBetweenSelections);
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
        return (React.createElement(DatagridLoading_1.default, { className: className, expand: expand, hasBulkActions: hasBulkActions, nbChildren: React.Children.count(children), size: size }));
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
    return (React.createElement(DatagridContextProvider_1.default, { value: contextValue },
        React.createElement(useDatagridStyles_1.DatagridRoot, { sx: sx },
            bulkActionButtons !== false ? (React.createElement(BulkActionsToolbar_1.BulkActionsToolbar, { selectedIds: selectedIds }, (0, react_1.isValidElement)(bulkActionButtons)
                ? bulkActionButtons
                : defaultBulkActionButtons)) : null,
            React.createElement("div", { className: useDatagridStyles_1.DatagridClasses.tableWrapper },
                React.createElement(material_1.Table, __assign({ ref: ref, className: (0, clsx_1.default)(useDatagridStyles_1.DatagridClasses.table, className), size: size }, sanitizeRestProps(rest)),
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
    return (0, react_1.isValidElement)(element)
        ? (0, react_1.cloneElement)(element, props, children)
        : (0, react_1.createElement)(element, props, children);
};
exports.Datagrid.propTypes = {
    // @ts-ignore
    body: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.elementType]),
    // @ts-ignore-line
    bulkActionButtons: prop_types_1.default.oneOfType([prop_types_1.default.bool, prop_types_1.default.element]),
    children: prop_types_1.default.node.isRequired,
    className: prop_types_1.default.string,
    sort: prop_types_1.default.exact({
        field: prop_types_1.default.string,
        order: prop_types_1.default.string,
    }),
    data: prop_types_1.default.arrayOf(prop_types_1.default.any),
    empty: prop_types_1.default.element,
    // @ts-ignore
    expand: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.elementType]),
    // @ts-ignore
    header: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.elementType]),
    hover: prop_types_1.default.bool,
    isLoading: prop_types_1.default.bool,
    onSelect: prop_types_1.default.func,
    onToggleItem: prop_types_1.default.func,
    resource: prop_types_1.default.string,
    rowClick: prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.func]),
    rowStyle: prop_types_1.default.func,
    selectedIds: prop_types_1.default.arrayOf(prop_types_1.default.any),
    setSort: prop_types_1.default.func,
    total: prop_types_1.default.number,
    isRowSelectable: prop_types_1.default.func,
    isRowExpandable: prop_types_1.default.func,
    expandSingle: prop_types_1.default.bool,
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
    return Object.keys((0, ra_core_1.sanitizeListRestProps)(props))
        .filter(function (propName) { return !injectedProps.includes(propName); })
        .reduce(function (acc, key) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[key] = props[key], _a)));
    }, {});
};
exports.Datagrid.displayName = 'Datagrid';
//# sourceMappingURL=Datagrid.js.map