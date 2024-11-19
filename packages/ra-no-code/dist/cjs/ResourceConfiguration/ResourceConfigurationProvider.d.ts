import { ReactNode } from 'react';
import { DataProvider } from 'react-admin';
export declare const ResourceConfigurationProvider: ({ children, dataProvider, storageKey, }: ResourceConfigurationProviderProps) => JSX.Element;
export declare const STORAGE_KEY = "@@ra-no-code";
export interface ResourceConfigurationProviderProps {
    children: ReactNode;
    dataProvider: DataProvider;
    storageKey?: string;
}
//# sourceMappingURL=ResourceConfigurationProvider.d.ts.map