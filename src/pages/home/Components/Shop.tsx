import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SideBar from "./SideBar";
import Details from "../Components/Details";
import TopSect from "../Components/TopSect";
import Cart from "../Components/Cart";

const MyShop = () => {
  const [show, setShow] = useState(true);
  const [cart, setCart] = useState<any[]>([]);

  const handleClick = (item: any) => {
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

  return (
    <>
      {/*<SideBar />*/}
      <section className="flex flex-col ml-24 px-8 pt-8 w-full bg-bgColor">
        <React.Fragment>
          <TopSect setShow={setShow} size={cart.reduce((acc, curr) => acc + curr.amount, 0)} />
          {show ? (
            <Details handleClick={handleClick} />
          ) : (
            <Cart cart={cart} setCart={setCart} handleChange={handleChange} />
          )}
        </React.Fragment>
      </section>
      <ToastContainer />
    </>
  );
};

export default MyShop;

