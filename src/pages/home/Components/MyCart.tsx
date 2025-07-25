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
import {Alert, FormControl, FormControlLabel, LinearProgress, Radio, RadioGroup} from "@mui/material";
import {storeOrderTimestamp} from "../../../utils/expireStore";
import {MenuData} from "./Type";
import {GenerateColorFromId} from "../../../utils/randColor";
import {useEffect, useState} from "react";

/**
 * Convert nanoseconds to human-readable time string
 * @param nanoseconds Time duration in nanoseconds
 * @returns Formatted time string with appropriate unit
 */
export function formatNanoseconds(nanoseconds: number): string {
    // Convert nanoseconds to seconds
    const seconds = nanoseconds / 1e9;

    if (seconds < 60) {
        // Less than 1 minute - show in seconds
        return `${seconds.toFixed(2)}秒`;
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
        // Less than 1 hour - show in minutes
        return `${minutes.toFixed(2)}分钟`;
    }

    const hours = minutes / 60;
    if (hours < 24) {
        // Less than 1 day - show in hours
        return `${hours.toFixed(2)}小时`;
    }

    // 1 day or more - show in days
    const days = hours / 24;
    return `${days.toFixed(2)}天`;
}

interface Meta {
    namespace: string;
    merchant_id: string;
    founder: string;
    updater: string;
    account_id: string;
    created_at: string;
    updated_at: string;
    created_time: number;
    updated_time: number;
    status: boolean;
    deleted: boolean;
    access_level: number;
}

interface Context {
    // 根据实际上下文数据结构补充
    [key: string]: any;
}

interface ComboItem {
    combName: string;
    price: number;
    requires: number; // 需要选择的数量
    products: string[]; // 可选商品列表
}

export interface ComboGroup {
    _: {
        meta: Meta;
        context: Context;
    };
    id: string;
    is_show_backstage: number;
    sort: number;
    goods_type: number;
    is_sell: boolean;
    icon: string;
    products: string[];
    goods_list: null;
    stores: null;
    update_type: number;

    name: string; // 套餐唯一标识
    discount: number; // 套餐优惠金额
    combo: ComboItem[]; // 套餐包含的组合项
}

interface MatchedCombo {
    groupId: string;
    matchedItems: {
        comboName: string;
        matchedProducts: string[];
        requires: number;
        price: number;
    }[];
    discount: number;
}

interface ComboMatchResult {
    matchedGroups: MatchedCombo[]; // 匹配成功的套餐组
    totalDiscount: number; // 总优惠金额
    usedProductIds: Set<string>; // 已使用的商品ID（避免重复使用）
}

