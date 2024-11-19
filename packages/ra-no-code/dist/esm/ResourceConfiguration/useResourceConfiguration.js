import { useCallback, useMemo } from 'react';
import { useResourcesConfiguration } from './useResourcesConfiguration';
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
export var useResourceConfiguration = function (name) {
    var _a = useResourcesConfiguration(), resources = _a[0], helpers = _a[1];
    var update = useCallback(function (newDefinition) {
        helpers.updateResource(name, newDefinition);
    }, [helpers, name]);
    var remove = useCallback(function () {
        helpers.removeResource(name);
    }, [helpers, name]);
    var context = useMemo(function () { return [resources[name], { update: update, remove: remove }]; }, [
        name,
        remove,
        resources,
        update,
    ]);
    return context;
};
//# sourceMappingURL=useResourceConfiguration.js.map