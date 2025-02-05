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
    backgroundColor?: string;  // 允许外部传递 backgroundColor
    combIndex: string;
}

const MyCard = (props: Props) => {
    const {  setShowProductImage, showProductImage } = useCartContext();
    const {item, handleClick, kindName, kindColor, clearCartSignal, backgroundColor, combIndex} = props;
    // const [expanded, setExpanded] = React.useState(false);
    const [expanded2, setExpanded2] = React.useState(false);
    const [cartCount, setCartCount] = React.useState(0); // 管理当前商品在购物车的数量
    const [resetTrigger, setResetTrigger] = React.useState(false);
    // 从 localStorage 获取当前的 uniqueId，如果不存在则初始化为 1
    let uniqueId = parseInt(localStorage.getItem("uniqueId") || "1", 10);

    const handleExpandClick2 = () => {
        setExpanded2(!expanded2);
    };

    const handleClose = () => {
        console.log("Collapse 关闭！");
        setExpanded2(false);
        localStorage.removeItem('propMap')
        localStorage.removeItem('selectedNames');
        setPropMap({})
    };

    const [propMap, setPropMap] = React.useState<Record<string, string>>(() => {
        // 初始化映射为本地存储中的值，或空对象
        const storedMap = localStorage.getItem('propMap');
        return storedMap ? JSON.parse(storedMap) : {};
    });

    const [selectedNames, setSelectedNames] = React.useState<string>(() => {
        // 初始化拼接字符串为本地存储中的值，或空字符串
        return localStorage.getItem('selectedNames') || '';
    });

    const handlePropsChange = (options: string, supportMultiProps: boolean) => {
        const optionsString = aggregateData(options);
        try {
            // 解析单个 JSON 数据
                const parsedOption = JSON.parse(optionsString);
                const {propId, name} = parsedOption;
                // 更新映射和拼接字符串
                setPropMap((prevMap) => {
                    const updatedMap = {...prevMap};
                        // 如果不支持多选模式，直接覆盖值
                        updatedMap[propId] = name;
                    const names = Object.values(updatedMap).join(','); // 拼接所有 name

                    // 将最新结果存储到本地
                    localStorage.setItem('propMap', JSON.stringify(updatedMap));
                    localStorage.setItem('selectedNames', names);

                    setSelectedNames(names); // 更新拼接后的字符串
                    return updatedMap;
                });
        } catch (error) {
            console.error('Failed to parse option:', error);
        }

        // 延迟读取本地存储
        // setTimeout(() => {
        //     const allChoose = localStorage.getItem('selectedNames');
        //     console.log('All you have chosen (delayed):', allChoose);
        //     // setResetTrigger(true)
        // }, 0); // 延迟 0 毫秒，确保同步完成
    };

    const handleAddToCart = (withoutProp: boolean) => {
        setCartCount(cartCount + 1); // 每次点击增加数量
        // 当属性被提交后重置属性
        localStorage.removeItem('propMap')
        localStorage.removeItem('selectedNames');
        setPropMap({})
        // 如果是直接快速添加则不会勾选属性
        if (withoutProp) {
            // 强制置为空
            item.desc = ""
            handleClick(item)
            return
        }
        if (resetTrigger) {
            item.desc = "";
        }else{
            item.desc = selectedNames;
            // 当前的item属性被使用后就删除本地缓存
        }
        // Perform the "Add to Cart" action
        handleClick(item);
        // Close the Collapse and restore CardContent
        // setExpanded(false);
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
                backgroundColor: backgroundColor || 'inherit', // 默认背景色为浅灰色
            }}
        > {/* 销售状态标签 */}
            {item.stock === 0 ? (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        backgroundColor: '#d32f2f', // 已售罄颜色
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 1,
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        zIndex: 1,
                    }}
                >
                    已售罄
                </Box>
            ) : (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        backgroundColor: '#fbc02d', // 剩余数量颜色
                        color: 'black',
                        padding: '2px 8px',
                        borderRadius: 1,
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        zIndex: 1,
                    }}
                >
                    剩余 {item.stock}
                </Box>
            )}
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

                onClick={!showProductImage ? () => handleAddToCart(true) : undefined} // 整个卡片可点击

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
                    onAddToCart={() => handleAddToCart(false)} // 正确：点击时调用函数并传递参数
                    resetTrigger={resetTrigger}
                    setResetTrigger={setResetTrigger}
                    setExpanded={setExpanded2}
                />
            </Box>
        </Fade>
    </Modal>
    </>
    );
};

export default MyCard;


// 聚合函数
function aggregateData(jsonString: string): string {
    try {
        // 将 JSON 字符串解析为对象数组
        const data: DataItem[] = JSON.parse(jsonString);

        if (!Array.isArray(data)) {
            // 如果不是数组不需要聚合，直接返回
            return jsonString
        }

        // 使用 Map 聚合数据
        const aggregatedMap = new Map<string, DataItem>();

        for (const item of data) {
            if (aggregatedMap.has(item.propId)) {
                const existingItem = aggregatedMap.get(item.propId)!;
                existingItem.name = `${existingItem.name},${item.name}`; // 合并名称
            } else {
                aggregatedMap.set(item.propId, { ...item }); // 深拷贝以避免修改原数据
            }
        }

        // 提取聚合后的第一条记录并转为字符串
        const aggregatedArray = Array.from(aggregatedMap.values());
        const result = aggregatedArray[0]; // 假设只返回一条数据
        return JSON.stringify(result);
    } catch (error) {
        console.error("Error aggregating data:", error);
        return "{}";
    }
}


// 定义数据类型
interface DataItem {
    productId: string;
    propId: string;
    id: string;
    name: string;
}