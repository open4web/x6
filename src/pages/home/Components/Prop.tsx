import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import {SpiceOptions} from "./Type";



const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    borderRadius: '16px',
    border: `1px solid ${theme.palette.divider}`,
    padding: '4px 12px',
    textTransform: 'none',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap', // Prevent button text from wrapping
    '&.Mui-selected': {
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: theme.palette.warning.dark,
        },
    },
    '&:not(.Mui-selected)': {
        color: theme.palette.text.primary,
    },
}));

interface Props {
    items: SpiceOptions[];
}

export default function PropToggleButton( props: Props) {
    const { items} = props;

    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newId: string | null
    ) => {
        if (newId !== null) {
            setSelectedId(newId);
            localStorage.setItem('selectedSpiceLevel', newId); // Save selected id to localStorage
        }
    };

    return (
        <ToggleButtonGroup
            color="warning"
            value={selectedId}
            exclusive
            onChange={handleChange}
            aria-label="Spice Level"
            sx={{
                display: 'flex',
                flexWrap: 'nowrap', // Ensure all buttons stay on one line
                overflowX: 'auto',  // Enable horizontal scrolling if necessary
                gap: 1,             // Add spacing between buttons
                padding: '4px',     // Add padding to the group
            }}
        >
            {items?.map((option) => (
                <StyledToggleButton key={option.id} value={option.id}>
                    {option.name}
                </StyledToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}