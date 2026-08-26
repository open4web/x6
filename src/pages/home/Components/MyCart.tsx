import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Slide from "@mui/material/Slide";
import {TransitionProps} from "@mui/material/transitions";
import PaymentDialog from "../../../common/PaymentDialog";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {useFetchData} from "../../../common/FetchData";
import {CartItem, MyCartProps} from "../../../common/types";
import {FormatDate} from "../../../common/MyDatetime";
import NumbersIcon from "@mui/icons-material/Numbers";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import NumericKeyboardDialog from "../../../common/NumericKeyboardDialog";
import TablePicker from "../../../common/TablePicker";
import {readStoreTables, writeStoreTables} from "../../../utils/storeCache";
import {Alert, FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {cartPanelWidth, useCartStyle} from "../../../layout/cartStyle";
import {CartItemList} from "./CartItemLayouts";
import {matchComboGroups, toOrderBuckets, withUnitPrices} from "../../../utils/comboMatch";
import {lookupProductUnitPrice} from "../../../utils/catalogCache";

import {
    Storefront,
    DeliveryDining,
    Restaurant,
    LocalShipping,
    Cloud,
} from '@mui/icons-material';
import MemberSelector from "../../../common/MemberSelector";
import {useSidebarState, useTranslate} from 'react-admin';

export const pickTypes = [
    {id: 0, nameKey: 'pos.cart.pickup_self', color: 'primary', icon: <Storefront />},
    {id: 1, nameKey: 'pos.cart.pickup_takeout', color: 'success', icon: <DeliveryDining />},
    {id: 2, nameKey: 'pos.cart.pickup_dine', color: 'secondary', icon: <Restaurant />},
    {id: 3, nameKey: 'pos.cart.pickup_express', color: 'info', icon: <LocalShipping />},
    {id: 4, nameKey: 'pos.cart.pickup_virtual', color: 'warning', icon: <Cloud />},
];

export default function MyCart({cartItems, setCartItems, comboGroup}: MyCartProps) {
    const translate = useTranslate();
    const [, setSidebarOpen] = useSidebarState();
    const {setHoldOrders, ready, triggerOrderFly, setDrawerOpen, merchantId} = useCartContext();
    const [price, setPrice] = React.useState(0);
    const [openPayChannel, setOpenPayChannel] = React.useState(false);
    const [orderID, setOrderID] = React.useState("");
    const [openTicket, setOpenTicket] = React.useState(false);
    const [openSeatBoard, setOpenSeatBoard] = React.useState(false);
    const [openPeople, setOpenPeople] = React.useState(false);
    const [openPhone, setOpenPhone] = React.useState(false);
    const [hasNotTicket, setHasNotTicket] = React.useState(false);
    const [needAddress, setNeedAddress] = React.useState(false);
    const [address, setAddress] = React.useState(() => localStorage.getItem('deliveryAddress') || '');
    const [receiver, setReceiver] = React.useState(() => localStorage.getItem('deliveryReceiver') || '');
    const [cartStyle] = useCartStyle();
    const [orderCount, setOrderCount] = React.useState(0);
    const [totalItems, setTotalItems] = React.useState(0);
    const [estimatedWait, setEstimatedWait] = React.useState(0);
    const {fetchData, alertComponent} = useFetchData();

    const [pick, setPick] = React.useState(2); // 默认为堂食 (2)

    const pricedItems = React.useMemo(
        () => withUnitPrices(cartItems, id => lookupProductUnitPrice(merchantId, id)),
        [cartItems, merchantId],
    );
    const comboResult = React.useMemo(
        () => matchComboGroups(pricedItems, comboGroup),
        [pricedItems, comboGroup],
    );

    const handlePickChange = (event: { target: { value: any; }; }) => {
        const next = Number(event.target.value);
        setPick(next);
        if (next !== 1) {
            setNeedAddress(false);
        }
    };

    const isTakeout = pick === 1;

    const handlePlaceOrder = async () => {
        if (!ready) {
            return;
        }
        const ticketNumber = localStorage.getItem('ticketNumber');
        const seatId = localStorage.getItem('selectedSeatId') || '';
        const phone = localStorage.getItem('phoneNumber') || '';
        const deliveryAddress = address.trim();

        if (isTakeout) {
            if (!deliveryAddress) {
                setNeedAddress(true);
                return;
            }
            localStorage.setItem('deliveryAddress', deliveryAddress);
            if (receiver.trim()) {
                localStorage.setItem('deliveryReceiver', receiver.trim());
            }
            setNeedAddress(false);
            setHasNotTicket(false);
        } else if (!ticketNumber || ticketNumber.trim() === "") {
            setHasNotTicket(true);
            setOpenTicket(true);
            return;
        } else {
            setHasNotTicket(false);
        }

        const newOrderRequest = {
            at: localStorage.getItem("current_store_id") as string,
            buckets: toOrderBuckets(pricedItems, comboResult),
            combos: comboResult.matches.map(hit => ({
                id: hit.id,
                name: hit.name,
                count: hit.count,
                price: hit.price,
                discount: hit.discount,
                items: hit.items,
            })),
            seat: isTakeout ? '' : localStorage.getItem('ticketNumber'),
            phone,
            people: localStorage.getItem('peopleNumber'),
            pick: pick,
            address: isTakeout ? deliveryAddress : '',
            take_out: isTakeout ? {
                address: deliveryAddress,
                receiver: receiver.trim(),
                rec_phone: phone,
            } : undefined,
        };

        await fetchData('/v1/hlj/order/pos', (response) => {
            const createdOrderNo = response?.identity?.order_no || "";
            setPrice(response?.price || 0);
            setOrderID(createdOrderNo);
            setOpenPayChannel(true);
            if (!isTakeout && seatId) {
                occupyCurrentSeat(createdOrderNo, seatId);
            }

            // 设置订单预计排队信息
            setOrderCount(response?.orderCount || 0);
            setTotalItems(response?.totalItems || 0);
            setEstimatedWait(response?.estimatedWait || 0);
        }, "POST", newOrderRequest);

        // 清空购物车和临时数据
        resetCartAfterOrder();
    };

// 新增一个专门用于结算后清理的函数
    const resetCartAfterOrder = () => {
        localStorage.removeItem('ticketNumber');
        localStorage.removeItem('selectedSeatId');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('peopleNumber');
        setCartItems([]);
    };

    const occupyCurrentSeat = (orderNo: string, seatId: string) => {
        const storeId = localStorage.getItem('current_store_id') || '';
        if (!storeId || !seatId) {
            return;
        }
        const people = Number(localStorage.getItem('peopleNumber') || 0);
        fetchData(`/v1/hlj/store/seat/${storeId}`, () => {
            const cached = readStoreTables(storeId);
            if (!cached) {
                return;
            }
            writeStoreTables(storeId, {
                ...cached,
                seats: (cached.seats || []).map(item => item.id === seatId ? {
                    ...item,
                    status: 1,
                    order_no: orderNo,
                    occupied_at: Math.floor(Date.now() / 1000),
                    people: people || item.people,
                } : item),
            });
        }, 'PUT', {id: seatId, status: 1, order_no: orderNo, people});
    };

    const holdOrder = (event?: React.MouseEvent) => {
        const stored = JSON.parse(localStorage.getItem("holdOrders") || "[]");
        let uniqueId = parseInt(localStorage.getItem("uniqueId") || "1", 10);

        const newHoldOrder = {
            id: uniqueId,
            cartItems: cartItems,
            createdAt: FormatDate(new Date()),
        };

        stored.push(newHoldOrder);
        localStorage.setItem("holdOrders", JSON.stringify(stored));
        setHoldOrders(stored);
        localStorage.setItem("uniqueId", (uniqueId + 1).toString());

        triggerOrderFly(String(uniqueId), {
            start: {
                x: event?.clientX ?? window.innerWidth - 180,
                y: event?.clientY ?? window.innerHeight / 2,
            },
            kind: 'hold',
        });

        setSidebarOpen(true);
        setCartItems([]);
        setDrawerOpen(false);
        localStorage.removeItem('ticketNumber');
        localStorage.removeItem('selectedSeatId');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('peopleNumber');
    };

    const totalPrice = comboResult.payAmount;

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

    const handleSaveResult = (value: {tableNo: string; seatId?: string; people?: number; intent?: string} | string) => {
        const tableNo = typeof value === 'string' ? value : value.tableNo;
        if (!tableNo || tableNo.trim() === "") {
            return;
        }
        localStorage.setItem("ticketNumber", tableNo);
        if (typeof value !== 'string' && value.seatId) {
            localStorage.setItem('selectedSeatId', value.seatId);
        }
        if (typeof value !== 'string' && value.people && !localStorage.getItem('peopleNumber')) {
            localStorage.setItem('peopleNumber', String(value.people));
        }
        setHasNotTicket(false);
        if (typeof value !== 'string' && value.intent === 'add') {
            return;
        }
        setTimeout(() => {
            handlePlaceOrder();
        }, 300);
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
        localStorage.removeItem('selectedSeatId')
        localStorage.removeItem('phoneNumber')
        localStorage.removeItem('peopleNumber')
        setCartItems([])
    }



    const changeQty = (item: CartItem, delta: number) => {
        setCartItems(prevItems =>
            prevItems.map(it =>
                it.id === item.id && it.desc === item.desc
                    ? {...it, quantity: Math.max(1, it.quantity + delta)}
                    : it
            )
        );
    };

    const removeItem = (item: CartItem) => {
        setCartItems(prevItems =>
            prevItems.filter(it => !(it.id === item.id && it.desc === item.desc))
        );
    };

    function getDialog() {
        return (
            <PaymentDialog
                open={openPayChannel}
                onClose={() => setOpenPayChannel(false)}
                price={price}
                orderID={orderID}
                orderCount={orderCount}
                totalItems={totalItems}
                estimatedWait={estimatedWait}
                fetchData={fetchData}
                setCart={setCartItems}
                storeId={localStorage.getItem("current_store_id") || ''}
            />
        );
    }

    const docked = cartStyle === 'dock';
    const ticketLook = cartStyle === 'ticket';

    return (
        <Box sx={{
            width: cartPanelWidth(cartStyle),
            padding: 1,
            bgcolor: ticketLook ? '#fffaf3' : docked ? '#fafafa' : 'background.paper',
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>

            {
                hasNotTicket && !isTakeout && (
                    <Alert variant={'standard'} color="error">
                        {translate('pos.cart.need_table')}
                    </Alert>
                )
            }
            {
                needAddress && isTakeout && (
                    <Alert variant={'standard'} color="error">
                        {translate('pos.cart.need_address')}
                    </Alert>
                )
            }

            {alertComponent}
            <Typography variant="h5" sx={{
                textAlign: 'center',
                mb: 2,
                letterSpacing: ticketLook ? 3 : 0,
                fontFamily: ticketLook ? 'ui-monospace, Menlo, monospace' : undefined,
            }}>
                {translate('pos.cart.title')}
            </Typography>
            <Box sx={{flex: 1, overflowY: 'auto'}}>
                <CartItemList
                    items={pricedItems}
                    styleName={cartStyle}
                    comboMarks={comboResult.lineMarks}
                    onInc={item => changeQty(item, 1)}
                    onDec={item => changeQty(item, -1)}
                    onRemove={removeItem}
                />
            </Box>
            <Divider sx={{my: 2}}/>
            {comboResult.matches.length > 0 && (
                <Box sx={{px: 0.5, mb: 1}}>
                    {comboResult.matches.map(hit => (
                        <Box key={hit.id} sx={{mb: 1, p: 1, borderRadius: 1, bgcolor: '#fff8e1'}}>
                            <Typography sx={{fontWeight: 800, fontSize: 14}}>
                                {translate('pos.cart.combo_match')} · {hit.name} ×{hit.count}
                                <Box component="span" sx={{float: 'right', color: '#d32f2f'}}>
                                    ¥{(hit.price * hit.count).toFixed(2)}
                                </Box>
                            </Typography>
                            {hit.items.map((item, index) => (
                                <Typography key={`${item.id}-${index}`} variant="caption" sx={{display: 'block', color: '#5d4037'}}>
                                    {item.comboName ? `${item.comboName} · ` : ''}{item.name} ×{item.quantity}
                                </Typography>
                            ))}
                            {hit.discount > 0 && (
                                <Typography variant="caption" sx={{color: '#2e7d32', fontWeight: 700}}>
                                    {translate('pos.cart.discount')}: ¥{hit.discount.toFixed(2)}
                                </Typography>
                            )}
                        </Box>
                    ))}
                    {comboResult.totalDiscount > 0 && (
                        <Typography variant="body2" sx={{textAlign: 'right', color: '#2e7d32', fontWeight: 700}}>
                            {translate('pos.cart.total_discount')}: ¥{comboResult.totalDiscount.toFixed(2)}
                        </Typography>
                    )}
                </Box>
            )}
            <Divider sx={{my: 2}}/>

            <Typography variant="h6" sx={{
                fontWeight: 'bold',
                textAlign: 'right',
                bgcolor: docked ? '#3e2723' : 'transparent',
                color: docked ? '#ffcc80' : 'red',
                px: docked ? 1.5 : 0,
                py: docked ? 1 : 0,
                borderRadius: docked ? 1 : 0,
                mt: docked ? 1 : 0,
            }}>
                {comboResult.totalDiscount > 0 && (
                    <Box component="span" sx={{color: docked ? '#bcaaa4' : '#9e9e9e', textDecoration: 'line-through', mr: 1, fontSize: '0.9rem', fontWeight: 500}}>
                        ¥{comboResult.originalAmount.toFixed(2)}
                    </Box>
                )}
                {translate('pos.cart.total')}: ¥{totalPrice.toFixed(2)}
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
                <TablePicker
                    open={openTicket}
                    setOpen={setOpenTicket}
                    storeId={localStorage.getItem('current_store_id') || ''}
                    onSave={handleSaveResult}
                />
                <NumericKeyboardDialog setOpen={setOpenPeople} open={openPeople} onSave={handleSavePeopleResult}
                                       title={translate('pos.cart.people')} min={1} max={20}/>
                <MemberSelector
                    price={price}
                    orderID={orderID}
                    fetchData={fetchData}
                    modal={true}
                    open={openPhone}
                    onClose={() => setOpenPhone(false)}
                    onSuccess={() => {
                        setOpenPhone(false);
                        // 其他成功逻辑...
                    }}
                />


            </Box>

            <Divider sx={{my: 2}}/>



            {/* 选择取餐方式 */}
            {/* 选择取餐方式 */}
            <FormControl component="fieldset" fullWidth>
                <RadioGroup row value={pick} onChange={handlePickChange}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap",
                            width: "100%",
                        }}
                    >
                        {pickTypes
                            .filter(type => type.id <= 2) // 如果只展示：自提/外卖/堂食（可按需删）
                            .map(type => (
                                <FormControlLabel
                                    key={type.id}
                                    value={type.id}
                                    control={<Radio />}
                                    label={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                            }}
                                        >
                                            {React.cloneElement(type.icon, {
                                                sx: { fontSize: 18 },
                                            })}
                                            <Typography variant="body2">
                                                {translate(type.nameKey)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            ))}
                    </Box>
                </RadioGroup>
            </FormControl>

            {isTakeout && (
                <Box sx={{mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1}}>
                    <TextField
                        size="small"
                        required
                        error={needAddress && !address.trim()}
                        label={translate('pos.cart.address')}
                        placeholder={translate('pos.cart.address_ph')}
                        value={address}
                        onChange={event => {
                            setAddress(event.target.value);
                            if (event.target.value.trim()) {
                                setNeedAddress(false);
                            }
                        }}
                        multiline
                        minRows={2}
                        fullWidth
                    />
                    <TextField
                        size="small"
                        label={translate('pos.cart.receiver')}
                        value={receiver}
                        onChange={event => setReceiver(event.target.value)}
                        fullWidth
                    />
                </Box>
            )}

            <Divider sx={{my: 2}}/>

            <Box sx={{display: "flex", justifyContent: "space-between", gap: 2}}>
                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={resetCart}
                    disabled={cartItems.length === 0}
                >
                    {translate('pos.cart.clear')}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={holdOrder}
                    disabled={!ready || cartItems.length === 0}
                >
                    {translate('pos.cart.hold')}
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={handlePlaceOrder}
                    disabled={!ready || cartItems.length === 0}
                >
                    {translate('pos.cart.checkout')}
                </Button>
            </Box>
            {!isTakeout && (
            <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{mt: 1.5}}
                onClick={() => setOpenSeatBoard(true)}
            >
                {translate('pos.cart.view_seats')}
            </Button>
            )}
            <TablePicker
                open={openSeatBoard}
                setOpen={setOpenSeatBoard}
                storeId={localStorage.getItem('current_store_id') || ''}
                onSave={(value) => {
                    if (value.tableNo) {
                        localStorage.setItem('ticketNumber', value.tableNo);
                    }
                    if (value.seatId) {
                        localStorage.setItem('selectedSeatId', value.seatId);
                    }
                }}
            />
            {getDialog()}
        </Box>

    );
}

function Transition(props: TransitionProps & { children: React.ReactElement<any, any> }) {
    return <Slide direction="up" {...props} />;
}