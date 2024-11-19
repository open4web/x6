"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResourceConfiguration = void 0;
var react_1 = require("react");
var useResourcesConfiguration_1 = require("./useResourcesConfiguration");
/**
 * This hook returns a tuple containing the resource configuration as its first element,
 * and an object providing helper functions to manipulate it as its second element.
 * @param name The resource to look for.
 *
 * @example
 * const [resource, helpers] = useResourceConfiguration('customers');
 * console.log(resource); // { name: 'customers', label: 'Customers', fields: [] };
 *
 * helpers.update({ label: 'Clients' });
 * helpers.remove();
 * @returns {[ResourceConfiguration, ResourceDefinitionStateActions]}
 */
var useResourceConfiguration = function (name) {
    var _a = (0, useResourcesConfiguration_1.useResourcesConfiguration)(), resources = _a[0], helpers = _a[1];
    var update = (0, react_1.useCallback)(function (newDefinition) {
        helpers.updateResource(name, newDefinition);
    }, [helpers, name]);
    var remove = (0, react_1.useCallback)(function () {
        helpers.removeResource(name);
    }, [helpers, name]);
    var context = (0, react_1.useMemo)(function () { return [resources[name], { update: update, remove: remove }]; }, [
        name,
        remove,
        resources,
        update,
    ]);
    return context;
};
exports.useResourceConfiguration = useResourceConfiguration;
//# sourceMappingURL=useResourceConfiguration.js.map