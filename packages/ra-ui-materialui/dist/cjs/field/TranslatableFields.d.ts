import { ReactElement, ReactNode } from 'react';
import { UseTranslatableOptions, RaRecord } from 'ra-core';
/**
 * Provides a way to show multiple languages for any field passed as children.
 * It expects the translatable values to have the following structure:
 * {
 *     name: {
 *         en: 'The english value',
 *         fr: 'The french value',
 *         tlh: 'The klingon value',
 *     },
 *     description: {
 *         en: 'The english value',
 *         fr: 'The french value',
 *         tlh: 'The klingon value',
 *     }
 * }
 *
 * @example <caption>Basic usage</caption>
 * <TranslatableFields locales={['en', 'fr']}>
 *     <TextField source={getSource('title')} />
 *     <TextField source={getSource('description')} />
 * </TranslatableFields>
 *
 * @example <caption>With a custom language selector</caption>
 * <TranslatableFields
 *     selector={<MyLanguageSelector />}
 *     locales={['en', 'fr']}
 * >
 *     <TextField source={getSource('title')} />
 * <TranslatableFields>
>
 *
 * const MyLanguageSelector = () => {
 *     const {
 *         locales,
 *         selectedLocale,
 *         selectLocale,
 *     } = useTranslatableContext();
 *
 *     return (
 *         <select onChange={selectLocale}>
 *             {locales.map((locale) => (
 *                 <option selected={locale.locale === selectedLocale}>
 *                     {locale.name}
 *                 </option>
 *             ))}
 *        </select>
 *     );
 * }
 *
 * @param props The component props
 * @param {string} props.defaultLocale The locale selected by default. Default to 'en'.
 * @param {string[]} props.locales An array of the possible locales in the form. For example [{ 'en', 'fr' }].
 * @param {ReactElement} props.selector The element responsible for selecting a locale. Defaults to MUI tabs.
 */
export declare const TranslatableFields: (props: TranslatableFieldsProps) => ReactElement;
export interface TranslatableFieldsProps extends UseTranslatableOptions {
    children: ReactNode;
    className?: string;
    record?: RaRecord;
    resource?: string;
    selector?: ReactElement;
    groupKey?: string;
}
//# sourceMappingURL=TranslatableFields.d.ts.map