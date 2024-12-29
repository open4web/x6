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
import DeleteIcon from '@mui/icons-material/Delete';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import {TransitionProps} from "@mui/material/transitions";
import PayChannel from "../../../common/PayChannel";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {useFetchData} from "../../../common/FetchData";
import {CartItem, MyCartProps} from "../../../common/types";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function MyCart({cartItems, setCartItems}: MyCartProps) {
    const {holdOrders, setHoldOrders} = useCartContext();
    const [price, setPrice] = React.useState(0);
    const [openPayChannel, setOpenPayChannel] = React.useState(false);
    const [orderID, setOrderID] = React.useState("");
    const fetchData = useFetchData();

    const handlePlaceOrder = async () => {
        const userData = {
            at: localStorage.getItem("current_store_id") as string,
            buckets: convertToOrderRequest(cartItems),
        };

        fetchData('/v1/order/pos', (response) => {
            setPrice(response.price);
            setOrderID(response?.identity?.order_no);
            setOpenPayChannel(true);
        }, "POST", userData);
    };

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <Box sx={{width: 380, padding: 1}}>
            <Typography variant="h5" sx={{textAlign: 'center', mb: 2}}>
                购物车
            </Typography>
            <List>
                {cartItems.map((item) => (
                    <ListItem key={item.id} sx={{display: 'flex', alignItems: 'center'}}>
                        <ListItemText
                            primary={item.name}
                            secondary={`¥${item.price.toFixed(2)}`}
                        />
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <IconButton
                                onClick={() =>
                                    setCartItems((prevItems) =>
                                        prevItems.map((it) =>
                                            it.id === item.id
                                                ? {...it, quantity: Math.max(1, it.quantity - 1)}
                                                : it
                                        )
                                    )
                                }
                                size="small"
                            >
                                <RemoveIcon/>
                            </IconButton>
                            <TextField
                                type="number"
                                size="small"
                                value={item.quantity}
                                onChange={(e) =>
                                    setCartItems((prevItems) =>
                                        prevItems.map((it) =>
                                            it.id === item.id
                                                ? {...it, quantity: Math.max(1, Number(e.target.value))}
                                                : it
                                        )
                                    )
                                }
                                sx={{width: 60, textAlign: 'center'}}
                            />
                            <IconButton
                                onClick={() =>
                                    setCartItems((prevItems) =>
                                        prevItems.map((it) =>
                                            it.id === item.id
                                                ? {...it, quantity: it.quantity + 1}
                                                : it
                                        )
                                    )
                                }
                                size="small"
                            >
                                <AddCircleIcon/>
                            </IconButton>
                        </Box>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() =>
                                setCartItems((prevItems) => prevItems.filter((it) => it.id !== item.id))
                            }>
                                <DeleteIcon color={"error"}/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{my: 2}}/>
            <Typography variant="h6" sx={{fontWeight: 'bold', color: 'red', textAlign: "right"}}>
                总计: ¥{totalPrice.toFixed(2)}
            </Typography>
            <Divider sx={{my: 2}}/>
            <Box sx={{display: "flex", justifyContent: "space-between", gap: 2}}>
                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={() => setCartItems([])}
                    disabled={cartItems.length === 0}
                >
                    清空
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={handlePlaceOrder}
                    disabled={cartItems.length === 0}
                >
                    结算
                </Button>
            </Box>
            <Dialog
                open={openPayChannel}
                fullWidth={true}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpenPayChannel(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Typography variant="h6" align="center">订单号: {orderID}</Typography>
                    <Typography variant="subtitle1" align="center" color="text.secondary">
                        待支付金额: ¥{price.toFixed(2)}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <PayChannel
                        setCart={setCartItems}
                        price={price}
                        setOpen={setOpenPayChannel}
                        orderID={orderID}
                        at={localStorage.getItem("current_store_id")}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}

function Transition(props: TransitionProps & {children: React.ReactElement<any, any>}) {
    return <Slide direction="up" {...props} />;
}

function convertToOrderRequest(cartItems: CartItem[]) {
    return cartItems.map((item) => ({
        ID: item.id,
        Number: item.quantity,
        Price: item.price,
        Name: item.name,
    }));
}