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
}

export default function PropToggleButton(props: Props) {
    const { uniqueId, propId, productId, items, reset } = props;
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    const handleChange = (id: string) => {
        const selectedOption = items.find((item) => item.id === id);
        const newName = selectedOption?.name || '';
        const fullPropsKey = `selectedSpiceLevel:${uniqueId}:${productId}:${propId}`;
        const storedValue = JSON.stringify({ id, name: newName });
        localStorage.setItem(fullPropsKey, storedValue);
        setSelectedId(id);
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
                        border: `2px solid ${
                            selectedId === option.id ? 'orange' : '#E0E0E0'
                        }`,
                        borderRadius: '5px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backgroundColor: selectedId === option.id ? '#FFF2E6' : '#F5F5F5',
                        boxShadow: selectedId === option.id ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.3s ease',
                        ':hover': {
                            backgroundColor: selectedId === option.id ? '#FFE6D6' : '#F0F0F0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                    }}
                >
                    {/* 属性名称 */}
                    <Typography
                        sx={{
                            fontSize: '0.875rem',
                            fontWeight: selectedId === option.id ? 'bold' : 'normal',
                            textAlign: 'center',
                            whiteSpace: 'nowrap', // 防止文字换行
                        }}
                    >
                        {option.name}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}