import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MyCard from "../MyCard";
import {ProductItem} from "./Type"; // 引入你的 ProductItem 类型定义

interface MyCardWithScrollProps {
    groupItems: ProductItem[]; // 直接使用传递的 groupItems 参数
    handleClick: (item: any) => void;
    kindName: string;
    kindColor: string;
    clearCartSignal: boolean; // 用于清空购物车时重置状态
    backgroundColor?: string;  // 允许外部传递 backgroundColor
    combIndex: string;
}

const MyCardWithScroll = ({
                              groupItems,
                              handleClick,
                              kindName,
                              kindColor,
                              clearCartSignal,
                              backgroundColor,
                              combIndex,
                          }: MyCardWithScrollProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (direction: 'left' | 'right') => {
        setCurrentIndex((prevIndex) => {
            const newIndex = direction === 'left' ? prevIndex - 1 : prevIndex + 1;
            if (newIndex < 0) return 0; // 防止超出左边界
            if (newIndex >= groupItems.length) return groupItems.length - 1; // 防止超出右边界
            return newIndex;
        });
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
                                pointerEvents: isCenter ? 'auto' : 'none', // 非中心项禁止点击
                                transition: 'opacity 0.3s ease, transform 0.3s ease', // 渐变效果
                            }}
                        >
                            <MyCard
                                item={item}
                                handleClick={handleClick}
                                kindName={kindName}
                                kindColor={kindColor}
                                clearCartSignal={clearCartSignal}
                                backgroundColor={backgroundColor}
                                combIndex={combIndex}
                            />
                            {!isCenter && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.3)', // 遮罩层
                                        zIndex: 2,
                                    }}
                                />
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* 左右滚动按钮 */}
            <Box sx={{ position: 'absolute', top: '50%', left: 0, zIndex: 10 }}>
                <IconButton onClick={() => handleScroll('right')} sx={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'white' }}>
                    <ArrowBackIcon />
                </IconButton>
            </Box>
            <Box sx={{ position: 'absolute', top: '50%', right: 0, zIndex: 10 }}>
                <IconButton onClick={() => handleScroll('left')} sx={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'white' }}>
                    <ArrowForwardIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default MyCardWithScroll;