import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import PropToggleButton from "./Prop";
import {ProductItem, PropsOptions} from "./Type";

interface Props {
    items: PropsOptions[];
}

export default function PropsChoose(props : Props) {
    const { items} = props;
    // @ts-ignore
    return (
        <Box
            sx={{
                width: '100%', // Full width
                padding: 1,    // Add padding
                display: 'flex',
                justifyContent: 'center', // Center items horizontally
            }}
            role="presentation"
        >
            <List
                sx={{
                    display: 'flex',
                    flexDirection: 'column', // Stack items vertically
                    alignItems: 'center', // Center items horizontally
                    gap: 0.1, // Space between items
                }}
            >
                {items?.map((option) => (
                    <Box
                        key={option.id}
                        sx={{
                            width: '100%',
                            maxWidth: '300px', // Set a consistent width for each item
                            textAlign: 'center', // Center text
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', // Center the PropToggleButton
                        }}
                    >
                        <PropToggleButton items={option?.spiceOptions} />
                    </Box>
                ))}
            </List>
        </Box>
    );
}