import * as React from 'react';
import { Box } from '@mui/material';
import { getMenuIcon, resolveMenuIconUrl } from './Icons';

export const MenuIconView = ({
    icon,
    name,
    size = 24,
}: {
    icon?: string;
    name?: string;
    size?: number;
}) => {
    const url = resolveMenuIconUrl(icon);
    if (!url) {
        return (
            <Box
                sx={{
                    width: size,
                    height: size,
                    bgcolor: 'rgba(255,255,255,0.25)',
                    borderRadius: 0.75,
                    flexShrink: 0,
                }}
            />
        );
    }

    const iconName = getMenuIcon(icon)?.name;
    return (
        <img
            src={url}
            alt={name || iconName || icon}
            style={{
                width: size,
                height: size,
                objectFit: 'contain',
                borderRadius: '50%',
                flexShrink: 0,
                background: '#fff',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
                display: 'block',
            }}
        />
    );
};
