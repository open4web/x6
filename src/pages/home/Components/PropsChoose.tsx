import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import PropToggleButton from "./Prop";

type FullScreenDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PropsChoose({ open, setOpen }: FullScreenDialogProps) {
    const menuOptions = [
        {
            name: "辣度",
            id: "1001",
            spiceOptions: [
                { id: '1', name: '特辣' },
                { id: '2', name: '中辣' },
                { id: '3', name: '不辣' },
            ]
        },
        {
            name: "粉量",
            id: "1002",
            spiceOptions: [
                { id: '1', name: '一两' },
                { id: '2', name: '二两' },
                { id: '3', name: '三两' },
            ]
        },
        {
            name: "配菜",
            id: "1003",
            spiceOptions: [
                { id: '1', name: '空心菜' },
                { id: '2', name: '白菜' },
                { id: '3', name: '芥菜' },
                { id: '4', name: '油麦菜' },
            ]
        },
    ];
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
                {menuOptions.map((option) => (
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
                        <PropToggleButton options={option.spiceOptions} />
                    </Box>
                ))}
            </List>
        </Box>
    );
}