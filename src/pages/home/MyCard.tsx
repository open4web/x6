import * as React from 'react';
import {useEffect} from 'react';
import PropsChoose from "./Components/PropsChoose";
import Box from "@mui/material/Box";
import {ProductItem} from "./Components/Type";
import {Fade, Modal} from '@mui/material';
import {useCartContext} from "../../dataProvider/MyCartProvider";
import {useTranslate} from 'react-admin';
import {ProductCardFace} from "./Components/ProductCardLayouts";
import {useProductCardStyle} from "../../layout/productCardStyle";

interface Props {
    item: ProductItem;
    handleClick: (item: any) => void;
    kindName: string;
    kindColor: string;
    clearCartSignal: boolean; // 用于清空购物车时重置状态
    backgroundColor?: string;  // 允许外部传递 backgroundColor
    combIndex: string;
    combID: string; // 套餐专属的id（其实就是kindId）
    combPrice: number;
    combRequestItems: { id: string; quantity: number }[];
}

const MyCard = (props: Props) => {
    const translate = useTranslate();
    const {cartItems, showProductImage} = useCartContext();
    const [cardStyle] = useProductCardStyle();
    const {item, handleClick, kindName, kindColor, clearCartSignal, backgroundColor, combID} = props;
    // const [expanded, setExpanded] = React.useState(false);
    const [expanded2, setExpanded2] = React.useState(false);


    const [selectedNames, setSelectedNames] = React.useState<string>(() => {
        // 初始化拼接字符串为本地存储中的值，或空字符串
        return localStorage.getItem('selectedNames') || '';
    });

    const getItemCountInCart = () => {
        return cartItems.reduce((count, cartItem) => {
            return cartItem.id === item.id && cartItem.desc === selectedNames
                ? count + (cartItem.quantity || 1)
                : count;
        }, 0);
    };

    const [cartCount, setCartCount] = React.useState(getItemCountInCart());
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

        // 将类型名称赋值
        item.kindName = kindName
        item.combID = combID
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
        } else {
            item.desc = selectedNames;
            // 当前的item属性被使用后就删除本地缓存
        }
        // Perform the "Add to Cart" action
        handleClick(item);
        // Close the Collapse and restore CardContent
        // setExpanded(false);
    };

    // 当清空购物车信号变化时重置角标数量
    // 当购物车内容变化时，更新 cartCount
    useEffect(() => {
        setCartCount(getItemCountInCart());
    }, [cartItems,clearCartSignal]);

    const soldOut = item.stock === 0;
    const stockLabel = soldOut
        ? translate('pos.product.sold_out')
        : translate('pos.product.remaining', {stock: item.stock});

    return (
        <>
            <ProductCardFace
                styleName={cardStyle}
                item={item}
                kindName={kindName}
                kindColor={kindColor}
                backgroundColor={backgroundColor}
                showProductImage={showProductImage}
                cartCount={showProductImage ? 0 : cartCount}
                stockLabel={stockLabel}
                soldOut={soldOut}
                onAdd={() => handleAddToCart(true)}
                onExpand={handleExpandClick2}
                expanded={expanded2}
            />

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
                aggregatedMap.set(item.propId, {...item}); // 深拷贝以避免修改原数据
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