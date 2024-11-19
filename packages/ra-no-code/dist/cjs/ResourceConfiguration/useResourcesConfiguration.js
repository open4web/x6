"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResourcesConfiguration = void 0;
var react_1 = require("react");
var ResourceConfigurationContext_1 = require("./ResourceConfigurationContext");
/**
 * This hooks returns a tuple containing a map of the resources indexed by name as the first element, and an object providing helper functions to manipulate them as its second element.
 *
 * @example
 * const [resources, helpers] = useResourcesConfiguration();
 *
 * console.log(resources); // { customer: { name: 'customers', label: 'Customers', fields: [] } }
 *
 * helpers.addResource({ name: 'orders', label: 'Orders' });
 * helpers.updateResource('orders', { label: 'Commands' });
 * helpers.removeResource('orders');
 *
 * @returns {ResourceConfigurationContextValue}
 */
var useResourcesConfiguration = function () {
    var context = (0, react_1.useContext)(ResourceConfigurationContext_1.ResourceConfigurationContext);
    return context;
};
exports.useResourcesConfiguration = useResourcesConfiguration;
//# sourceMappingURL=useResourcesConfiguration.js.map