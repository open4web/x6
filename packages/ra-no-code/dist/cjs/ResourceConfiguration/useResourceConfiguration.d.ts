import { ResourceConfiguration } from './ResourceConfigurationContext';
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
export declare const useResourceConfiguration: (name: string) => [ResourceConfiguration, ResourceDefinitionStateActions];
declare type ResourceDefinitionStateActions = {
    update: (resourceDefinition: Partial<Omit<ResourceConfiguration, 'name'>>) => void;
    remove: (resource: string) => void;
};
export {};
//# sourceMappingURL=useResourceConfiguration.d.ts.map