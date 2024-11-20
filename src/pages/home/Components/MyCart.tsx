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

export default function MyCart({ cartItems, setCartItems }: MyCartProps) {
    const [diningOption, setDiningOption] = React.useState('dineIn');
    const [peopleCount, setPeopleCount] = React.useState(1);
    const [openSeats, setOpenSeats] = React.useState(false);
    const [takeout, setTakeout] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTakeout(newValue)
        console.log("inside eating ==>", newValue)
        localStorage.setItem('current_pickup_method', String(newValue));
        if (newValue == 2) {
            console.log("inside eating")
            setOpenSeats(true)
        }else{
            console.log("take food out")
            localStorage.setItem("takeout", "0");
            localStorage.removeItem("selectedImage")
        }
    };

    const handleQuantityChange = (id: string, newQuantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleRemoveItem = (id: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handlePayment = () => {
        alert('Processing Payment...');
    };

    const handleHoldOrder = () => {
        alert('Order Held Successfully!');
    };

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <Box sx={{ width: 300, padding: 1 }}>
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
                购物车
            </Typography>
            <List>
                {cartItems.map((item) => (
                    <ListItem key={item.id} sx={{ display: 'flex', alignItems: 'center' }}>
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
                            sx={{ width: 60, mx: 1 }}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleRemoveItem(item.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ textAlign: 'right' }}>
                总计: ¥{totalPrice.toFixed(2)}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Tabs
                value={takeout}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
            >
                <Tab label="自提" {...a11yProps(0)} />
                <Tab label="外卖" {...a11yProps(1)} disabled={true} />
                <Tab
                    label={`堂食${localStorage.getItem('selectedSeatId') ? ` ${localStorage.getItem('selectedSeatId')}` : ''}`}
                    {...a11yProps(2)}
                />
            </Tabs>

            {/*选择堂食则弹出座位选项*/}
            <MerchantSeats setOpen={setOpenSeats} open={openSeats}/>

            {/*选择就餐人数*/}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
                <PeopleNumber/>
            </Box>

            {/*选择订单结算方式*/}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button variant="outlined" color="warning" fullWidth onClick={handleHoldOrder}>
                    挂单
                </Button>
                <Button variant="contained" color="success" fullWidth onClick={handlePayment}>
                    结算
                </Button>
            </Box>
        </Box>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}