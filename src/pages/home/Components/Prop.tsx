import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SpiceOptions } from "./Type";

interface Props {
    uniqueId: number;
    propId: string;
    productId: string;
    items: SpiceOptions[];
    reset: boolean; // 重置信号
    supportMultiProps: boolean; // 是否支持多选，默认单选
    onSelectionChange: (selected: string | string[], supportMultiProps: boolean) => void; // 回调函数
}

export default function PropToggleButton(props: Props) {
    const { uniqueId, propId, productId, items, reset, supportMultiProps, onSelectionChange } = props;
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]); // 支持多选时的状态

    const handleChange = (id: string) => {
        let newSelectedIds: string[];

        if (supportMultiProps) {
            // 多选逻辑
            if (selectedIds.includes(id)) {
                // 如果已选中，则取消选中
                newSelectedIds = selectedIds.filter((selectedId) => selectedId !== id);
            } else {
                // 如果未选中，则添加选中
                newSelectedIds = [...selectedIds, id];
            }
        } else {
            // 单选逻辑
            newSelectedIds = [id];
        }

        setSelectedIds(newSelectedIds);

        // 构造选中项的详细信息
        const selectedOptions = newSelectedIds.map((selectedId) => {
            const selectedOption = items.find((item) => item.id === selectedId);
            return {
                productId,
                propId,
                id: selectedId,
                name: selectedOption?.name || "",
            };
        });

        // 回调选中项（单选返回字符串，多选返回数组）
        onSelectionChange(supportMultiProps ? JSON.stringify(selectedOptions) : JSON.stringify(selectedOptions[0]), false);
    };

    // 监听重置信号，重置选中状态
    React.useEffect(() => {
        setSelectedIds([]); // 清空选中状态
    }, [reset]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'space-evenly',
                width: '100%',
            }}
        >
            {items?.map((option) => (
                <Box
                    key={option.id}
                    onClick={() => handleChange(option.id)}
                    sx={{
                        width: '100px',
                        height: '80px',
                        border: `3px solid ${
                            selectedIds.includes(option.id) ? '#4CAF50' : '#E0E0E0'
                        }`,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: selectedIds.includes(option.id)
                            ? 'linear-gradient(145deg, #A5D6A7, #C8E6C9)'
                            : '#F9F9F9',
                        boxShadow: selectedIds.includes(option.id)
                            ? '0 6px 12px rgba(76, 175, 80, 0.4)'
                            : 'none',
                        transform: selectedIds.includes(option.id) ? 'scale(1.08)' : 'none',
                        transition: 'all 0.3s ease',
                        ':hover': {
                            backgroundColor: selectedIds.includes(option.id) ? '#C8E6C9' : '#F0F0F0',
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                            transform: 'scale(1.05)',
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
                        <Typography
                            sx={{
                                fontSize: '1.1rem',
                                fontWeight: selectedIds.includes(option.id) ? 'bold' : 'normal',
                                textAlign: 'center',
                                color: selectedIds.includes(option.id) ? '#1B5E20' : '#333',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {option.name}
                        </Typography>

                        {/* 属性价格 */}
                        {option.price > 0 && (
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    color: '#D32F2F',
                                    textAlign: 'center',
                                    marginTop: '4px',
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