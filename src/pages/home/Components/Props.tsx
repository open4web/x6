import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import PropToggleButton from "./Prop";
import MyCart from "./MyCart";

type FullScreenDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MenuProps({ open, setOpen }: FullScreenDialogProps) {
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };
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
        <div>
            <Drawer open={open} onClose={toggleDrawer(false)} elevation={2} anchor="right">
                <MyCart/>
            </Drawer>
        </div>
    );
}