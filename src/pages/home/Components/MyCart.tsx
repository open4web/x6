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
import {ComboGroup, ComboMatchResult, MatchedCombo} from "../types";
import {convertToOrderRequest, FormatNanoseconds} from "../../../utils/time";


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


    // 初始化一个空的 Map<string, number>
    const [numberMap, setNumberMap] = React.useState<Map<string, number>>(() => new Map());

    // 添加或更新键值对
    const addOrUpdateEntry = (key: string, value: number) => {

        const old = getValue(key)
        if (old != undefined ) {
            // 如果存在则进行加1
            value = old + 1
        }

        setNumberMap(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(key, value);
            return newMap;
        });
    };

    // 删除键值对
    const removeEntry = (key: string) => {
        setNumberMap(prevMap => {
            const newMap = new Map(prevMap);
            newMap.delete(key);
            return newMap;
        });
    };

    // 获取值
    const getValue = (key: string) => {
        return numberMap.get(key) ;
    };


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
            usedProductIds: new Set<string>(),
            price: 0,
            count: 0,
        };

        // 按优惠金额降序排序，优先匹配优惠大的套餐
        const sortedGroups = [...comboGroups].sort((a, b) => b.discount - a.discount);

        for (const group of sortedGroups) {
            const groupMatch: MatchedCombo = {
                count: 0,
                groupId: group.name,
                matchedItems: [],
                discount: group.discount,
                price: group.price
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
                    // 如果商品匹配数量是0则不匹配任何套餐
                    if (matchedProducts.length==0) {
                        isGroupMatched = false
                        continue 
                    }
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
                groupMatch.count+=1
                result.matchedGroups.push(groupMatch);
                result.totalDiscount += group.discount;
                result.price += group.price;
                // result.count += 1
                addOrUpdateEntry(groupMatch.groupId, 1)
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

        // item.combPrice
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
        // TODO 套餐不在这里进行加和
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

    function getDialog() {
        return <Dialog
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
                    style={{color: "#dfff2f", fontWeight: "bold"}}>⏳{FormatNanoseconds(estimatedWait)}</span>
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
        </Dialog>;
    }

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
                {comboResult.matchedGroups.map(group => (
                    group.matchedItems.length > 0 ?
                        <div key={group.groupId}>
                            <h4>
                                {group.groupId}: {group.price > 0 ? ` ¥${group.price}` : ''} x {getValue(group.groupId)}
                                {group.discount > 0 ? ` (优惠: ¥${group.discount})` : ''}
                            </h4>
                            {group.matchedItems.map((item, index) => (
                                <div key={index}>
                                    {/*这里可以选择展示商品名称*/}
                                    <p>{item.comboName}: {item.matchedProducts.join(", ")}</p>
                                </div>
                            ))}
                        </div>

                        : <div></div>
                ))
                }

                {
                    comboResult.totalDiscount > 0 && (
                        <p>总优惠: ¥{comboResult.totalDiscount}</p>
                    )
                }
            </div>
            <Divider sx={{my: 2}}/>

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
            {getDialog()}
        </Box>

    );
}

function Transition(props: TransitionProps & { children: React.ReactElement<any, any> }) {
    return <Slide direction="up" {...props} />;
}