import {defaultTheme} from 'react-admin';
import {RaThemeOptions} from './types';

type IndustryPalette = {
    primary: string;
    secondary: string;
    appBar: string;
    appBarText?: string;
    background: string;
    paper?: string;
};

const makeTheme = (palette: IndustryPalette, mode: 'light' | 'dark'): RaThemeOptions => ({
    palette: {
        mode,
        primary: {main: palette.primary},
        secondary: {main: palette.secondary},
        background: {
            default: palette.background,
            paper: palette.paper || (mode === 'dark' ? '#1e1e1e' : '#ffffff'),
        },
    },
    shape: {borderRadius: 10},
    sidebar: {width: 200},
    components: {
        ...defaultTheme.components,
        MuiAppBar: {
            defaultProps: {elevation: 1},
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: palette.appBar,
                    color: palette.appBarText || '#fff',
                },
                colorSecondary: {
                    backgroundColor: palette.appBar,
                    color: palette.appBarText || '#fff',
                },
            },
        },
        RaMenuItemLink: {
            styleOverrides: {
                root: {
                    borderLeft: `3px solid ${mode === 'dark' ? '#000' : '#fff'}`,
                    '&.RaMenuItemLink-active': {
                        borderLeft: `3px solid ${palette.primary}`,
                    },
                },
            },
        },
    },
});

const pair = (light: IndustryPalette, dark: IndustryPalette) => ({
    light: makeTheme(light, 'light'),
    dark: makeTheme(dark, 'dark'),
});

export const industryThemes = {
    restaurant: pair(
        {primary: '#c62828', secondary: '#ff7043', appBar: '#b71c1c', background: '#fff8f6'},
        {primary: '#ef9a9a', secondary: '#ffab91', appBar: '#4a1515', background: '#1c1212'},
    ),
    cafe: pair(
        {primary: '#6d4c41', secondary: '#a1887f', appBar: '#4e342e', background: '#faf6f3'},
        {primary: '#bcaaa4', secondary: '#8d6e63', appBar: '#3e2723', background: '#1b1614'},
    ),
    bakery: pair(
        {primary: '#ef6c00', secondary: '#ffcc80', appBar: '#e65100', background: '#fff8ee'},
        {primary: '#ffb74d', secondary: '#ffcc80', appBar: '#4e2a00', background: '#1d160e'},
    ),
    tea: pair(
        {primary: '#2e7d32', secondary: '#81c784', appBar: '#1b5e20', background: '#f3faf4'},
        {primary: '#a5d6a7', secondary: '#66bb6a', appBar: '#123016', background: '#121a13'},
    ),
    bar: pair(
        {primary: '#6a1b9a', secondary: '#ce93d8', appBar: '#4a148c', background: '#faf4ff'},
        {primary: '#ce93d8', secondary: '#ab47bc', appBar: '#2a0b40', background: '#161018'},
    ),
    hotpot: pair(
        {primary: '#e65100', secondary: '#ffab40', appBar: '#bf360c', background: '#fff5ee'},
        {primary: '#ffab40', secondary: '#ff8a65', appBar: '#4a1600', background: '#1c130e'},
    ),
    seafood: pair(
        {primary: '#0277bd', secondary: '#4fc3f7', appBar: '#01579b', background: '#f3faff'},
        {primary: '#4fc3f7', secondary: '#29b6f6', appBar: '#01344f', background: '#10171c'},
    ),
    dessert: pair(
        {primary: '#ad1457', secondary: '#f48fb1', appBar: '#880e4f', background: '#fff5f8'},
        {primary: '#f48fb1', secondary: '#f06292', appBar: '#3d0a24', background: '#1c1216'},
    ),
    convenience: pair(
        {primary: '#00897b', secondary: '#80cbc4', appBar: '#00695c', background: '#f2fbfa'},
        {primary: '#80cbc4', secondary: '#26a69a', appBar: '#01332e', background: '#101817'},
    ),
    hotel: pair(
        {primary: '#c9a227', secondary: '#8d6e63', appBar: '#8d6e13', background: '#fbf8f1'},
        {primary: '#ffe082', secondary: '#bcaaa4', appBar: '#3d3208', background: '#1a1812'},
    ),
    fresh: pair(
        {primary: '#43a047', secondary: '#aed581', appBar: '#2e7d32', background: '#f5fbf3'},
        {primary: '#aed581', secondary: '#9ccc65', appBar: '#1b3318', background: '#131911'},
    ),
    night: pair(
        {primary: '#212121', secondary: '#ffd54f', appBar: '#111111', background: '#f7f7f7', appBarText: '#ffd54f'},
        {primary: '#ffd54f', secondary: '#ffecb3', appBar: '#0a0a0a', background: '#101010', appBarText: '#ffd54f'},
    ),
};
