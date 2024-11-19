import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {Typography} from "@mui/material";

const marks = [
    {
        value: 0,
        label: '1',
    },
    {
        value: 3,
        label: '3',
    },
    {
        value: 5,
        label: '5',
    },
    {
        value: 10,
        label: '10',
    },
    {
        value: 15,
        label: '15',
    },
];

function valuetext(value: number) {
    return `${value}人`;
}

export default function PeopleNumber() {
    return (
        <Box sx={{ width: 300, padding:'1px' }}>
            <Typography id="input-slider" gutterBottom>
                人数
            </Typography>
            <Slider
                aria-label="Custom marks"
                defaultValue={3}
                getAriaValueText={valuetext}
                step={1}
                valueLabelDisplay="auto"
                marks={marks}
                max={15}
            />
        </Box>
    );
}
