import * as React from 'react';
import { Fab, Grid } from '@mui/material';
import MyProducts from "../home/Components/MyProducts";
import { toast } from "react-toastify";
import MyCartDrawer from "../home/Components/MyCartDrawer";
import { CartItem } from "../home/Components/MyCart";
import { useCartContext } from "../../dataProvider/MyCartProvider";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GradingIcon from '@mui/icons-material/Grading';
import MyOrder from "../home/Components/MyOrder";
import MyOrderDrawer from "../home/Components/MyOrderDrawer";

export const MyHome = () => {
    const { cartItems, setCartItems, drawerOpen, setDrawerOpen, setOrderDrawerOpen } = useCartContext();

    const handleClick = (item: CartItem) => {

        setDrawerOpen(true);
        if (cartItems.some((cartItem: CartItem) => cartItem.id === item.id)) {
            toast.success(item.name + ' +1', { position: "top-center", autoClose: 2000 });
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
            setCartItems([...cartItems, item]);
            toast.success('商品已加入购物车', { position: "top-center", autoClose: 2000 });
        }
    };

    const myCartProps = { cartItems, setCartItems };

    return (
        <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={12}>
                <React.Fragment>
                    <MyCartDrawer />
                    <MyOrderDrawer/>
                    <MyProducts handleClick={handleClick} />

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