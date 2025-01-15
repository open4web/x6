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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import {TransitionProps} from "@mui/material/transitions";
import PayChannel from "../../../common/PayChannel";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {useFetchData} from "../../../common/FetchData";
import {CartItem, MyCartProps} from "../../../common/types";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {FormatDate} from "../../../common/MyDatetime";
import NumbersIcon from "@mui/icons-material/Numbers";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import NumericKeyboardDialog from "../../../common/NumericKeyboardDialog";
import {Alert} from "@mui/material";
import {storeOrderTimestamp} from "../../../utils/expireStore";

export default function MyCart({cartItems, setCartItems}: MyCartProps) {
    const {holdOrders, setHoldOrders} = useCartContext();
    const [price, setPrice] = React.useState(0);
    const [openPayChannel, setOpenPayChannel] = React.useState(false);
    const [orderID, setOrderID] = React.useState("");
    const [openTicket, setOpenTicket] = React.useState(false);
    const [openPeople, setOpenPeople] = React.useState(false);
    const [openPhone, setOpenPhone] = React.useState(false);
    const [hasNotTicket, setHasNotTicket] = React.useState(false);
    const [takeout, setTakeout] = React.useState(0);
    const { fetchData, alertComponent } = useFetchData();

    const handlePlaceOrder = async () => {

        const ticketNumber = localStorage.getItem('ticketNumber');
        if (!ticketNumber) {
            // 检查是否为 null 或空字符串
            setHasNotTicket(true);
            return
        } else {
            setHasNotTicket(false);
        }

        // 增加seat 和phone
        const newOrderRequest = {
            at: localStorage.getItem("current_store_id") as string,
            buckets: convertToOrderRequest(cartItems),
            seat:  localStorage.getItem('ticketNumber'),
            phone:  localStorage.getItem('phoneNumber'),
            people:  localStorage.getItem('peopleNumber'),
        };


        fetchData('/v1/order/pos', (response) => {
            setPrice(response.price);
            setOrderID(response?.identity?.order_no);
            setOpenPayChannel(true);
            // 设置当前订单作为最新订单，这样拉取订单列表时可以标识闪烁凸显
            storeOrderTimestamp(response?.identity?.order_no)
        }, "POST", newOrderRequest);

        // 结算后清空当前选项
        localStorage.removeItem('ticketNumber')
        localStorage.removeItem('phoneNumber')
        localStorage.removeItem('peopleNumber')
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

        console.log("cartItems ===>", cartItems)

        // 将新订单添加到 holdOrders 数组中
        holdOrders.push(newHoldOrder);

        // 更新 holdOrders 到 localStorage
        localStorage.setItem("holdOrders", JSON.stringify(holdOrders));
        setHoldOrders(holdOrders)

        // 更新 uniqueId 到 localStorage，确保每次调用都递增
        localStorage.setItem("uniqueId", (uniqueId + 1).toString());

        // 清空购物车
        setCartItems([]);
        console.log("Hold order stored:", newHoldOrder);
    };

    // 统计各个属性的单价
    const totalPrice = cartItems.reduce((total, item) => {
        // 从 desc 分隔出属性名称
        const descNames = item.desc.split(",").map(name => name.trim());

        // 从 propsOptions 中找到匹配的属性，并累加价格
        const propsTotalPrice = descNames.reduce((propsTotal, name) => {
            let matchedPrice = 0;

            // 遍历 propsOptions 并查找 spiceOptions
            item.spiceOptions.forEach((prop) => {
                const matchedSpice = prop.spiceOptions.find(spice => spice.name === name);
                if (matchedSpice) {
                    matchedPrice += matchedSpice.price;
                }
            });

            return propsTotal + matchedPrice;
        }, 0);

        // 当前商品的总价（含属性价格）
        const itemTotalPrice = (item.price + propsTotalPrice) * item.quantity;

        // 累加到总价
        return total + itemTotalPrice;
    }, 0);

    console.log("Total Price:", totalPrice);

    const bindPeople = () => {
        setOpenPeople(true)
    }

    const bindPhone = () => {
        setOpenPhone(true)
        // TODO 查询手机号是否有vip，有则累计积分
        console.log("查询手机号是否有vip，有则累计积分")
    }

    const bindTicket = () => {
        setOpenTicket(true)
        setHasNotTicket(false)
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
    const handleSavePeopleResult = (value: string) => {
        console.log("保存的数字是:", value);
        localStorage.setItem("peopleNumber", value);
    };

    return (
        <Box sx={{width: 380, padding: 1}}>

            {
                hasNotTicket && (
                    <Alert variant={'standard'} color="error">
                        请先设定台号后再下单
                    </Alert>
                )
            }

            {alertComponent}
            <Typography variant="h5" sx={{textAlign: 'center', mb: 2}}>
                购物车
            </Typography>
            <List>
                {cartItems.map((item) => (
                    <ListItem key={item.id} sx={{display: 'flex', alignItems: 'center'}}>
                        <ListItemText
                            primary={item.name}
                            secondary={`${item.desc}`}
                        />
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <IconButton
                                onClick={() =>
                                    setCartItems((prevItems) =>
                                        prevItems.map((it) =>
                                            it.id === item.id && it.desc === item.desc
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
                                            it.id === item.id && it.desc === item.desc
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
                                            it.id === item.id && it.desc === item.desc
                                                ? {...it, quantity: it.quantity + 1}
                                                : it
                                        )
                                    )
                                }
                                size="small"
                            >
                                <AddCircleIcon/>
                            </IconButton>
                            <Typography variant="h6" sx={{fontWeight: 'bold', color: 'yellow', textAlign: "right"}}>
                                ¥{item.price.toFixed(2)}
                            </Typography>
                        </Box>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() =>
                                setCartItems((prevItems) => prevItems.filter((it) => it.id !== item.id && it.desc === item.desc))
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

            {/*选择就餐人数*/}
            <Divider sx={{my: 2}}/>
            <Box    sx={{
                m: 1, // 外边距
                display: 'flex', // 启用 flex 布局
                justifyContent: 'flex-start', // 水平方向从左到右排列
                alignItems: 'center', // 垂直居中
                gap: 2, // 子元素间距
                flexWrap: 'nowrap', // 禁止换行
                overflowX: 'auto', // 横向滚动
            }}>
                <IconButton aria-label="bindTicket">
                    <NumbersIcon onClick={bindTicket} />
                    <Typography variant="body1" sx={{ ml: 1 }} onClick={bindTicket}>
                        {localStorage.getItem('ticketNumber') || "-"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <IconButton aria-label="bindPeople">
                    <EmojiPeopleIcon onClick={bindPeople} />
                    <Typography variant="body1" sx={{ ml: 1 }} onClick={bindPeople}>
                        {localStorage.getItem('peopleNumber') || "-"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <IconButton aria-label="bindPhone">
                    <PhoneIphoneIcon onClick={bindPhone} />
                    <Typography variant="body1" sx={{ ml: 1 }} onClick={bindPhone}>
                        {localStorage.getItem('phoneNumber')
                            ? localStorage.getItem('phoneNumber')?.slice(-4) // 仅展示后 4 位
                            : "-"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <IconButton aria-label="bindPeople" disabled={true}>
                    <CardGiftcardIcon onClick={bindPeople} />
                    <Typography variant="body1" sx={{ ml: 1 }} onClick={bindPeople}>
                        {localStorage.getItem('peopleNumber') || "-"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <NumericKeyboardDialog setOpen={setOpenTicket} open={openTicket} onSave={handleSaveResult} title={"请输入台号"} min={1} max={99}/>
                <NumericKeyboardDialog setOpen={setOpenPeople} open={openPeople} onSave={handleSavePeopleResult} title={"就餐人数"} min={1} max={20}/>
                <NumericKeyboardDialog setOpen={setOpenPhone} open={openPhone} onSave={handleSavePhoneResult} title={"会员手机号"} min={10000000000} max={19999999999}/>
            </Box>

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
                    color="error"
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
                        待支付金额: <span style={{ color: "#d32f2f", fontWeight: "bold" }}>¥{price.toFixed(2)}</span>
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
        props_text: item.desc,
    }));
}