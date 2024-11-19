import * as React from 'react';
import { Grid } from '@mui/material';
import MyShop from "../home/Components/Shop";
import Details from "../home/Components/Details";
import {useState} from "react";
import {toast} from "react-toastify";
import TopSect from "../home/Components/TopSect";
import Cart from "../home/Components/Cart";
import MenuProps from "../home/Components/Props";

export const Dashboard = () => {
    const [show, setShow] = useState(true);
    const [cart, setCart] = useState<any[]>([]);
    const [open, setOpen] = React.useState(false);

    const handleClick = (item: any) => {
        setOpen(true)
        // 如果已经存在购物车，则直接加数字
        if (cart.some((cartItem) => cartItem.id === item.id)) {
            toast.success(item.title + ' +1', {
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
            setCart((prevCart) =>
                prevCart.map((cartItem) => {
                    if (cartItem.id === item.id) {
                        const updatedAmount = cartItem.amount + 1;
                        return { ...cartItem, amount: updatedAmount > 0 ? updatedAmount : 1 };
                    }
                    return cartItem;
                })
            );
        } else {
            // append new item into cart
            setCart([...cart, item]);
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

    const handleChange = (item: any, d: number) => {

        console.log("cartItem.amount -->", cart)
        setCart((prevCart) =>
            prevCart.map((cartItem) => {
                if (cartItem.id === item.id) {
                    const updatedAmount = cartItem.amount + d;
                    return { ...cartItem, amount: updatedAmount > 0 ? updatedAmount : 1 };
                }
                return cartItem;
            })
        );

        if (d > 0) {
            toast.success(item.title + ' +1', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.warning(item.title + ' -1', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        };
    }

    return (<Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={9}>
            <React.Fragment>
                <MenuProps setOpen={setOpen} open={open}/>
                <Details handleClick={handleClick} />
            </React.Fragment>
        </Grid>
    </Grid>)
}
