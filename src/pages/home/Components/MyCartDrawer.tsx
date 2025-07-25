import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import MyCart, {ComboGroup} from "./MyCart";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {useEffect, useState} from "react";
import {useFetchData} from "../../../common/FetchData";


export default function MyCartDrawer() {
    const {fetchData, alertComponent} = useFetchData();

    const { cartItems, setCartItems, drawerOpen, setDrawerOpen, merchantId } = useCartContext();

    const payload = {
        "merchantId": merchantId,
    }
    const [comboGroups, setCombs] = useState<ComboGroup[]>([]);

    useEffect(() => {
    // 获取菜谱列表
    fetchData('/v1/pos/combs', (response) => {
        const cm = response || [];
        setCombs(cm);
    }, "POST", payload);
    }, [merchantId, cartItems]);


    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };

    return (
        <div>
            <Drawer open={drawerOpen} onClose={toggleDrawer(false)} elevation={2} anchor="right">
                <MyCart cartItems={cartItems} setCartItems={setCartItems} comboGroup={comboGroups} />
            </Drawer>
        </div>
    );
}