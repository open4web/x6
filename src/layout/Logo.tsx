import * as React from 'react';
import {SVGProps} from 'react';
import {useTheme} from '@mui/material/styles';

const Logo = (props: SVGProps<SVGSVGElement>) => {
    const theme = useTheme();
    return (
        <svg
            width={234.532}
            height={20.475}
            viewBox="0 0 62.053 5.417"
            {...props}
        >
            <g
                aria-label="R2Day Merchant Manage"
                style={{
                    lineHeight: 1.25,
                }}
                fontWeight={400}
                fontSize={7.056}
                fontFamily="Permanent Marker"
                letterSpacing={0}
                wordSpacing={0}
                strokeWidth={0.265}
                fill={theme.palette.secondary.light}
            >
            </g>
        </svg>
    );
};

export default Logo;
