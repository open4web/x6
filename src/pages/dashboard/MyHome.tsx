import * as React from 'react';
import { Grid } from '@mui/material';
import MyProducts from "../home/Components/MyProducts";
import {toast} from "react-toastify";
import MyCartDrawer from "../home/Components/MyCartDrawer";
import {CartItem} from "../home/Components/MyCart";
import {useCartContext} from "../../dataProvider/MyCartProvider";

export const MyHome = () => {
    // 指定 cartItems 的类型为 CartItem[]
    const { cartItems, setCartItems, drawerOpen, setDrawerOpen } = useCartContext();


    const handleClick = (item: CartItem) => {
        setDrawerOpen(true);
        // 如果已经存在购物车，则直接加数字
        if (cartItems.some((cartItem: CartItem) => cartItem.id === item.id)) {
            toast.success(item.name + ' +1', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            // 直接增加amount
            setCartItems((prevCart) =>
                prevCart.map((cartItem: CartItem) => {
                    if (cartItem.id === item.id) {
                        const updatedAmount = cartItem.quantity + 1;
                        return { ...cartItem, amount: updatedAmount > 0 ? updatedAmount : 1 };
                    }
                    return cartItem;
                })
            );
        } else {
            // append new item into cart
            setCartItems([...cartItems, item]);
            toast.success('商品已加入购物车', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const myCartProps = {
        cartItems,
        setCartItems,
    };

    return (<Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={12}>
            <React.Fragment>
                <MyCartDrawer setOpen={setDrawerOpen} open={drawerOpen} x={myCartProps}/>
                <MyProducts handleClick={handleClick} />
            </React.Fragment>
        </Grid>
    </Grid>)
}
