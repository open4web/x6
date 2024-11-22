import React, {useEffect, useState} from "react";
import {FaTrash} from "react-icons/fa";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import question from "../img/user.png";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import axios from "axios";

import "../styles/checkoutBtn.css";

import {TransitionProps} from '@mui/material/transitions';
import PayChannel from "./PayChannel";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface CartItem {
  id: string;
  img: string;
  title: string;
  amount: number;
  price: number;
}

interface OrderRequest {
  at: string; // 订单下单位置
  buckets: Buckets[];
}

interface Buckets {
  ID: string;
  Number: number;
  // OriginAmount: string;
  Price: Number;
  // Unit: string;
  // Property: PropertyInfo[];
  // Image: string;
  // Amount: string;
  Name: string;
}

interface OrderResp {
  identity: IdentityInfo;
  result_code: string;
}

// IdentityInfo 标识信息
interface IdentityInfo {
  // 备注信息 （后台管理员操作）
  remark: string;
  // 脚注信息（客户提交）
  postscript: string;
  // 排队序号 （自动生成）
  sort_num: string;
  // 订单号 （自动生成）
  order_no: string;
  // 座位号 (自主选择/店铺分配）
  table_no: string;
  // 当前排队号
  current_pos: number;
}


interface PropertySetting {
  IsDefault?: number | null;
  Id: number;
  Code: string;
  Value: string;
  Price: number;
}


interface PropertyInfo {
  IsOpenCheckbox: boolean;
  Id: number;
  Values: PropertySetting[];
  Name: string;
  Desc?: string | null;
}

interface PropertySetting {
  IsDefault?: number | null;
  Id: number;
  Code: string;
  Value: string;
  Price: number;
}

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  handleChange: (item: CartItem, value: number) => void;
}

// 转换函数
function convertToOrderRequest(cartItems: CartItem[]): Buckets[] {
  return cartItems.map(item => {
    return {
      ID: item.id,
      Number: item.amount,
      Price: item.price,
      Name: item.title
    };
  })
}

const Cart = ({ cart, setCart, handleChange }: CartProps) => {
  const [price, setPrice] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [orderID, setOrderID] = React.useState("");


  const handleClose = () => {
    setOpen(false);
  };

  const handleRemove = (id: string) => {
    const arr = cart.filter((item) => item.id !== id);
    setCart(arr);
    handlePrice();
    toast.error("商品移除购物车", {
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

  const handlePrice = () => {
    let ans = 0;
    cart.forEach((item) => (ans += item.amount * item.price));
    setPrice(ans);
  };

  useEffect(() => {
    handlePrice();
  }, [cart]);


  const onSuccess = (reference: any) => {
    console.log(reference);
  };

  const onClose = () => {
    console.log('closed')
  }
  const holdOrder = () => {
    console.log("Holding order...");

    // 获取当前已存储的 holdOrders 列表（如果不存在，返回空数组）
    const holdOrders = JSON.parse(localStorage.getItem("holdOrders") || "[]");

    // 生成新的自增 ID
    const newId = holdOrders.length > 0 ? holdOrders[holdOrders.length - 1].id + 1 : 1;

    // 构建新的 holdOrder 对象
    const newHoldOrder = {
      id: newId, // 使用自增 ID
      cartItems: cart, // 保存当前购物车的内容
      createdAt: new Date().toISOString(), // 保存创建时间
    };

    // 将新订单添加到 holdOrders 数组中
    holdOrders.push(newHoldOrder);

    // 更新到 localStorage
    localStorage.setItem("holdOrders", JSON.stringify(holdOrders));

    // 清空购物车
    setCart([]);

    // 通知用户订单已被保存
    toast.success("订单已保存到挂单列表", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    console.log("Hold order stored:", newHoldOrder);
  };
  const placeOrder = async () => {
    console.log('place order now -->', price)

    // 定义一个 UserData 对象
    let userData: OrderRequest;
    userData = {
      at: localStorage.getItem("current_store_id") as string,
      // 将购物车的商品列表转换为下单接口中的商品列表
      buckets: convertToOrderRequest(cart),
    };


    try {
      const response = await axios.post<OrderResp>('/v1/order/pos', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // 检查状态码
      if (response.status === 200) {
        console.log("Request was successful. Response data:", response);
        // 访问返回的数据
        const responseData: OrderResp = response.data;
        console.log("Out order_id No:", responseData?.identity?.order_no);
        if (responseData.result_code === "SUCCESS") {
          toast.success("下单成功", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        setOpen(true);
        setOrderID(responseData?.identity?.order_no)


      } else {
        console.error('Request failed with status code:', response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <>
      <section className="w-full align-center items-center mx-auto container flex justify-center">
        <section className="mt-8 px-8 text-white">
          {cart.length === 0 ? (
            <div className="container mx-auto justify-center">
              <p className="text-center text-white font-semibold text-xl">购物车空的</p>
              {/*<img src={question} className="" alt="" />*/}
            </div>

          ) : (
            cart.map((item) => (
              <div className="flex items-center justify-between mt-10 pb-2 border-b-2" key={item.id}>
                <div className="flex w-80">
                  <img src={item.img} alt="" className="w-20 h-16" />
                  <p className="font-bold ml-5 mt-4">{item.title}</p>
                </div>
                <div className="flex items-center justify-between pb-2 mt-2">
                  <button className="px-2.5 py-1.5 text-lg font-bold mr-1.5" onClick={() => handleChange(item, -1)}>
                    -
                  </button>
                  <button>{item.amount}</button>
                  <button className="px-2.5 py-1.5 text-lg font-bold mr-1.5" onClick={() => handleChange(item, 1)}>
                    +
                  </button>
                </div>
                <div>
                  <span className="text-brandColor py-1.5 px-2.5 rounded-lg mr-2.5"> {item.price}</span>
                  <button
                    className="py-2 px-2.5 font-semibold bg-red-100 rounded-lg cursor-pointer text-brandColor hover:text-red-600"
                    onClick={() => handleRemove(item.id)}
                  >
                    <FaTrash title="Remove from cart" />
                  </button>
                </div>
              </div>
            ))
          )}
          {cart.length > 0 && (
            <>
              <div className="flex justify-between mt-8">
                <span className="text-lg font-semibold">小结 :</span>
                <span className="text-lg font-semibold text-brandColor">{price}</span>
              </div>
              <div className="flex justify-between mt-4 border-b-2">
                <span className="text-lg font-semibold">折扣 :</span>
                <span className="text-lg font-semibold text-brandColor">  5</span>
              </div>
              <div className="flex justify-between mt-4 border-b-2">
                <span className="text-xl font-bold">应支付 :</span>
                <span className="text-xl font-bold text-brandColor">{price-5}</span>
              </div>
              <section className="flex justify-between mt-12">
                <button onClick={placeOrder} className="checkout-btn">结算</button>
              </section>
            </>
          )}

        </section>
      </section>
      <ToastContainer />
      <Dialog
          open={open}
          fullWidth={true}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle align={"center"}>{"选择支付渠道"}</DialogTitle>
        <DialogContent>
          <PayChannel setCart={setCart} price={price} setOpen={setOpen} orderID={orderID}/>
        </DialogContent>
        <DialogActions>
          {/*<Button onClick={handleClose}>取消</Button>*/}
          {/*<Button onClick={handleClose}>支付</Button>*/}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Cart;

