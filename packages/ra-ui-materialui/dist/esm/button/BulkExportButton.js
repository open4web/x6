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
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@mui/icons-material/GetApp';
import { fetchRelatedRecords, useDataProvider, useNotify, useListContext, } from 'ra-core';
import { Button } from './Button';
/**
 * Export the selected rows
 *
 * To be used inside the <List bulkActionButtons> prop.
 *
 * @example // basic usage
 * import * as React from 'react';
 * import { Fragment } from 'react';
 * import { BulkDeleteButton, BulkExportButton } from 'react-admin';
 *
 * const PostBulkActionButtons = () => (
 *     <Fragment>
 *         <BulkExportButton />
 *         <BulkDeleteButton />
 *     </Fragment>
 * );
 *
 * export const PostList = (props) => (
 *     <List {...props} bulkActionButtons={<PostBulkActionButtons />}>
 *         ...
 *     </List>
 * );
 */
export var BulkExportButton = function (props) {
    var onClick = props.onClick, _a = props.label, label = _a === void 0 ? 'ra.action.export' : _a, _b = props.icon, icon = _b === void 0 ? defaultIcon : _b, customExporter = props.exporter, rest = __rest(props, ["onClick", "label", "icon", "exporter"]);
    var _c = useListContext(props), exporterFromContext = _c.exporter, resource = _c.resource, selectedIds = _c.selectedIds;
    var exporter = customExporter || exporterFromContext;
    var dataProvider = useDataProvider();
    var notify = useNotify();
    var handleClick = useCallback(function (event) {
        exporter &&
            dataProvider
                .getMany(resource, { ids: selectedIds })
                .then(function (_a) {
                var data = _a.data;
                return exporter(data, fetchRelatedRecords(dataProvider), dataProvider, resource);
            })
                .catch(function (error) {
                console.error(error);
                notify('ra.notification.http_error', {
                    type: 'warning',
                });
            });
        if (typeof onClick === 'function') {
            onClick(event);
        }
    }, [dataProvider, exporter, notify, onClick, resource, selectedIds]);
    return (React.createElement(Button, __assign({ onClick: handleClick, label: label }, sanitizeRestProps(rest)), icon));
};
var defaultIcon = React.createElement(DownloadIcon, null);
var sanitizeRestProps = function (_a) {
    var filterValues = _a.filterValues, selectedIds = _a.selectedIds, resource = _a.resource, rest = __rest(_a, ["filterValues", "selectedIds", "resource"]);
    return rest;
};
BulkExportButton.propTypes = {
    exporter: PropTypes.func,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    icon: PropTypes.element,
};
//# sourceMappingURL=BulkExportButton.js.map