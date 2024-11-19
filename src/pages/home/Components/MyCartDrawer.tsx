import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import MyCart, {MyCartProps} from "./MyCart";

type MyCartDrawerProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    x: MyCartProps;
};

export default function MyCartDrawer({ open, setOpen, x}: MyCartDrawerProps) {

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };
    return (
        <div>
            <Drawer open={open} onClose={toggleDrawer(false)} elevation={2} anchor="right">
                <MyCart cartItems={x.cartItems} setCartItems={x.setCartItems}/>
            </Drawer>
        </div>
    );
}