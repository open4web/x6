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
import { fetchRelatedRecords, useDataProvider, useNotify, useListContext, useResourceContext, } from 'ra-core';
import { Button } from './Button';
export var ExportButton = function (props) {
    var _a = props.maxResults, maxResults = _a === void 0 ? 1000 : _a, onClick = props.onClick, _b = props.label, label = _b === void 0 ? 'ra.action.export' : _b, _c = props.icon, icon = _c === void 0 ? defaultIcon : _c, customExporter = props.exporter, rest = __rest(props, ["maxResults", "onClick", "label", "icon", "exporter"]);
    var _d = useListContext(props), filter = _d.filter, filterValues = _d.filterValues, sort = _d.sort, exporterFromContext = _d.exporter, total = _d.total;
    var resource = useResourceContext(props);
    var exporter = customExporter || exporterFromContext;
    var dataProvider = useDataProvider();
    var notify = useNotify();
    var handleClick = useCallback(function (event) {
        dataProvider
            .getList(resource, {
            sort: sort,
            filter: filter
                ? __assign(__assign({}, filterValues), filter) : filterValues,
            pagination: { page: 1, perPage: maxResults },
        })
            .then(function (_a) {
            var data = _a.data;
            return exporter &&
                exporter(data, fetchRelatedRecords(dataProvider), dataProvider, resource);
        })
            .catch(function (error) {
            console.error(error);
            notify('ra.notification.http_error', { type: 'warning' });
        });
        if (typeof onClick === 'function') {
            onClick(event);
        }
    }, [
        dataProvider,
        exporter,
        filter,
        filterValues,
        maxResults,
        notify,
        onClick,
        resource,
        sort,
    ]);
    return (React.createElement(Button, __assign({ onClick: handleClick, label: label, disabled: total === 0 }, sanitizeRestProps(rest)), icon));
};
var defaultIcon = React.createElement(DownloadIcon, null);
var sanitizeRestProps = function (_a) {
    var filterValues = _a.filterValues, resource = _a.resource, rest = __rest(_a, ["filterValues", "resource"]);
    return rest;
};
ExportButton.propTypes = {
    exporter: PropTypes.func,
    filterValues: PropTypes.object,
    label: PropTypes.string,
    maxResults: PropTypes.number,
    resource: PropTypes.string,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    icon: PropTypes.element,
};
//# sourceMappingURL=ExportButton.js.map