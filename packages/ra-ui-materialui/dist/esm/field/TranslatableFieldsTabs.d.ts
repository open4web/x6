import { ReactElement } from 'react';
import { TabsProps } from '@mui/material/Tabs';
import { AppBarProps } from '../layout';
/**
 * Default locale selector for the TranslatableFields component. Generates a tab for each specified locale.
 * @see TranslatableFields
 */
export declare const TranslatableFieldsTabs: (props: TranslatableFieldsTabsProps & AppBarProps) => ReactElement;
export interface TranslatableFieldsTabsProps {
    TabsProps?: TabsProps;
    groupKey?: string;
}
//# sourceMappingURL=TranslatableFieldsTabs.d.ts.map