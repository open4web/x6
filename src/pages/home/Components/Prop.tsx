import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SpiceOptions } from "./Type";

interface Props {
    uniqueId: number;
    propId: string;
    productId: string;
    items: SpiceOptions[];
    reset: boolean; // 新增重置信号
    // options: string[]; // 按钮选项列表
    onSelectionChange: (selected: string) => void; // 回调函数，返回选中的值列表
}

export default function PropToggleButton(props: Props) {
    const { uniqueId, propId, productId, items, reset , onSelectionChange} = props;
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    const handleChange = (id: string) => {
        const selectedOption = items.find((item) => item.id === id);
        const newName = selectedOption?.name || '';
        const storedValue = JSON.stringify({
            productId: productId,
            propId: propId,
            id: id,
            name: newName
        });
        // localStorage.setItem(fullPropsKey, storedValue);
        setSelectedId(id);

        onSelectionChange(storedValue);
    };

    // 监听重置信号，重置选中状态
    React.useEffect(() => {
        setSelectedId(null); // 清空选中状态
    }, [reset]);


    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap', // 自动换行
                gap: 1, // 每个方块的间距
                justifyContent: 'space-evenly', // 左对齐
                width: '100%',
            }}
        >
            {items?.map((option) => (
                <Box
                    key={option.id}
                    onClick={() => handleChange(option.id)}
                    sx={{
                        width: '100px', // 固定宽度
                        height: '80px', // 固定高度
                        border: `3px solid ${
                            selectedId === option.id ? '#4CAF50' : '#E0E0E0' // 使用绿色边框表示选中状态
                        }`,
                        borderRadius: '12px', // 圆角更柔和
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: selectedId === option.id
                            ? 'linear-gradient(145deg, #A5D6A7, #C8E6C9)' // 柔和的绿色渐变背景
                            : '#F9F9F9', // 默认背景
                        boxShadow: selectedId === option.id
                            ? '0 6px 12px rgba(76, 175, 80, 0.4)' // 柔和绿色阴影
                            : 'none',
                        transform: selectedId === option.id ? 'scale(1.08)' : 'none', // 选中时放大更显著
                        transition: 'all 0.3s ease',
                        ':hover': {
                            backgroundColor: selectedId === option.id ? '#C8E6C9' : '#F0F0F0',
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // 悬停时轻微阴影
                            transform: 'scale(1.05)', // 悬停时轻微放大
                        },
                    }}
                >
                    {/* 属性名称 */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* 属性名称 */}
                        <Typography
                            sx={{
                                fontSize: '1.1rem', // 字体略大
                                fontWeight: selectedId === option.id ? 'bold' : 'normal',
                                textAlign: 'center',
                                color: selectedId === option.id ? '#1B5E20' : '#333', // 更深绿色的选中文字颜色
                                whiteSpace: 'nowrap', // 防止文字换行
                            }}
                        >
                            {option.name}
                        </Typography>

                        {/* 属性价格 */}
                        {option.price > 0 && (
                            <Typography
                                sx={{
                                    fontSize: '0.9rem', // 较小字体
                                    fontWeight: 'bold', // 加粗
                                    color: '#D32F2F', // 红色文字
                                    textAlign: 'center',
                                    marginTop: '4px', // 与名称的间距
                                }}
                            >
                                ¥{option.price}
                            </Typography>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}