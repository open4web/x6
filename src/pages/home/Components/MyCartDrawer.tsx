import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import MyCart from "./MyCart";
import {useCartContext} from "../../../dataProvider/MyCartProvider";


export default function MyCartDrawer() {
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