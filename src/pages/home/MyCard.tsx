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
import {Badge, Fade, Modal} from '@mui/material';
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
    const [expanded2, setExpanded2] = React.useState(false);
    const [cartCount, setCartCount] = React.useState(0); // 管理当前商品在购物车的数量
    // 从 localStorage 获取当前的 uniqueId，如果不存在则初始化为 1
    let uniqueId = parseInt(localStorage.getItem("uniqueId") || "1", 10);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleExpandClick2 = () => {
        setExpanded2(!expanded2);
    };

    const handleClose = () => setExpanded2(false);
    const [selectedProps, setSelectedProps] = React.useState<string>(''); // 保存当前选中的 JSON 数据
    const [propMap, setPropMap] = React.useState<Record<string, string>>(() => {
        // 初始化映射为本地存储中的值，或空对象
        const storedMap = localStorage.getItem('propMap');
        return storedMap ? JSON.parse(storedMap) : {};
    });

    const [selectedNames, setSelectedNames] = React.useState<string>(() => {
        // 初始化拼接字符串为本地存储中的值，或空字符串
        return localStorage.getItem('selectedNames') || '';
    });

    const handlePropsChange = (options: string) => {
        console.log('Received options:', options);
        setSelectedProps(options); // 更新选中的配置项（原始 JSON）

        try {
            // 解析传递进来的 JSON 数据
            const { propId, name } = JSON.parse(options);

            // 更新映射和拼接字符串
            setPropMap((prevMap) => {
                const updatedMap = { ...prevMap, [propId]: name }; // 更新 propId -> name 映射
                const names = Object.values(updatedMap).join(', '); // 拼接所有 name

                // 将最新结果存储到本地
                localStorage.setItem('propMap', JSON.stringify(updatedMap));
                localStorage.setItem('selectedNames', names);

                setSelectedNames(names); // 更新拼接后的字符串
                return updatedMap;
            });
        } catch (error) {
            console.error('Failed to parse options:', error);
        }
        // 延迟读取本地存储
        setTimeout(() => {
            const allChoose = localStorage.getItem('selectedNames');
            console.log('all you have chosen (delayed):', allChoose);
        }, 0); // 延迟 0 毫秒，确保同步完成
    };

    const handleAddToCart = () => {
        setCartCount(cartCount + 1); // 每次点击增加数量
        const cartItem = {
            ...item,
            selectedProps, // 将用户选择的配置加入购物车
        };
        item.desc = selectedNames;
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
        <>
        <Card
            sx={{
                maxWidth: 445,
                margin: 1,
                position: 'relative', // 设置 Card 为相对定位
                cursor: showProductImage ? 'default' : 'pointer', // 设置鼠标样式
            }}
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
                            fontSize: showProductImage ? '1rem' : '1.2rem',
                            fontWeight: showProductImage ? 'normal' : 'bold',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: '1.5rem',
                            height: '3rem', // 确保布局一致
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

                onClick={!showProductImage ? () => handleAddToCart() : undefined} // 整个卡片可点击

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

            <CardActions
                disableSpacing
                sx={{
                    height: item.spiceOptions?.length > 0 ? 'auto' : 53, // 固定高度，确保没有内容时占位
                }}
            >
                {item.spiceOptions?.length > 0 && (
                    <ExpandMore
                        expand={expanded2}
                        onClick={handleExpandClick2}
                        aria-expanded={expanded2}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                )}
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <PropsChoose uniqueId={uniqueId + 1}
                                 productID={item.id}
                                 items={item.spiceOptions}
                                 onSelectionChange={handlePropsChange} // 配置变更回调
                        onAddToCart={handleAddToCart}
                    />
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

    <Modal
        open={expanded2}
        onClose={handleClose}
        closeAfterTransition
    >
        <Fade in={expanded2}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600, // 设置宽度
                    bgcolor: 'background.paper',
                    boxShadow: 18,
                    p: 2,
                    borderRadius: 2,
                }}
            >
                <PropsChoose
                    uniqueId={uniqueId + 1}
                    productID={item.id}
                    items={item.spiceOptions}
                    onSelectionChange={handlePropsChange}
                    onAddToCart={handleAddToCart}
                />
            </Box>
        </Fade>
    </Modal>
    </>
    );
};

export default MyCard;