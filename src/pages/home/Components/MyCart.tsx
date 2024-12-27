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
import {Buckets, OrderRequest} from "./Type";
import {toast} from "react-toastify";
import {FormatDate} from "../../../common/MyDatetime";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {useFetchData} from "../../../common/FetchData";
import NumericKeyboardDialog from "../../../common/NumericKeyboardDialog";
import NumbersIcon from '@mui/icons-material/Numbers';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import RemoveIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {CartItem, MyCartProps} from "../../../common/types";

export default function MyCart({cartItems, setCartItems}: MyCartProps) {
    const {holdOrders, setHoldOrders} = useCartContext();

    const [price, setPrice] = React.useState(0);
    const [openPayChannel, setOpenPayChannel] = React.useState(false);
    const [orderID, setOrderID] = React.useState("");
    const [openSeats, setOpenSeats] = React.useState(false);
    const [openTicket, setOpenTicket] = React.useState(false);
    const [openPeople, setOpenPeople] = React.useState(false);
    const [openPhone, setOpenPhone] = React.useState(false);
    const [takeout, setTakeout] = React.useState(0);
    const fetchData = useFetchData()

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

    const handlePlaceOrder = async () => {
        const Cookie = localStorage.getItem('cookie') || '';
        console.log('place order now -->', price);

        // Define the UserData object
        let userData: OrderRequest = {
            at: localStorage.getItem("current_store_id") as string,
            buckets: convertToOrderRequest(cartItems),
            pick: localStorage.getItem("current_pickup_method") as unknown as number,
            seat: localStorage.getItem("selectedSeatId") as string,
            ticket: localStorage.getItem("ticketNumber") as string,
            people: localStorage.getItem("peopleNumber") as string,
            phone: localStorage.getItem("phoneNumber") as string,
        };

        fetchData('/v1/order/pos', (response) => {
            console.log("Request was successful. Response data:", response);
            setPrice(response.price)
            setOpenPayChannel(true);
            setOrderID(response?.identity?.order_no);

        }, "POST", userData);
    };

    const holdOrder = () => {
        console.log("Holding order...");

        // 从 localStorage 获取当前已存储的 holdOrders 列表
        const holdOrders = JSON.parse(localStorage.getItem("holdOrders") || "[]");

        // 从 localStorage 获取当前的 uniqueId，如果不存在则初始化为 1
        let uniqueId = parseInt(localStorage.getItem("uniqueId") || "1", 10);

        // 构建新的 holdOrder 对象
        const newHoldOrder = {
            id: uniqueId, // 使用全局唯一 ID
            cartItems: cartItems, // 保存当前购物车的内容
            createdAt: FormatDate(new Date()), // 保存创建时间
        };

        // 将新订单添加到 holdOrders 数组中
        holdOrders.push(newHoldOrder);

        // 更新 holdOrders 到 localStorage
        localStorage.setItem("holdOrders", JSON.stringify(holdOrders));
        setHoldOrders(holdOrders)

        // 更新 uniqueId 到 localStorage，确保每次调用都递增
        localStorage.setItem("uniqueId", (uniqueId + 1).toString());

        // 清空购物车
        setCartItems([]);

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

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const bindTicket = () => {
        setOpenTicket(true)
    }

    const handleSaveResult = (value: string) => {
        console.log("保存的数字是:", value);
        localStorage.setItem("ticketNumber", value);
    };

    // handleSavePhoneResult
    const handleSavePhoneResult = (value: string) => {
        console.log("保存的数字是:", value);
        localStorage.setItem("phoneNumber", value);
    };

    const bindPeople = () => {
        setOpenPeople(true)
    }

    const bindPhone = () => {
        setOpenPhone(true)
        // TODO 查询手机号是否有vip，有则累计积分
        console.log("查询手机号是否有vip，有则累计积分")
    }

    const handleSavePeopleResult = (value: string) => {
        console.log("保存的数字是:", value);
        localStorage.setItem("peopleNumber", value);
    };

    return (
        <Box sx={{width: 380, padding: 1}}>
            <Typography variant="h5" sx={{textAlign: 'center', mb: 2}}>
                购物车
            </Typography>
            <List>
                {cartItems.map((item) => {
                    // 从 localStorage 获取当前的 uniqueId，如果不存在则初始化为 1
                    let uniqueId = parseInt(localStorage.getItem("uniqueId") || "1", 10);

                    // 生成缓存键
                    let allChoose = ''
                    item?.propsOptions?.map((j) => {
                        const fullPropsKey = `selectedSpiceLevel:${uniqueId + 1}:${item.id}:${j.id}`;
                        const storedValue = localStorage.getItem(fullPropsKey);
                        // 解析存储的数据
                        let cachedData: { id: string; name: string } | null = null;
                        if (storedValue) {
                            try {
                                cachedData = JSON.parse(storedValue);
                                allChoose = allChoose + cachedData?.name + ','
                            } catch (error) {
                                console.error('Error parsing cached data:', error);
                            }
                        }
                    })
                    allChoose.trimEnd()


                    return (<ListItem key={item.id} sx={{display: 'flex', alignItems: 'center'}}>
                            <ListItemText
                                primary={item.name}
                                secondary={`${allChoose}`}
                            />
                            <ListItemText
                                secondary={`¥${item.price.toFixed(2)}`}
                            />
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <IconButton
                                    onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                    size="small"
                                >
                                    <RemoveIcon/>
                                </IconButton>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleQuantityChange(item.id, Math.max(1, Number(e.target.value)))
                                    }
                                    sx={{width: 60, textAlign: 'center'}}
                                />
                                <IconButton
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    size="small"
                                >
                                    <AddCircleOutlineIcon/>
                                </IconButton>
                            </Box>
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleRemoveItem(item.id)}>
                                    <DeleteIcon color={"error"}/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
            <Divider sx={{my: 2}}/>
            <Typography variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: 'red',
                            textAlign: "right"
                        }}>
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
            {/*<Divider sx={{my: 2}}/>*/}
            {/*<Box sx={{mb: 2}}>*/}
            {/*    <PeopleNumber/>*/}
            {/*</Box>*/}

            {/*选择就餐人数*/}
            <Divider sx={{my: 2}}/>
            <Box sx={{
                m: 1, // 外边距
                display: 'flex', // 启用 flex 布局
                justifyContent: 'flex-start', // 水平方向从左到右排列
                alignItems: 'center', // 垂直居中
                gap: 2, // 子元素间距
                flexWrap: 'nowrap', // 禁止换行
                overflowX: 'auto', // 横向滚动
            }}>
                <IconButton aria-label="bindTicket">
                    <NumbersIcon onClick={bindTicket}/>
                    <Typography variant="body1" sx={{ml: 1}} onClick={bindTicket}>
                        {localStorage.getItem('ticketNumber') || "未选择"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <IconButton aria-label="bindPeople">
                    <EmojiPeopleIcon onClick={bindPeople}/>
                    <Typography variant="body1" sx={{ml: 1}} onClick={bindPeople}>
                        {localStorage.getItem('peopleNumber') || "未选择"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <IconButton aria-label="bindPhone">
                    <PhoneIphoneIcon onClick={bindPhone}/>
                    <Typography variant="body1" sx={{ml: 1}} onClick={bindPhone}>
                        {localStorage.getItem('phoneNumber')
                            ? localStorage.getItem('phoneNumber')?.slice(-4) // 仅展示后 4 位
                            : "未选择"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <IconButton aria-label="bindPeople"  disabled={true}>
                    <CardGiftcardIcon onClick={bindPeople}/>
                    <Typography variant="body1" sx={{ml: 1}} onClick={bindPeople}>
                        {localStorage.getItem('peopleNumber') || "未选择"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <NumericKeyboardDialog setOpen={setOpenTicket} open={openTicket} onSave={handleSaveResult} title={"桌台号"}/>
                <NumericKeyboardDialog setOpen={setOpenPeople} open={openPeople} onSave={handleSavePeopleResult} title={"就餐人数"}/>
                <NumericKeyboardDialog setOpen={setOpenPhone} open={openPhone} onSave={handleSavePhoneResult} title={"会员手机号"}/>
            </Box>


            {/*选择订单结算方式*/}
            <Divider sx={{my: 2}}/>
            <Box sx={{display: "flex", justifyContent: "space-between", gap: 2}}>
                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={holdOrder}
                    disabled={cartItems.length === 0}
                >
                    挂单
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
                    <PayChannel setCart={setCartItems} price={price} setOpen={setOpenPayChannel} orderID={orderID} at={localStorage.getItem("current_store_id")}/>
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