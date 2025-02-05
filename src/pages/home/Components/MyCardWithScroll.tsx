import React, { useState } from 'react';
import { Box, Card, CardHeader, CardMedia, CardContent, Button } from '@mui/material';
import { ProductItem } from './Type';
import MyCard from "../MyCard"; // 引入你的 ProductItem 类型定义

interface MyCardWithScrollProps {
    groupItems: ProductItem[]; // 直接使用传递的 groupItems 参数
    handleClick: (item: any) => void;
    kindName: string;
    kindColor: string;
    clearCartSignal: boolean; // 用于清空购物车时重置状态
    backgroundColor?: string;  // 允许外部传递 backgroundColor
    combIndex: string;
}

const MyCardWithScroll = ({ groupItems, handleClick, kindName, kindColor, clearCartSignal, backgroundColor, combIndex }: MyCardWithScrollProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (direction: 'left' | 'right') => {
        setCurrentIndex((prevIndex) => {
            const newIndex = direction === 'left' ? prevIndex - 1 : prevIndex + 1;
            if (newIndex < 0) return 0;
            if (newIndex >= groupItems.length) return groupItems.length - 1;
            return newIndex;
        });
    };

    return (
        <Box sx={{ position: 'relative', overflowX: 'auto', display: 'flex', alignItems: 'center', padding: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    transition: 'transform 0.3s ease', // 滚动动画
                    transform: `translateX(-${currentIndex * 100}%)`,
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
                                width: '200px',
                                margin: '0 10px',
                                opacity: isCenter ? 1 : 0.3, // 非中心项透明
                                zIndex: isCenter ? 1 : 0, // 非中心项底层
                                pointerEvents: isCenter ? 'auto' : 'none', // 非中心项禁止点击
                                transition: 'opacity 0.3s ease, transform 0.3s ease', // 渐变效果
                            }}
                        >
                            <MyCard
                                item={item}
                                handleClick={handleClick}
                                kindName={kindColor}
                                kindColor={kindColor}
                                clearCartSignal={clearCartSignal}
                                backgroundColor={ backgroundColor}
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

            <Box sx={{ position: 'absolute', top: '50%', left: 0, zIndex: 10 }}>
                <button onClick={() => handleScroll('left')}>Left</button>
            </Box>
            <Box sx={{ position: 'absolute', top: '50%', right: 0, zIndex: 10 }}>
                <button onClick={() => handleScroll('right')}>Right</button>
            </Box>
        </Box>
    );
};

export default MyCardWithScroll;