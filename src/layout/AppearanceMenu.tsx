import {useEffect, useState} from 'react';
import {useLocaleState, useStore, useTheme, useTranslate} from 'react-admin';
import {
    Box,
    Chip,
    Divider,
    IconButton,
    Popover,
    Tooltip,
    Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {supportedLocales} from '../i18n/locales';
import {themes, ThemeName} from '../themes/themes';

function useAppearance() {
    const [themeName, setThemeName] = useStore<ThemeName>('themeName', 'restaurant');
    const [isLight, setIsLight] = useStore<boolean>('lightName', true);
    const [, setTheme] = useTheme();

    const applyTheme = (name: ThemeName, light: boolean) => {
        const pack = themes.find(item => item.name === name);
        const next = light ? pack?.light : (pack?.dark || pack?.light);
        if (next) {
            setTheme(next);
        }
    };

    useEffect(() => {
        applyTheme(themeName, isLight);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {themeName, isLight, applyTheme, setThemeName, setIsLight};
}

export function AppearancePanel() {
    const translate = useTranslate();
    const [locale, setLocale] = useLocaleState();
    const {themeName, isLight, applyTheme, setThemeName, setIsLight} = useAppearance();

    const setMode = (light: boolean) => {
        setIsLight(light);
        applyTheme(themeName, light);
    };

    const setIndustry = (name: ThemeName) => {
        setThemeName(name);
        applyTheme(name, isLight);
    };

    const themeColor = (name: ThemeName) => {
        const pack = themes.find(item => item.name === name);
        return (pack?.light as any)?.palette?.primary?.main || '#999';
    };

    return (
        <Box sx={{width: 360, p: 2}}>
            <Typography variant="subtitle2" sx={{mb: 1, fontWeight: 700}}>
                {translate('pos.language')}
            </Typography>
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2}}>
                {supportedLocales.map(item => (
                    <Chip
                        key={item.locale}
                        size="small"
                        label={item.name}
                        color={locale === item.locale ? 'primary' : 'default'}
                        variant={locale === item.locale ? 'filled' : 'outlined'}
                        onClick={() => setLocale(item.locale)}
                    />
                ))}
            </Box>

            <Divider sx={{mb: 1.5}} />
            <Typography variant="subtitle2" sx={{mb: 1, fontWeight: 700}}>
                {translate('pos.theme.name')}
            </Typography>
            <Box sx={{display: 'flex', gap: 1, mb: 2}}>
                <Chip
                    icon={<LightModeIcon />}
                    label={translate('pos.theme.light')}
                    color={isLight ? 'primary' : 'default'}
                    variant={isLight ? 'filled' : 'outlined'}
                    onClick={() => setMode(true)}
                />
                <Chip
                    icon={<DarkModeIcon />}
                    label={translate('pos.theme.dark')}
                    color={!isLight ? 'primary' : 'default'}
                    variant={!isLight ? 'filled' : 'outlined'}
                    onClick={() => setMode(false)}
                />
            </Box>

            <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75}}>
                {themes.map(item => {
                    const selected = item.name === themeName;
                    return (
                        <Box
                            key={item.name}
                            onClick={() => setIndustry(item.name)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 1,
                                py: 0.75,
                                borderRadius: 1,
                                cursor: 'pointer',
                                border: selected ? '2px solid' : '1px solid',
                                borderColor: selected ? 'primary.main' : 'divider',
                                bgcolor: selected ? 'action.selected' : 'transparent',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: '50%',
                                    bgcolor: themeColor(item.name),
                                    flexShrink: 0,
                                }}
                            />
                            <Typography variant="body2" noWrap>
                                {translate(`pos.theme_list.${item.name}`, {_: item.name})}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

export default function AppearanceMenu() {
    useAppearance();
    const translate = useTranslate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const title = translate('pos.action.appearance', {_: 'Language & theme'});

    return (
        <>
            <Tooltip title={title}>
                <IconButton color="inherit" onClick={event => setAnchorEl(event.currentTarget)}>
                    <TuneIcon />
                </IconButton>
            </Tooltip>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <AppearancePanel />
            </Popover>
        </>
    );
}
