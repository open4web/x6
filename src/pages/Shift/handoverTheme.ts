import type {Theme as MuiTheme} from '@mui/material/styles';
import {theme as antdTheme, type ThemeConfig} from 'antd';

export function handoverAntdTheme(mui: MuiTheme): ThemeConfig {
    const dark = mui.palette.mode === 'dark';
    return {
        algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
            colorPrimary: mui.palette.primary.main,
            colorInfo: mui.palette.primary.main,
            colorSuccess: mui.palette.success.main,
            colorWarning: mui.palette.warning.main,
            colorError: mui.palette.error.main,
            colorLink: mui.palette.primary.main,
            colorBgBase: mui.palette.background.default,
            colorBgContainer: mui.palette.background.default,
            colorBgElevated: mui.palette.background.paper,
            colorText: mui.palette.text.primary,
            colorTextSecondary: mui.palette.text.secondary,
            colorBorder: mui.palette.divider,
            colorBorderSecondary: mui.palette.divider,
            borderRadius: typeof mui.shape.borderRadius === 'number' ? mui.shape.borderRadius : 10,
            fontFamily: mui.typography.fontFamily,
        },
        components: {
            Button: {
                primaryColor: mui.palette.primary.contrastText,
            },
            Card: {
                colorBgContainer: 'transparent',
            },
        },
    };
}
