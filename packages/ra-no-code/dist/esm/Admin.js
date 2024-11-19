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
import React from 'react';
import { Admin as RaAdmin, Resource, CustomRoutes, } from 'react-admin';
import localStorageDataProvider from 'ra-data-local-storage';
import { Create, Edit, List, Show } from './builders';
import { useResourcesConfiguration, ResourceConfigurationPage, ResourceConfigurationProvider, } from './ResourceConfiguration';
import { Layout, Ready } from './ui';
import { Route } from 'react-router';
import { useApplication } from './ApplicationContext';
export var Admin = function (props) {
    var application = useApplication().application;
    if (!application) {
        return null;
    }
    var dataProvider = localStorageDataProvider({
        localStorageKey: "@@ra-no-code/".concat(application.name, "/data"),
    });
    return (React.createElement(ResourceConfigurationProvider, { dataProvider: dataProvider, storageKey: "@@ra-no-code/".concat(application.name) },
        React.createElement(InnerAdmin, __assign({}, props, { title: application.name, dataProvider: dataProvider }))));
};
var InnerAdmin = function (props) {
    var resources = useResourcesConfiguration()[0];
    var hasResources = !!resources && Object.keys(resources).length > 0;
    return (React.createElement(RaAdmin, __assign({ layout: Layout, ready: Ready }, props),
        React.createElement(CustomRoutes, null,
            React.createElement(Route, { path: "/configure/:resource", element: React.createElement(ResourceConfigurationPage, null) })),
        hasResources
            ? Object.keys(resources).map(function (resource) { return (React.createElement(Resource, { key: resource, name: resource, options: { label: resources[resource].label }, list: List, edit: Edit, create: Create, show: Show })); })
            : null));
};
//# sourceMappingURL=Admin.js.map