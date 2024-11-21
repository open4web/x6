import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleNumber from "./PeopleNumber";
import MerchantSeats from "../../../common/Seats";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import PayChannel from "../../../common/PayChannel";
import DialogActions from "@mui/material/DialogActions";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import {Buckets, OrderRequest, OrderResp} from "./Type";
import axios from "axios";
import {toast} from "react-toastify";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface MyCartProps {
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function MyCart({cartItems, setCartItems}: MyCartProps) {
    const [price, setPrice] = React.useState(0);
    const [openPayChannel, setOpenPayChannel] = React.useState(false);
    const [orderID, setOrderID] = React.useState("");
    const [openSeats, setOpenSeats] = React.useState(false);
    const [takeout, setTakeout] = React.useState(0);

    const handleClose = () => {
        setOpenPayChannel(false);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTakeout(newValue)
        console.log("inside eating ==>", newValue)
        localStorage.setItem('current_pickup_method', String(newValue));
        if (newValue == 2) {
            console.log("inside eating")
            setOpenSeats(true)
        } else {
            console.log("take food out")
            localStorage.setItem("takeout", "0");
            localStorage.removeItem("selectedImage")
        }
    };

    const handleQuantityChange = (id: string, newQuantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? {...item, quantity: newQuantity} : item
            )
        );
    };

    const handleRemoveItem = (id: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handlePayment = async () => {
        const Cookie = localStorage.getItem('cookie') || '';
        console.log('place order now -->', price);

        // Define the UserData object
        let userData: OrderRequest = {
            at: localStorage.getItem("current_store_id") as string,
            buckets: convertToOrderRequest(cartItems),
            pick: localStorage.getItem("current_pickup_method") as unknown as number,
            seat: localStorage.getItem("selectedSeatId") as string,
        };

        try {
            const response = await axios.post<OrderResp>('/v1/order/pos', userData, {
                headers: {
                    'Content-Type': 'application/json',
                    Cookies: Cookie,
                },
                withCredentials: true, // Include credentials with the request
            });

            if (response.status === 200) {
                console.log("Request was successful. Response data:", response);
                const responseData: OrderResp = response.data;
                console.log("Out order_id No:", responseData?.identity?.order_no);
                setPrice(responseData.price)

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

                setOpenPayChannel(true);
                setOrderID(responseData?.identity?.order_no);

            } else if (response.status === 401) {
                window.location.href = "/login"; // Redirect to login on 401
            } else {
                console.error('Unexpected response status:', response.status);
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.error("Unauthorized access - redirecting to login");
                window.location.href = "/login";
            } else {
                console.error("Error placing order:", error);
            }
        }
    };

    const handleHoldOrder = () => {
        alert('Order Held Successfully!');
    };

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <Box sx={{width: 300, padding: 1}}>
            <Typography variant="h5" sx={{textAlign: 'center', mb: 2}}>
                购物车
            </Typography>
            <List>
                {cartItems.map((item) => (
                    <ListItem key={item.id} sx={{display: 'flex', alignItems: 'center'}}>
                        <ListItemText
                            primary={item.name}
                            secondary={`单价: ¥${item.price.toFixed(2)}`}
                        />
                        <TextField
                            type="number"
                            size="small"
                            value={item.quantity}
                            onChange={(e) =>
                                handleQuantityChange(item.id, Math.max(1, Number(e.target.value)))
                            }
                            sx={{width: 60, mx: 1}}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleRemoveItem(item.id)}>
                                <DeleteIcon/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{my: 2}}/>
            <Typography variant="h6" sx={{textAlign: 'right'}}>
                总计: ¥{totalPrice.toFixed(2)}
            </Typography>
            <Divider sx={{my: 2}}/>
            <Tabs
                value={takeout}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
            >
                <Tab label="自提" {...a11yProps(0)} />
                <Tab label="外卖" {...a11yProps(1)} disabled={true}/>
                <Tab
                    label={`堂食${localStorage.getItem('selectedSeatId') ? ` ${localStorage.getItem('selectedSeatId')}` : ''}`}
                    {...a11yProps(2)}
                />
            </Tabs>

            {/*选择堂食则弹出座位选项*/}
            <MerchantSeats setOpen={setOpenSeats} open={openSeats}/>

            {/*选择就餐人数*/}
            <Divider sx={{my: 2}}/>
            <Box sx={{mb: 2}}>
                <PeopleNumber/>
            </Box>

            {/*选择订单结算方式*/}
            <Divider sx={{my: 2}}/>
            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                <Button variant="outlined" color="warning" fullWidth onClick={handleHoldOrder}>
                    挂单
                </Button>
                <Button variant="contained" color="success" fullWidth onClick={handlePayment}>
                    结算
                </Button>
            </Box>


            {/*    支付渠道弹窗*/}
            <Dialog
                open={openPayChannel}
                fullWidth={true}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle align={"center"}>{"选择支付渠道"}</DialogTitle>
                <DialogContent>
                    <PayChannel setCart={setCartItems} price={price} setOpen={setOpenPayChannel} orderID={orderID}/>
                </DialogContent>
                <DialogActions>
                    {/*<Button onClick={handleClose}>取消</Button>*/}
                    {/*<Button onClick={handleClose}>支付</Button>*/}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function convertToOrderRequest(cartItems: CartItem[]): Buckets[] {
    return cartItems.map(item => {
        return {
            ID: item.id,
            Number: item.quantity,
            Price: item.price,
            Name: item.name
        };
    })
}