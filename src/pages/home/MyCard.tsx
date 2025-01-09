import * as React from 'react';
import {useEffect} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PropsChoose from "./Components/PropsChoose";
import Box from "@mui/material/Box";
import {ProductItem} from "./Components/Type";
import {Badge} from '@mui/material';
import {useCartContext} from "../../dataProvider/MyCartProvider";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

interface Props {
    item: ProductItem;
    handleClick: (item: any) => void;
    kindName: string;
    kindColor: string;
    clearCartSignal: boolean; // 用于清空购物车时重置状态
}

const MyCard = (props: Props) => {
    const {  setShowProductImage, showProductImage } = useCartContext();
    const {item, handleClick, kindName, kindColor, clearCartSignal} = props;
    const [expanded, setExpanded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [cartCount, setCartCount] = React.useState(0); // 管理当前商品在购物车的数量

    // 从 localStorage 获取当前的 uniqueId，如果不存在则初始化为 1
    let uniqueId = parseInt(localStorage.getItem("uniqueId") || "1", 10);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleAddToCart = () => {
        setCartCount(cartCount + 1); // 每次点击增加数量

        // 从 localStorage 获取当前的 uniqueId，如果不存在则初始化为 1
        let uniqueId = parseInt(localStorage.getItem("uniqueId") || "1", 10);

        // 检查当前订单是否有勾选配置，如果有则将配置嵌入item中
        //
        // item?.spiceOptions?.map((j) => {
        //     const fullPropsKey = `selectedSpiceLevel:${uniqueId+1}:${item.id}:${j}`;
        //     const storedValue = localStorage.getItem(fullPropsKey);
        //     // 解析存储的数据
        //     let cachedData: { id: string; name: string } | null = null;
        //     if (storedValue) {
        //         try {
        //             // 解析存储的数据
        //             const cachedData: MyProductProps = JSON.parse(storedValue);
        //
        //             // 确保数据未重复添加后再插入
        //             if (!item.spiceOptions.some((o) => o.id === cachedData.id)) {
        //                 item.spiceOptions.push(cachedData);
        //             }
        //         } catch (error) {
        //             console.error('Error parsing cached data:', error);
        //         }
        //     }
        // })


        // Perform the "Add to Cart" action
        handleClick(item);
        // Close the Collapse and restore CardContent
        setExpanded(false);
    };

    // 当清空购物车信号变化时重置角标数量
    useEffect(() => {
        if (clearCartSignal) {
            setCartCount(0);
        }
    }, [clearCartSignal]);

    // @ts-ignore
    return (
        <Card
            sx={{
                maxWidth: 445,
                margin: 1,
                position: 'relative', // 设置 Card 为相对定位
                cursor: showProductImage ? 'default' : 'pointer', // 设置鼠标样式
            }}
            onClick={!showProductImage ? () => handleAddToCart() : undefined} // 整个卡片可点击
        >
            <CardHeader
                avatar=
                    {
                        showProductImage ? (
                        <Avatar sx={{bgcolor: kindColor}} aria-label="recipe">
                            {kindName}
                        </Avatar> )
                            :
                            (<Avatar sx={{bgcolor: kindColor}} aria-label="recipe" src={item.img}/>
                        )
                    }
                title={
                    <Typography
                        sx={{
                            fontSize: showProductImage ? '1rem' : '1.2rem', // 动态调整字体大小
                            fontWeight: showProductImage ? 'normal' : 'bold', // 可选：在放大时增加字体粗细
                        }}
                    >
                        {item?.name}
                    </Typography>
                }
                subheader={
                    <Typography
                        sx={{
                            fontSize: '1.2rem', // 调整价格字体大小
                            fontWeight: 'bold', // 加粗字体
                            color: 'darkorange', // 突出显示的颜色
                        }}
                    >
                        ¥ {item?.price} {/* 添加人民币符号 */}
                    </Typography>
                }
            />
            {!showProductImage && (
                <Badge
                    badgeContent={cartCount}
                    color="error"
                    sx={{
                        position: 'absolute', // 绝对定位
                        top: 13, // 距离顶部
                        right: 13, // 距离右侧
                        '.MuiBadge-badge': {
                            fontSize: '0.8rem',
                            height: 20,
                            minWidth: 20,
                        },
                    }}
                />
            )}

            {showProductImage && (
                <CardMedia
                    component="img"
                    height="194"
                    image={item?.img}
                    alt="暂无图片"
                />
            )}
            {/* Conditional rendering for CardContent */}
            {!expanded && (
                <CardContent>
                    {showProductImage && (
                        <Typography variant="body2" color="text.secondary">
                            {item?.desc}
                        </Typography>
                    )}
                </CardContent>
            )}
            {showProductImage && ( // 仅当 showProductImage 为 true 时显示 AddShoppingCartIcon
                <CardActions disableSpacing>
                    {!expanded && (
                        <Badge
                            badgeContent={cartCount}
                            color="error"
                            sx={{
                                '.MuiBadge-badge': {
                                    fontSize: '0.8rem',
                                    height: 20,
                                    minWidth: 20,
                                },
                            }}
                        >
                            <IconButton
                                aria-label="add to cart"
                                onClick={handleAddToCart}
                                sx={{
                                    color: 'success',
                                    '&:hover': {
                                        color: 'darkorange',
                                    },
                                }}
                            >
                                <AddShoppingCartIcon
                                    sx={{
                                        fontSize: 40,
                                    }}
                                />
                            </IconButton>
                        </Badge>
                    )}
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
            )}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <PropsChoose uniqueId={uniqueId + 1} productID={item.id} items={item.spiceOptions}/>
                    {/* Add "Add to Cart" button to the bottom when expanded */}
                    <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 2}}>
                        <Badge
                            badgeContent={cartCount}
                            color="error"
                            sx={{
                                '.MuiBadge-badge': {
                                    fontSize: '0.8rem',
                                    height: 20,
                                    minWidth: 20,
                                },
                            }}
                        >
                            <IconButton
                                aria-label="add to cart"
                                onClick={handleAddToCart}
                                sx={{
                                    color: 'primary', // 显著的颜色，可以替换为其他颜色
                                    '&:hover': {
                                        color: 'darkorange', // 悬停时的颜色
                                    },
                                }}
                            >
                                <AddShoppingCartIcon
                                    sx={{
                                        fontSize: 40, // 增大图标尺寸，默认是 24
                                    }}
                                />
                            </IconButton>
                        </Badge>
                    </Box>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default MyCard;