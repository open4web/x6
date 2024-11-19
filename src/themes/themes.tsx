import {
    RaThemeOptions,
    defaultLightTheme,
    // defaultDarkTheme,
    // nanoDarkTheme,
    // nanoLightTheme,
    // radiantDarkTheme,
    // radiantLightTheme,
    // houseDarkTheme,
    // houseLightTheme,
} from 'react-admin';

import { softDarkTheme, softLightTheme } from './softTheme';
import { nanoDarkTheme, nanoLightTheme } from './nanoTheme';
import { houseDarkTheme, houseLightTheme } from './hourseTheme';
import { chiptuneTheme } from './chiptuneTheme';
import { radiantLightTheme,  radiantDarkTheme} from './radiantTheme';

export type ThemeName =
    | 'soft'
    | 'default'
    | 'nano'
    | 'radiant'
    | 'house'
    | 'chiptune';


export type ThemeLight =
    | 'light'
    | 'dark'

export interface Theme {
    name: ThemeName;
    light: RaThemeOptions;
    dark?: RaThemeOptions;
}

export const themes: Theme[] = [
    { name: 'soft', light: softLightTheme, dark: softDarkTheme },
    // { name: 'default', light: defaultLightTheme, dark: defaultDarkTheme },
    { name: 'nano', light: nanoLightTheme, dark: nanoDarkTheme },
    { name: 'radiant', light: radiantLightTheme, dark: radiantDarkTheme },
    { name: 'house', light: houseLightTheme, dark: houseDarkTheme },
    // { name: 'chiptune', light: chiptuneTheme },
];
