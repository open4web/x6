import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropToggleButton from "./Prop";
import { PropsOptions } from "./Type";

interface Props {
    uniqueId: number;
    productID: string;
    items: PropsOptions[];
    onSelectionChange: (selected: string) => void; // 回调函数，返回选中的值列表
    onAddToCart: () => void; // 添加到购物车的回调
}

export default function PropsChoose(props: Props) {
    const { uniqueId, productID, items, onSelectionChange, onAddToCart } = props;
    const [resetTrigger, setResetTrigger] = React.useState(false);
    const resetSelections = () => {
        // 清除本地存储中当前商品相关的属性选择
        items.forEach(option => {
            const fullPropsKey = `selectedSpiceLevel:${uniqueId}:${productID}:${option.id}`;
            localStorage.removeItem(fullPropsKey);
        });

        // 通知子组件和父组件重置
        setResetTrigger(prev => !prev); // 切换状态触发重置
        onSelectionChange('');
    };

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(); // 调用父组件传递的回调
        }
    };


    return (
        <Box
            sx={{
                width: '100%',
                padding: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start', // 其他内容靠左对齐
                gap: 0, // 控制上下间距
            }}
            role="presentation"
        >
            <List
                sx={{
                    width: '100%',
                    maxWidth: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1, // 属性组间距
                }}
            >
                {items?.map(option => (
                    <Box
                        key={option.id}
                        sx={{
                            marginBottom: 2, // 每个属性组之间的间距
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                marginBottom: 1, // 属性名称与按钮组的间距
                                color: "white"
                            }}
                        >
                            {option.name} {/* 属性名称，例如：糖分 */}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap', // 支持自动换行
                                gap: 1, // 按钮之间的间距
                                justifyContent: 'center', // 左对齐按钮
                            }}
                        >
                            <PropToggleButton
                                uniqueId={uniqueId}
                                propId={option.id}
                                productId={productID}
                                items={option.spiceOptions}
                                reset={resetTrigger}
                                onSelectionChange={onSelectionChange}
                            />
                        </Box>
                    </Box>
                ))}
            </List>

            {/* 操作按钮 */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center', // 居中对齐按钮
                    width: '100%',
                    marginTop: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        width: '100%',
                        maxWidth: '400px',
                        justifyContent: 'center', // 内部按钮继续居中
                    }}
                >
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={resetSelections}
                        sx={{
                            flex: 1,
                            maxWidth: '150px', // 限制按钮宽度
                        }}
                    >
                        重置
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleAddToCart}
                        sx={{
                            flex: 1,
                            maxWidth: '150px', // 限制按钮宽度
                        }}
                    >
                        添加购物车
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}