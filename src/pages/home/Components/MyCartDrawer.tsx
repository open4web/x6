import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import MyCart from "./MyCart";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {useEffect, useState} from "react";
import {useFetchData} from "../../../common/FetchData";
import {ComboGroup} from "../types";
import {readCombs, writeCombs} from "../../../utils/catalogCache";


export default function MyCartDrawer() {
    const {fetchData, alertComponent} = useFetchData();

    const { cartItems, setCartItems, drawerOpen, setDrawerOpen, merchantId } = useCartContext();
    const [comboGroups, setCombs] = useState<ComboGroup[]>(() => readCombs(merchantId)?.data ?? []);

    useEffect(() => {
        if (!merchantId) {
            return;
        }

        const cached = readCombs(merchantId);
        if (cached) {
            setCombs(cached.data);
        } else {
            setCombs([]);
        }
        if (cached?.fresh) {
            return;
        }

        let cancelled = false;
        fetchData('/v1/hlj/product/pos/combs', (response) => {
            const combs = response || [];
            writeCombs(merchantId, combs);
            if (!cancelled) {
                setCombs(combs);
            }
        }, "POST", {merchantId});

        return () => {
            cancelled = true;
        };
    }, [merchantId, fetchData]);


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