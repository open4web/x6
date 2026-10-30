import * as React from 'react';
import {Box, Chip} from '@mui/material';

type Props = {
    options: string[];
    value: string;
    onChange: (next: string) => void;
};

export default function TouchChipSelect({options, value, onChange}: Props) {
    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1.25}}>
            {options.map((opt) => {
                const selected = value === opt;
                return (
                    <Chip
                        key={opt}
                        label={opt}
                        clickable
                        color={selected ? 'primary' : 'default'}
                        variant={selected ? 'filled' : 'outlined'}
                        onClick={() => onChange(opt)}
                        sx={{
                            height: 48,
                            fontSize: 16,
                            fontWeight: selected ? 800 : 600,
                            px: 0.5,
                            '& .MuiChip-label': {px: 1.5},
                        }}
                    />
                );
            })}
        </Box>
    );
}
