import React, { useState } from 'react';
import { Box, IconButton, Button, Alert, Snackbar } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MyCard from "../MyCard";
import { CombSelectInfo, ProductItem } from "./Type";
import Typography from "@mui/material/Typography";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {CartItem} from "../../../common/types"; // 引入你的 ProductItem 类型定义

interface MyCardWithScrollProps {
    groupItems: ProductItem[]; // 直接使用传递的 groupItems 参数
    groupedDataSelectInfo: { [key: string]: CombSelectInfo }; // 用于存储不同 combIndex 对应的 CombSelectInfo
    handleClick: (item: any) => void; // 购物车点击函数
    kindName: string;
    kindColor: string;
    clearCartSignal: boolean; // 用于清空购物车时重置状态
    backgroundColor?: string;  // 允许外部传递 backgroundColor
    combIndex: string;
    combID: string;
}

const MyCardWithScroll = ({
                              groupItems,
                              groupedDataSelectInfo,
                              handleClick,
                              kindName,
                              kindColor,
                              clearCartSignal,
                              backgroundColor,
                              combIndex,
                              combID,
                          }: MyCardWithScrollProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectNumber, setSelectNumber] = useState(0); // 记录当前 combIndex 的选择数量
    const [openAlert, setOpenAlert] = useState(false); // 控制 Alert 的显示
    const [alertMessage, setAlertMessage] = useState(''); // 控制 Alert 显示的内容
    const { cartItems, setCartItems, drawerOpen, setDrawerOpen, setOrderDrawerOpen, dataDrawerOpen } = useCartContext();

    const handleScroll = (direction: 'left' | 'right') => {
        setCurrentIndex((prevIndex) => {
            const newIndex = direction === 'left' ? prevIndex - 1 : prevIndex + 1;
            if (newIndex < 0) return 0; // 防止超出左边界
            if (newIndex >= groupItems.length) return groupItems.length - 1; // 防止超出右边界
            return newIndex;
        });
    };

    // 获取对应 combIndex 的最大选择限制
    const getIsComboMaxLimitById = (id: string): CombSelectInfo => {
        return groupedDataSelectInfo[id]; // 获取对应的 CombSelectInfo
    };

    // 包装 handleClick 方法
    const handleCardClick = (item: ProductItem) => {
        const maxLimit = getIsComboMaxLimitById(combIndex).maxLimit;

        // 如果已经达到最大限制，禁止选择并显示 Alert
        if (selectNumber >= maxLimit) {
            setAlertMessage('已经达到了最大选择数量');
            setOpenAlert(true);
            return; // 阻止继续点击
        }

        // 否则，更新选择数量并执行原来的 handleClick 函数
        setSelectNumber(prevNumber => prevNumber + 1);
        item.combName = kindName
        item.kind = kindName
        handleClick(item); // 执行原始的 handleClick
    };

    // 取消选择的函数
// 取消选择的函数
    const handleCancel = (item: ProductItem, combId: string) => {
        // 更新选择数量
        if (selectNumber > 0) {
            setSelectNumber(prevNumber => prevNumber - 1);
        }
        // 如果商品id相同&&combId即套餐类型id也相同则可以判断其是相同的在购物车的物品
        // 查找购物车中是否存在该商品
        const existingItem = cartItems.find((cartItem: CartItem) => cartItem.id === item.id && cartItem.combID === combId);
        console.log("ready to cancel ==>", item, "existingItem==>",existingItem)
        if (!existingItem) return; // 如果商品不存在，直接返回

        if (existingItem.quantity > 1) {
            // 商品数量大于 1，则减少数量
            setCartItems((prevCart) =>
                prevCart.map((cartItem: CartItem) =>
                    cartItem.id === item.id && cartItem.combID === combId
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                )
            );
            // setAlertMessage(`减少 ${item.name} 数量`);
            console.log(`减少 ${item.name} 数量`)
        } else {
            // 商品数量为 1，直接移除
            setCartItems((prevCart) => prevCart.filter((cartItem: CartItem) => !(cartItem.id === item.id && cartItem.combID === combId)));
            // setAlertMessage(`${item.name} 已从购物车移除`);
            console.log(`${item.name} 已从购物车移除`);
        }
    };

    // 判断是否达到最大选择限制
    const isMaxLimitReached = selectNumber >= getIsComboMaxLimitById(combIndex).maxLimit;
