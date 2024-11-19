import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function MyCart() {
    const [cartItems, setCartItems] = React.useState([
        { id: 1, name: 'Spicy Noodles', price: 12.99, quantity: 1 },
        { id: 2, name: 'Fried Rice', price: 10.99, quantity: 1 },
    ]);
    const [diningOption, setDiningOption] = React.useState('dineIn');
    const [peopleCount, setPeopleCount] = React.useState(1);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = (open: boolean) => {
        setDrawerOpen(open);
    };

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleRemoveItem = (id: number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handlePayment = () => {
        alert('Processing Payment...');
    };

    const handleHoldOrder = () => {
        alert('Order Held Successfully!');
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
                <Box sx={{ width: 300, padding: 1 }}>
                    <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
                        Shopping Cart
                    </Typography>
                    <List>
                        {cartItems.map((item) => (
                            <ListItem key={item.id} sx={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`Price: $${item.price.toFixed(2)}`}
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
                        Total: ${totalPrice.toFixed(2)}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Dining Option</InputLabel>
                            <Select
                                value={diningOption}
                                onChange={(e) => setDiningOption(e.target.value)}
                            >
                                <MenuItem value="dineIn">Dine In</MenuItem>
                                <MenuItem value="takeAway">Take Away</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Number of People"
                            value={peopleCount}
                            onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value)))}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Button variant="outlined" color="warning" fullWidth onClick={handleHoldOrder}>
                            Hold Order
                        </Button>
                        <Button variant="contained" color="success" fullWidth onClick={handlePayment}>
                            Pay Now
                        </Button>
                    </Box>
                </Box>
    );
}