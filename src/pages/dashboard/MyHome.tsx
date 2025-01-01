import * as React from 'react';
import { Fab, Grid } from '@mui/material';
import MyProducts from "../home/Components/MyProducts";
import { toast } from "react-toastify";
import MyCartDrawer from "../home/Components/MyCartDrawer";
import { useCartContext } from "../../dataProvider/MyCartProvider";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GradingIcon from '@mui/icons-material/Grading';
import MyOrderDrawer from "../home/Components/MyOrderDrawer";
import {CartItem} from "../../common/types";
import {useEffect, useState} from "react";

export const MyHome = () => {
    const { cartItems, setCartItems, drawerOpen, setDrawerOpen, setOrderDrawerOpen } = useCartContext();
    const [clearCartSignal, setClearCartSignal] = useState(false);

    const handleClick = (item: CartItem) => {
        setDrawerOpen(true);

        // 检查购物车中是否已存在该商品
        const existingItem = cartItems.find((cartItem: CartItem) => cartItem.id === item.id);

        if (existingItem) {
            // 商品已存在，增加数量
            setCartItems((prevCart) =>
                prevCart.map((cartItem: CartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
                        : cartItem
                )
            );
            console.log("increment quantity", cartItems)
            toast.success(`${item.name} 数量增加`, { position: "top-center", autoClose: 2000 });
        } else {
            // 商品不存在，首次添加到购物车
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
            toast.success('商品已加入购物车', { position: "top-center", autoClose: 2000 });
        }
    };

    // clearCartSignal
    // 当 cartItems 为空时，触发 clearCartSignal
    useEffect(() => {
        if (cartItems.length === 0) {
            setClearCartSignal(true); // 触发信号
        } else {
            setClearCartSignal(false); // 重置信号
        }
    }, [cartItems]);
    return (
        <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={12}>
                <React.Fragment>
                    <MyCartDrawer />
                    <MyOrderDrawer/>
                    <MyProducts handleClick={handleClick} clearCartSignal={clearCartSignal}/>

                    {/* Floating Action Button */}
                    <Fab
                        aria-label="Expand"
                        color="inherit"
                        sx={{
                            position: 'fixed',
                            bottom: 16, // Distance from bottom
                            right: 16, // Distance from left
                            zIndex: 1000, // Ensure it is above other components
                        }}
                        onClick={() => setDrawerOpen(true)} // 点击时打开购物车抽屉
                    >
                        <ShoppingCartIcon  fontSize="large" color={'error'}/>
                    </Fab>
                    <Fab
                        aria-label="Expand"
                        color="inherit"
                        sx={{
                            position: 'fixed',
                            bottom: 80, // Distance from bottom
                            right: 16, // Distance from left
                            zIndex: 1000, // Ensure it is above other components
                        }}
                        onClick={() => setOrderDrawerOpen(true)} // 点击时打开购物车抽屉
                    >
                        <GradingIcon  fontSize="large" color={'warning'}/>
                    </Fab>
                </React.Fragment>
            </Grid>
        </Grid>
    );
};