import { useState } from 'react';
import {useStore, useTranslate, useTheme} from 'react-admin';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';

import { themes, ThemeName } from './themes';

export const ThemeSwapper = () => {

    const [themeName, setThemeName] = useStore<ThemeName>('themeName', 'soft');
    const [theme, setTheme] = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [isLight, setIsLight] = useStore<boolean>("lightName", true)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLightClick = (event: React.MouseEvent<HTMLElement>) => {
        console.log("themeName===>", themeName)

        // 设置theme
        if (!isLight) {
            const currentTheme = themes.find(theme => theme.name === themeName)?.light;
            // @ts-ignore
            setTheme(currentTheme)
        }else{
            const currentTheme = themes.find(theme => theme.name === themeName)?.dark;
            // @ts-ignore
            setTheme(currentTheme)
        }
        setIsLight(!isLight)

    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (_: React.MouseEvent<HTMLElement>, index: number) => {
        const newTheme = themes[index];
        setThemeName(newTheme.name);
        if (isLight) {
            const currentTheme = themes.find(theme => theme.name === themeName)?.light;
            // @ts-ignore
            setTheme(currentTheme)
        }else{
            const currentTheme = themes.find(theme => theme.name === themeName)?.dark;
            // @ts-ignore
            setTheme(currentTheme)
        }
        setAnchorEl(null);

    };
    const translate = useTranslate();
    const toggleThemeTitle = translate('pos.action.change_theme', {
        _: 'Change Theme',
    });

    return (
        <>
            <Tooltip title={toggleThemeTitle} enterDelay={300}>
                <IconButton
                    onClick={handleClick}
                    color="inherit"
                    aria-label={toggleThemeTitle}
                >
                    <ColorLensIcon />
                </IconButton>
            </Tooltip>
            <IconButton
                onClick={handleLightClick}
                color="inherit"
                aria-label={toggleThemeTitle}
            >
                {isLight ?    <LightModeIcon /> : <NightlightIcon/>}
            </IconButton>
            <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
                {themes.map((theme, index: number) => (
                    <MenuItem
                        onClick={event => handleChange(event, index)}
                        value={theme.name}
                        key={theme.name}
                        selected={theme.name === themeName}
                    >
                        {ucFirst(theme.name)}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

const ucFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
