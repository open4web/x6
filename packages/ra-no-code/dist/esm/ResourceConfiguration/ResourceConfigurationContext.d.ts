/// <reference types="react" />
import { InferredElementDescription } from 'react-admin';
export declare const ResourceConfigurationContext: import("react").Context<ResourceConfigurationContextValue>;
export declare type ResourceConfigurationContextValue = [
    ResourceConfigurationMap,
    ResourceConfigurationContextHelpers
];
export declare type ResourceConfigurationContextHelpers = {
    addResource: (resourceDefinition: ResourceConfiguration) => void;
    updateResource: (name: string, resourceDefinition: Partial<Omit<ResourceConfiguration, 'name'>>) => void;
    removeResource: (name: string) => void;
};
export declare type ResourceConfiguration = {
    name: string;
    label?: string;
    fields?: FieldConfiguration[];
};
export interface ReferenceFieldConfiguration extends BaseFieldConfiguration {
    type: 'reference';
    options: {
        selectionType: 'select' | 'autocomplete' | 'radio';
        referenceField: 'string';
    };
}
export interface BaseFieldConfiguration extends InferredElementDescription {
    views: FieldView[];
    options?: {
        [key: string]: any;
    };
}
export declare type FieldConfiguration = BaseFieldConfiguration | ReferenceFieldConfiguration;
export declare type FieldView = 'list' | 'create' | 'edit' | 'show';
export declare type ResourceConfigurationMap = {
    [key: string]: ResourceConfiguration;
} | undefined;
//# sourceMappingURL=ResourceConfigurationContext.d.ts.map