export default function MyCart({cartItems, setCartItems, comboGroup}: MyCartProps) {
    const {holdOrders, setHoldOrders} = useCartContext();
    const [price, setPrice] = React.useState(0);
    const [openPayChannel, setOpenPayChannel] = React.useState(false);
    const [orderID, setOrderID] = React.useState("");
    const [openTicket, setOpenTicket] = React.useState(false);
    const [openPeople, setOpenPeople] = React.useState(false);
    const [openPhone, setOpenPhone] = React.useState(false);
    const [hasNotTicket, setHasNotTicket] = React.useState(false);


    const [orderCount, setOrderCount] = React.useState(0);
    const [totalItems, setTotalItems] = React.useState(0);
    const [estimatedWait, setEstimatedWait] = React.useState(0);

    const {fetchData, alertComponent} = useFetchData();

    const [pick, setPick] = React.useState(1); // 默认为堂食 (1)
    const {merchantId} = useCartContext();
    /**
     * 匹配购物车中的套餐组合
     * @param cartItems 购物车商品
     * @param comboGroups 所有套餐配置
     * @returns 匹配结果
     */
    function matchComboGroups(cartItems: CartItem[], comboGroups: ComboGroup[]): ComboMatchResult {
        const inputProductIds = cartItems.map(item => item.id);
        const result: ComboMatchResult = {
            matchedGroups: [],
            totalDiscount: 0,
            usedProductIds: new Set<string>()
        };

        // 按优惠金额降序排序，优先匹配优惠大的套餐
        const sortedGroups = [...comboGroups].sort((a, b) => b.discount - a.discount);

        for (const group of sortedGroups) {
            const groupMatch: MatchedCombo = {
                groupId: group.name,
                matchedItems: [],
                discount: group.discount
            };
            let isGroupMatched = true;

            // 检查套餐内每个combo是否满足
            for (const combo of group.combo) {
                // 找出未被使用且存在于购物车的商品
                const availableProducts = combo.products.filter(
                    productId => inputProductIds.includes(productId) &&
                        !result.usedProductIds.has(productId)
                );

                // 检查是否满足数量要求
                if (availableProducts.length >= combo.requires) {
                    // 选择前requires个商品
                    const matchedProducts = availableProducts.slice(0, combo.requires);

                    groupMatch.matchedItems.push({
                        comboName: combo.combName,
                        matchedProducts,
                        requires: combo.requires,
                        price: combo.price
                    });

                    // 标记这些商品为已使用
                    matchedProducts.forEach(id => result.usedProductIds.add(id));
                } else {
                    isGroupMatched = false;
                    break;
                }
            }

            // 如果套餐完全匹配，则加入结果
            if (isGroupMatched) {
                result.matchedGroups.push(groupMatch);
                result.totalDiscount += group.discount;
            } else {
                // 如果套餐不匹配，回滚已使用的商品
                groupMatch.matchedItems.forEach(item => {
                    item.matchedProducts.forEach(id => {
                        result.usedProductIds.delete(id);
                    });
                });
            }
        }

        return result;
    }

//     TODO 套餐需要提供一个套餐接口专门返回套餐的配置
// 示例套餐数据
//     const comboGroups: ComboGroup[] = [
//         {
//             name: "明星套餐",
//             discount: 5, // 优惠5元
//             combos: [
//                 {
//                     combName: "主菜",
//                     price: 19.9,
//                     requires: 1, // 必须选1个
//                     products: ["677f3d26f52225c3b0f8201c", "677be0bb0e4c843e93739d8c"],
//                 },
//                 {
//                     combName: "配菜",
//                     price: 20,
//                     requires: 2, // 必须选2个
//                     products: ["677e9b81f52225c3b0f82017", "677ce9850e4c843e93739d8f", "658433d6b0b2481d7f696e53"],
//                 },
//             ],
//         },
//         {
//             name: "开心套餐2",
//             discount: 3, // 优惠5元
//             combos: [
//                 {
//                     combName: "主菜",
//                     price: 39.9,
//                     requires: 1, // 必须选1个
//                     products: ["677f3d26f52225c3b0f8201c", "677be0bb0e4c843e93739d8c"],
//                 },
//                 {
//                     combName: "配菜",
//                     price: 10,
//                     requires: 3, // 必须选2个
//                     products: ["677e9b81f52225c3b0f82017", "677ce9850e4c843e93739d8f", "658433d6b0b2481d7f696e53"],
//                 },
//             ],
//         },
//     ];

    // [
    //     {
    //         "combName": "",
    //         "price": 1,
    //         "quantity": 4,
    //         "requires": 0,
    //         "products": [
    //             "6584328ab0b2481d7f696e3d",
    //             "65843326b0b2481d7f696e49"
    //         ]
    //     },

    const handlePickChange = (event: { target: { value: any; }; }) => {
        setPick(Number(event.target.value));
    };

    const handlePlaceOrder = async () => {

        const ticketNumber = localStorage.getItem('ticketNumber');
        if (!ticketNumber) {
            // 检查是否为 null 或空字符串
            setHasNotTicket(true);
            setOpenTicket(true);
            return
        } else {
            setHasNotTicket(false);
        }

        // 增加seat 和phone
        const newOrderRequest = {
            at: localStorage.getItem("current_store_id") as string,
            buckets: convertToOrderRequest(cartItems),
            seat: localStorage.getItem('ticketNumber'),
            phone: localStorage.getItem('phoneNumber'),
            people: localStorage.getItem('peopleNumber'),
            pick: pick,
        };

        await fetchData('/v1/order/pos', (response) => {
            setPrice(response?.price);
            setOrderID(response?.identity?.order_no);
            setOpenPayChannel(true);
            // 设置当前订单作为最新订单，这样拉取订单列表时可以标识闪烁凸显
            storeOrderTimestamp(response?.identity?.order_no)

            // 设置订单预计排队信息
            setOrderCount(response?.orderCount)
            setTotalItems(response?.totalItems)
            setEstimatedWait(response?.estimatedWait)
        }, "POST", newOrderRequest);

        // 结算后清空当前选项
        localStorage.removeItem('ticketNumber')
        localStorage.removeItem('phoneNumber')
        localStorage.removeItem('peopleNumber')

        // 清空购物车
        setCartItems([]);
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

        // 结算后清空当前选项
        localStorage.removeItem('ticketNumber')
        localStorage.removeItem('phoneNumber')
        localStorage.removeItem('peopleNumber')
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
        // setHasNotTicket(false)
    }

    const handleSaveResult = (value: string) => {
        console.log("保存的数字是:", value);
        localStorage.setItem("ticketNumber", value);
        setHasNotTicket(false)
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

    const resetCart = () => {
        localStorage.removeItem('ticketNumber')
        localStorage.removeItem('phoneNumber')
        localStorage.removeItem('peopleNumber')
        setCartItems([])
    }

    const comboResult = React.useMemo(() => {
        console.log("comboGroups-->", comboGroup)
        return matchComboGroups(cartItems, comboGroup);
    }, [cartItems]);
    //
    // useEffect(() => {
    //     const payload = {
    //         "merchantId": merchantId,
    //     }
    //
    //     // 获取菜谱列表
    //     fetchData('/v1/pos/combs', (response) => {
    //         const cm = response || [];
    //         setCombs(cm);
    //     }, "POST", payload);
    // }, [merchantId]);

    return (
        <Box sx={{width: 400, padding: 1}}>

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
                            primary={
                                <Box sx={{position: 'relative', paddingTop: item.combName ? '0.9rem' : '0.9rem'}}>
                                    {item.combName && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                fontSize: '0.65rem', // 字体小一点
                                                fontWeight: 'bold', // 加粗
                                                color: '#d32f2f', // 深红色，提高对比度
                                            }}
                                        >
                                            {item.combName}
                                        </Typography>
                                    )}
                                    {!item.combName && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                fontSize: '0.65rem', // 字体小一点
                                                fontWeight: 'bold', // 加粗
                                                color: 'gray', // 深红色，提高对比度
                                            }}
                                        >
                                            {item.kindName}
                                        </Typography>
                                    )}
                                    <Typography variant="body1">{item.name}</Typography>
                                </Box>
                            }
                            secondary={item.desc}
                        />

                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.1}}>

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
                                // disabled={!!item.combName} // 如果 combName 存在，则禁用按钮
                            >
                                <RemoveIcon/>
                            </IconButton>
                            <TextField
                                type="text"
                                size="small"
                                disabled={true}
                                value={item.quantity}
                                onChange={(e) =>
                                    setCartItems((prevItems) =>
                                        prevItems.map((it) =>
                                            it.id === item.id && it.desc === item.desc
                                                ? {...it, quantity: Math.max(1, Math.min(10, Number(e.target.value)))} // 限制范围 1-10
                                                : it
                                        )
                                    )
                                }
                                inputProps={{
                                    style: {textAlign: 'center'}, // 让输入的文本居中
                                }}
                                sx={{
                                    width: 50, // 适当缩小宽度，更紧凑
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderWidth: '1px', // 边框变细
                                        },
                                        '&:hover fieldset': {
                                            borderWidth: '1px', // 悬停时保持细边框
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderWidth: '1px', // 聚焦时也保持细边框
                                        },
                                    },
                                    '& input': {
                                        textAlign: 'center', // 确保文本在输入框中居中
                                        padding: '4px 0', // 减少内边距，使其更紧凑
                                        fontSize: '0.9rem', // 字体稍微调小
                                    },
                                }}
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
                                // disabled={!!item.combName} // 如果 combName 存在，则禁用按钮
                            >
                                <AddCircleIcon/>
                            </IconButton>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'darkorange',
                                    textAlign: "right",
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontFamily: 'monospace', // 确保数字等宽
                                    minWidth: '60px', // 设定最小宽度，避免价格长度变化导致对齐问题
                                    justifyContent: 'flex-end' // 让价格靠右对齐
                                }}
                            >
                                {item.price.toFixed(2)}
                            </Typography>
                        </Box>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() =>
                                setCartItems((prevItems) =>
                                    prevItems.filter(
                                        (it) => !(it.id === item.id && it.desc === item.desc)
                                    )
                                )
                            }>
                                <DeleteIcon color={"error"}/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{my: 2}}/>
            {/* Display combo meal summaries if there are any */}
            <div>
                { comboResult.matchedGroups.map(group => (
                    <div key={group.groupId}>
                        <h3>{group.groupId} (优惠: ¥{group.discount})</h3>
                        {group.matchedItems.map((item, index) => (
                            <div key={index}>
                                <p>{item.comboName}: {item.matchedProducts.join(", ")}</p>
                            </div>
                        ))}
                    </div>
                ))
                }

            {
                comboResult.totalDiscount > 0 && (
                    <p>总优惠: ¥{comboResult.totalDiscount}</p>
                )
            }
        </div>
            <Typography variant="h6" sx={{fontWeight: 'bold', color: 'red', textAlign: "right"}}>
                总计: ¥{totalPrice.toFixed(2)}
            </Typography>

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
                        {localStorage.getItem('ticketNumber') || "-"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <IconButton aria-label="bindPeople">
                    <EmojiPeopleIcon onClick={bindPeople}/>
                    <Typography variant="body1" sx={{ml: 1}} onClick={bindPeople}>
                        {localStorage.getItem('peopleNumber') || "-"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <IconButton aria-label="bindPhone">
                    <PhoneIphoneIcon onClick={bindPhone}/>
                    <Typography variant="body1" sx={{ml: 1}} onClick={bindPhone}>
                        {localStorage.getItem('phoneNumber')
                            ? localStorage.getItem('phoneNumber')?.slice(-4) // 仅展示后 4 位
                            : "-"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <IconButton aria-label="bindPeople" disabled={true}>
                    <CardGiftcardIcon onClick={bindPeople}/>
                    <Typography variant="body1" sx={{ml: 1}} onClick={bindPeople}>
                        {localStorage.getItem('peopleNumber') || "-"} {/* 默认显示"未选择" */}
                    </Typography>
                </IconButton>
                <NumericKeyboardDialog setOpen={setOpenTicket} open={openTicket} onSave={handleSaveResult}
                                       title={"请输入台号"} min={1} max={99}/>
                <NumericKeyboardDialog setOpen={setOpenPeople} open={openPeople} onSave={handleSavePeopleResult}
                                       title={"就餐人数"} min={1} max={20}/>
                <NumericKeyboardDialog setOpen={setOpenPhone} open={openPhone} onSave={handleSavePhoneResult}
                                       title={"会员手机号"} min={10000000000} max={19999999999}/>
            </Box>

            <Divider sx={{my: 2}}/>

            {/* 选择取餐方式 */}
            <FormControl component="fieldset" fullWidth={true}>
                <RadioGroup row value={pick} onChange={handlePickChange}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2
                    }}>
                        <FormControlLabel value={0} control={<Radio/>} label="自提"/>
                        <FormControlLabel value={1} control={<Radio/>} label="堂食"/>
                        <FormControlLabel value={2} control={<Radio/>} label="外卖"/>
                    </Box>
                </RadioGroup>
            </FormControl>

            <Divider sx={{my: 2}}/>

            <Box sx={{display: "flex", justifyContent: "space-between", gap: 2}}>
                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={resetCart}
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
                        待支付金额: <span style={{color: "#d32f2f", fontWeight: "bold"}}>¥{price.toFixed(2)}</span>
                    </Typography>
                    {/*valueBuffer 应该设置为商品数量*/}
                    <LinearProgress variant="buffer" value={totalItems} valueBuffer={30}/>
                    <Box sx={{minWidth: 35}}>
                        <Typography
                            variant="body2"
                            sx={{color: 'text.secondary'}}
                        >{`${Math.round(orderCount)}%`}</Typography>
                    </Box>
                    <Typography variant="subtitle1" align="center" color="text.secondary">
                        预计等待时间: <span
                        style={{color: "#dfff2f", fontWeight: "bold"}}>⏳{formatNanoseconds(estimatedWait)}</span>
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

function Transition(props: TransitionProps & { children: React.ReactElement<any, any> }) {
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