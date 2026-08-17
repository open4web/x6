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
import {PRODUCT_CARD_STYLES, ProductCardStyle, useProductCardStyle} from './productCardStyle';

function CardStylePreview({styleName, selected}: {styleName: ProductCardStyle; selected: boolean}) {
    const bar = {height: 6, borderRadius: 1, bgcolor: 'action.disabled', mb: 0.4};
    return (
        <Box
            sx={{
                height: 68,
                borderRadius: 1,
                border: selected ? '2px solid' : '1px solid',
                borderColor: selected ? 'primary.main' : 'divider',
                bgcolor: selected ? 'action.selected' : 'background.paper',
                p: 0.6,
                overflow: 'hidden',
            }}
        >
            {styleName === 'classic' && (
                <Box sx={{display: 'flex', gap: 0.5, pt: 0.8}}>
                    <Box sx={{width: 16, height: 16, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0}} />
                    <Box sx={{flex: 1}}>
                        <Box sx={{...bar, width: '80%'}} />
                        <Box sx={{...bar, width: '40%', bgcolor: 'warning.main'}} />
                    </Box>
                </Box>
            )}
            {styleName === 'poster' && (
                <>
                    <Box sx={{height: 28, bgcolor: 'primary.light', borderRadius: 0.5, mb: 0.4}} />
                    <Box sx={{...bar, width: '90%'}} />
                    <Box sx={{...bar, width: '35%', bgcolor: 'warning.main'}} />
                </>
            )}
            {styleName === 'compact' && (
                <Box sx={{display: 'flex', gap: 0.5, pt: 0.6}}>
                    <Box sx={{width: 22, height: 36, bgcolor: 'primary.light', borderRadius: 0.4}} />
                    <Box sx={{flex: 1, pt: 0.4}}>
                        <Box sx={{...bar, width: '90%'}} />
                        <Box sx={{...bar, width: '40%', bgcolor: 'warning.main'}} />
                    </Box>
                </Box>
            )}
            {styleName === 'tile' && (
                <Box sx={{height: 56, bgcolor: 'primary.light', borderRadius: 0.5, position: 'relative'}}>
                    <Box sx={{position: 'absolute', left: 4, right: 4, bottom: 4}}>
                        <Box sx={{...bar, width: '80%', bgcolor: 'common.white'}} />
                        <Box sx={{...bar, width: '30%', bgcolor: 'warning.light', mb: 0}} />
                    </Box>
                </Box>
            )}
            {styleName === 'board' && (
                <Box sx={{display: 'flex', gap: 0.5, pt: 1}}>
                    <Box sx={{width: 4, bgcolor: 'primary.main', borderRadius: 0.5}} />
                    <Box sx={{flex: 1}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 0.4}}>
                            <Box sx={{...bar, width: '55%', mb: 0}} />
                            <Box sx={{...bar, width: '22%', bgcolor: 'warning.main', mb: 0}} />
                        </Box>
                        <Box sx={{...bar, width: '35%'}} />
                    </Box>
                </Box>
            )}
            {styleName === 'ticket' && (
                <Box sx={{border: '1px dashed', borderColor: 'divider', borderRadius: 0.5, p: 0.5, textAlign: 'center'}}>
                    <Box sx={{...bar, width: '70%', mx: 'auto'}} />
                    <Box sx={{height: 16, bgcolor: 'primary.light', borderRadius: 0.4, mb: 0.4}} />
                    <Box sx={{...bar, width: '40%', mx: 'auto', bgcolor: 'warning.main', mb: 0}} />
                </Box>
            )}
        </Box>
    );
}

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
    const [cardStyle, setCardStyle] = useProductCardStyle();

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
        <Box sx={{width: 380, p: 2, maxHeight: '80vh', overflowY: 'auto'}}>
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

            <Divider sx={{my: 1.5}} />
            <Typography variant="subtitle2" sx={{mb: 1, fontWeight: 700}}>
                {translate('pos.card_style.title')}
            </Typography>
            <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0.75}}>
                {PRODUCT_CARD_STYLES.map(styleName => {
                    const selected = cardStyle === styleName;
                    return (
                        <Box
                            key={styleName}
                            onClick={() => setCardStyle(styleName)}
                            sx={{cursor: 'pointer'}}
                        >
                            <CardStylePreview styleName={styleName} selected={selected} />
                            <Typography
                                variant="caption"
                                noWrap
                                sx={{
                                    display: 'block',
                                    textAlign: 'center',
                                    mt: 0.4,
                                    fontWeight: selected ? 700 : 500,
                                    color: selected ? 'primary.main' : 'text.secondary',
                                }}
                            >
                                {translate(`pos.card_style.${styleName}`)}
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
