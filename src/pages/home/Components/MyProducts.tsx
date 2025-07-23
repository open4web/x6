import React, {useEffect, useState} from 'react';
import {Box, Chip, Grid} from '@mui/material';
import MyCard from "../MyCard";
import {CombSelectInfo, DetailsProps, MenuData, ProductItem} from "./Type";
import {useFetchData} from "../../../common/FetchData";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {GenerateColorFromId} from "../../../utils/randColor";
import MyCardWithScroll from "./MyCardWithScroll";


function MyProducts({handleClick, clearCartSignal}: DetailsProps) {
    const {setShowProductImage, showProductImage, cartItems} = useCartContext();
    const [data, setData] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<MenuData[]>([]);
    const [activeTab, setActiveTab] = useState(localStorage.getItem("current_category") || '');
    const [query, setQuery] = useState("");
    const [categoryMap, setCategoryMap] = useState<Record<string, MenuData>>({});
    const [categoryColorMap, setCategoryColorMap] = useState<Record<string, string>>({});
    const {merchantId} = useCartContext();
    const {fetchData, alertComponent} = useFetchData();

    // 通过 id 获取 isComboMode
    const getIsComboModeById = (id: string): boolean | undefined => {
        const item = categoryMap[id]; // 获取对应的 MenuData 对象
        return item ? item.isComboMode : undefined; // 如果找到返回 isComboMode，否则返回 undefined
    };

    const getCategoryName = (id: string): string => {
        const item = categoryMap[id]; // 获取对应的 MenuData 对象
        return item.name; // 如果找到返回 isComboMode，否则返回 undefined
    };

    const getCombPrice = (id: string): number => {
        const item = categoryMap[id]; // 获取对应的 MenuData 对象
        return item.price; // 如果找到返回 isComboMode，否则返回 undefined
    };

    // getCombRequestItems
    const getCombRequestItems = (id: string): { id: string; quantity: number }[] => {
        const item = categoryMap[id]; // 获取对应的 MenuData 对象
        // return item.products; //
        return [{
            id: "xx",
            quantity: 2,
        }]
    };
    const getCategoryId = (id: string): string => {
        const item = categoryMap[id]; // 获取对应的 MenuData 对象
        return item.id; // 如果找到返回 isComboMode，否则返回 undefined
    };

    useEffect(() => {
        const payload = {
            "merchantId": merchantId,
        }

        // 获取菜谱列表
        fetchData('/v1/pos/menu', (response) => {
            const cm = response || [];
            setCategories(cm);
            // 创建 nameMap, colorMap
            const nameMap = cm.reduce((acc: Record<string, MenuData>, item:  MenuData ) => {
                acc[item.id] = item; // 将整个 item（即 MenuData 对象）赋值给 acc[item.id]
                return acc;
            }, {});
            const colorMap = cm.reduce((acc: Record<string, string>, item: { id: string }) => {
                acc[item.id] = GenerateColorFromId(item.id); // 使用 id 生成颜色
                return acc;
            }, {});
            // 更新状态
            setCategoryMap(nameMap);
            setCategoryColorMap(colorMap);
        }, "POST", payload);


        // 获取商品列表
        fetchData('/v1/pos/products', (response) => {
            const products = response || [];
            setData(products);
        }, "POST", {
            "merchantId": merchantId,
            "menuId": activeTab,
        });
    }, [activeTab, merchantId, cartItems]);

    const handleChipClick = (categoryId: string) => {
        setActiveTab(categoryId);
        localStorage.setItem("current_category", categoryId);
    };

    // 按combIndex分组
    const groupedData = data.reduce((acc, item) => {
        const combIndex = item.combIndex;
        if (!acc[combIndex]) {
            acc[combIndex] = [];
        }
        acc[combIndex].push(item);
        return acc;
    }, {} as { [key: number]: ProductItem[] });

    const groupedDataSelectInfo = data.reduce((acc, item) => {
        const combIndex = item.combIndex;

        // 确保每个combIndex只有第一次赋值时才会创建
        if (!acc[combIndex]) {
            acc[combIndex] = {
                title: '粉类选择',  // 你可以根据需要调整title
                maxLimit: item.maxLimit,  // 确保 item.maxLimit 是存在的，且有适当的值
            };
        }

        return acc;
    }, {} as { [key: string]: CombSelectInfo });

    return (
        <Box>
            {alertComponent}
            <Box sx={{display: 'flex', gap: 1, overflowX: 'auto', mb: 2}}>
                {categories.map(category => (
                    <Chip
                        key={category.id}
                        label={category.name}
                        clickable
                        style={{
                            backgroundColor: categoryColorMap[category.id] || '#e0e0e0',
                            color: '#fff',
                            border: activeTab === category.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                            boxShadow: activeTab === category.id ? '0 0 10px rgba(25, 118, 210, 0.5)' : 'none',
                        }}
                        icon={activeTab === category.id ?
                            <span style={{fontWeight: 'bold', color: '#fff'}}>✔</span> : undefined}
                        onClick={() => handleChipClick(category.id)}
                    />
                ))}
            </Box>

            {/* Product Grid */}
            {Object.keys(groupedData).map((combIndex) => {
                const groupItems = groupedData[parseInt(combIndex, 10)];
                // 使用combIndex计算色相，确保它在0到360之间
                const hue = (parseInt(combIndex, 10) * 20) % 360;  // 色相（0-360）
                const saturation = 50;  // 饱和度（40-60）
                const lightness = 40;   // 明度（30-50），适合黑灰色背景

                // 动态生成HSL颜色
                const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

                return (
                    <Grid container spacing={2} key={combIndex}>
                        { !getIsComboModeById(activeTab) && groupItems.map((item) => (
                            <Grid
                                item
                                xs={showProductImage ? 2.4 : 1.714} // 动态调整宽度，7 个项目一行
                                key={item.id}
                            >
                                <MyCard
                                    item={item}
                                    handleClick={handleClick}
                                    kindName={getCategoryName(activeTab)}
                                    combID={getCategoryId(activeTab)}
                                    kindColor={categoryColorMap[activeTab] || '#ccc'}
                                    clearCartSignal={clearCartSignal}
                                    backgroundColor={ backgroundColor}
                                    combIndex={combIndex}
                                    combPrice={getCombPrice(activeTab)}
                                />
                            </Grid>
                        ))}

                        {
                            getIsComboModeById(activeTab) &&
                            <MyCardWithScroll
                                groupItems={groupItems}
                                groupedDataSelectInfo={groupedDataSelectInfo}
                                handleClick={handleClick}
                                kindName={getCategoryName(activeTab)}
                                combID={getCategoryId(activeTab)}
                                kindColor={categoryColorMap[activeTab] || '#ccc'}
                                clearCartSignal={clearCartSignal}
                                backgroundColor={ backgroundColor}
                                combIndex={combIndex}
                                combPrice={getCombPrice(activeTab)}
                                combRequestItems={getCombRequestItems(activeTab)}
                            />

                        }
                    </Grid>
                );
            })}
        </Box>
    );
}

export default MyProducts;