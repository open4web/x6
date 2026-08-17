import {RaThemeOptions} from 'react-admin';
import {softDarkTheme, softLightTheme} from './softTheme';
import {nanoDarkTheme, nanoLightTheme} from './nanoTheme';
import {houseDarkTheme, houseLightTheme} from './hourseTheme';
import {radiantLightTheme, radiantDarkTheme} from './radiantTheme';
import {industryThemes} from './industryThemes';

export type ThemeName =
    | 'soft'
    | 'nano'
    | 'radiant'
    | 'house'
    | 'restaurant'
    | 'cafe'
    | 'bakery'
    | 'tea'
    | 'bar'
    | 'hotpot'
    | 'seafood'
    | 'dessert'
    | 'convenience'
    | 'hotel'
    | 'fresh'
    | 'night';

export interface Theme {
    name: ThemeName;
    light: RaThemeOptions;
    dark?: RaThemeOptions;
}

export const themes: Theme[] = [
    {name: 'restaurant', light: industryThemes.restaurant.light, dark: industryThemes.restaurant.dark},
    {name: 'cafe', light: industryThemes.cafe.light, dark: industryThemes.cafe.dark},
    {name: 'bakery', light: industryThemes.bakery.light, dark: industryThemes.bakery.dark},
    {name: 'tea', light: industryThemes.tea.light, dark: industryThemes.tea.dark},
    {name: 'hotpot', light: industryThemes.hotpot.light, dark: industryThemes.hotpot.dark},
    {name: 'seafood', light: industryThemes.seafood.light, dark: industryThemes.seafood.dark},
    {name: 'dessert', light: industryThemes.dessert.light, dark: industryThemes.dessert.dark},
    {name: 'bar', light: industryThemes.bar.light, dark: industryThemes.bar.dark},
    {name: 'convenience', light: industryThemes.convenience.light, dark: industryThemes.convenience.dark},
    {name: 'hotel', light: industryThemes.hotel.light, dark: industryThemes.hotel.dark},
    {name: 'fresh', light: industryThemes.fresh.light, dark: industryThemes.fresh.dark},
    {name: 'night', light: industryThemes.night.light, dark: industryThemes.night.dark},
    {name: 'soft', light: softLightTheme, dark: softDarkTheme},
    {name: 'nano', light: nanoLightTheme, dark: nanoDarkTheme},
    {name: 'radiant', light: radiantLightTheme, dark: radiantDarkTheme},
    {name: 'house', light: houseLightTheme, dark: houseDarkTheme},
];
