import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import MyCart from "./MyCart";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import MyOrder from "./MyOrder";


export default function MyOrderDrawer() {
    const { cartItems, setCartItems, orderDrawerOpen, setOrderDrawerOpen } = useCartContext();

    const toggleDrawer = (newOpen: boolean) => () => {
        setOrderDrawerOpen(newOpen);
    };

    return (
        <div>
            <Drawer open={orderDrawerOpen} onClose={toggleDrawer(false)} elevation={2} anchor="bottom">
                <MyOrder/>
            </Drawer>
        </div>
    );
}