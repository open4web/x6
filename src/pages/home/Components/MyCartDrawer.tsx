import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import MyCart, {MyCartProps} from "./MyCart";
import {useCartContext} from "../../../dataProvider/MyCartProvider";

type MyCartDrawerProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    x: MyCartProps;
};

export default function MyCartDrawer({ open, setOpen, x}: MyCartDrawerProps) {
    const { cartItems, setCartItems, drawerOpen, setDrawerOpen } = useCartContext();

    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };

    return (
        <div>
            <Drawer open={drawerOpen} onClose={toggleDrawer(false)} elevation={2} anchor="right">
                <MyCart cartItems={cartItems} setCartItems={setCartItems} />
            </Drawer>
        </div>
    );
}