// 判断商品是否已经被选中
    const isItemSelected = (item: ProductItem, combId: string) => {
        return cartItems.some(cartItem => cartItem.id === item.id && cartItem.combID === combId);
    };

    return (
        <Box sx={{ position: 'relative', overflowX: 'hidden', display: 'flex', alignItems: 'center', padding: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    transition: 'transform 0.3s ease', // 滚动动画
                    transform: `translateX(-${currentIndex * 220}px)`, // 每次滚动一个 MyCard 的宽度 (200px) + 间隙(10px)
                }}
            >
                {groupItems.map((item, index) => {
                    const isCenter = index === currentIndex;
                    return (
                        <Box
                            key={item.id}
                            sx={{
                                position: 'relative',
                                flex: '0 0 auto', // 防止被压缩
                                width: '200px',  // MyCard 的宽度
                                margin: '0 10px', // 间隙
                                opacity: isCenter ? 1 : 0.3, // 非中心项透明
                                zIndex: isCenter ? 1 : 0, // 非中心项底层
                                pointerEvents: isCenter && !isMaxLimitReached ? 'auto' : 'none', // 非中心项禁止点击
                                transition: 'opacity 0.3s ease, transform 0.3s ease', // 渐变效果
                            }}
                        >
                            <MyCard
                                item={item}
                                handleClick={handleCardClick}  // 使用包装后的 handleClick
                                kindName={kindName}
                                combID={combID}
                                kindColor={kindColor}
                                clearCartSignal={clearCartSignal}
                                backgroundColor={backgroundColor}
                                combIndex={combIndex}
                            />
                            {/* 添加遮罩层，当达到最大选择时 */}
                            {!isCenter && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0)', // 遮罩层
                                        zIndex: 2,
                                    }}
                                />
                            )}
                            {/* 放弃当前的选择*/}
                            {isItemSelected(item, combID) && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0)', // 半透明遮罩层
                                        backdropFilter: 'blur(1px)', // 模糊背景
                                        zIndex: 2,
                                        pointerEvents: 'auto', // 让遮罩层拦截点击事件
                                    }}
                                    onClick={(e) => e.stopPropagation()} // 阻止点击事件传递到背后的元素
                                >
                                    {/* 红色替换按钮 */}
                                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleCancel(item, combID)} // 传入 item 以便获取商品信息
                                            sx={{ zIndex: 4, pointerEvents: 'auto' }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: '#ffcc00', // 亮黄色，突出不可选状态
                                                    fontWeight: 'bold',
                                                    fontSize: '16px',
                                                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)' // 增加阴影让文字更清晰
                                                }}
                                            >
                                                ❌
                                            </Typography>
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                            {/*其他的未选择的商品*/}
                            {isMaxLimitReached && !isItemSelected(item, combID) &&  (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0)', // 半透明遮罩
                                        backdropFilter: 'blur(1px)', // 让背景模糊化
                                        zIndex: 2,
                                        pointerEvents: 'none', // 禁止点击
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: 'blue',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: '#ffcc00', // 亮黄色，突出不可选状态
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)' // 增加阴影让文字更清晰
                                        }}
                                    >
                                        🔒
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* 左右滚动按钮 */}
            <Box sx={{ position: 'absolute', top: '10%', left: 5, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ color: 'red', marginBottom: 1 }}>
                    {`${selectNumber}/${getIsComboMaxLimitById(combIndex).maxLimit}`} {/* 显示当前索引与总数 */}
                </Typography>
            </Box>
            <Box sx={{ position: 'absolute', top: '50%', left: 0, zIndex: 10 }}>
                <IconButton onClick={() => handleScroll('right')}
                            sx={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'white' }}
                            disabled={currentIndex === groupItems.length - 1} // 右边没有更多物品时禁用
                >
                    <ArrowBackIcon />
                </IconButton>
            </Box>
            <Box sx={{ position: 'absolute', top: '50%', right: 0, zIndex: 10 }}>
                <IconButton onClick={() => handleScroll('left')}
                            sx={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'white' }}
                            disabled={currentIndex === 0} // 左边没有更多物品时禁用
                >
                    <ArrowForwardIcon />
                </IconButton>
            </Box>

            {/* Snackbar Alert 提示 */}
            <Snackbar
                open={openAlert}
                autoHideDuration={3000}
                onClose={() => setOpenAlert(false)}
            >
                <Alert severity="error" onClose={() => setOpenAlert(false)}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MyCardWithScroll;