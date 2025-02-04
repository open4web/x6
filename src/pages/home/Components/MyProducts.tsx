import React, {useEffect, useMemo, useState} from 'react';
import {Box, Chip, Grid} from '@mui/material';
import MyCard from "../MyCard";
import {DetailsProps, MenuData, ProductCategory, ProductItem} from "./Type";
import {useFetchData} from "../../../common/FetchData";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {GenerateColorFromId} from "../../../utils/randColor";


function MyProducts({handleClick, clearCartSignal}: DetailsProps) {
    const {setShowProductImage, showProductImage, cartItems} = useCartContext();
    const [data, setData] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<MenuData[]>([]);
    const [activeTab, setActiveTab] = useState(localStorage.getItem("current_category") || '');
    const [query, setQuery] = useState("");
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
    const [categoryColorMap, setCategoryColorMap] = useState<Record<string, string>>({});
    const {merchantId} = useCartContext();
    const {fetchData, alertComponent} = useFetchData();

    useEffect(() => {
        const payload = {
            "merchantId": merchantId,
        }

        // 获取菜谱列表
        fetchData('/v1/product/pos/menu', (response) => {
            const cm = response || [];
            setCategories(cm);
            // 创建 nameMap, colorMap
            const nameMap = cm.reduce((acc: Record<string, string>, item: { id: string, name: string }) => {
                acc[item.id] = item.name;
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
        fetchData('/v1/product/pos/products', (response) => {
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

    // const filteredData = useMemo(() => {
    //     return data.filter(item => {
    //         const matchesCategory =
    //             activeTab === '' || (categories.find(cat => cat.id === activeTab)?.product_id_list || []).includes(item.id);
    //
    //         const matchesQuery = query === '' || item.name.toLowerCase().includes(query.toLowerCase());
    //
    //         const matchesMenu = item.menu?.some(menuId =>
    //             categories.some(cat => cat.id === menuId)
    //         );
    //
    //         return matchesCategory && matchesQuery && matchesMenu;
    //     });
    // }, [data, activeTab, query, categories]);

    // 按combIndex分组
    const groupedData = data.reduce((acc, item) => {
        const combIndex = item.combIndex;
        if (!acc[combIndex]) {
            acc[combIndex] = [];
        }
        acc[combIndex].push(item);
        return acc;
    }, {} as { [key: number]: ProductItem[] });

    return (
        <Box>
            {alertComponent}
            <Box sx={{display: 'flex', gap: 1, overflowX: 'auto', mb: 2}}>
                <Chip
                    label="All"
                    clickable
                    style={{
                        backgroundColor: activeTab === '' ? '#1976d2' : '#e0e0e0',
                        color: activeTab === '' ? '#fff' : '#000',
                        border: activeTab === '' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    }}
                    icon={activeTab === '' ? <span style={{fontWeight: 'bold', color: '#fff'}}>✔</span> : undefined}
                    onClick={() => handleChipClick('')}
                />
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
                        {groupItems.map((item) => (
                            <Grid
                                item
                                xs={showProductImage ? 2.4 : 1.714} // 动态调整宽度，7 个项目一行
                                key={item.id}
                            >
                                <MyCard
                                    item={item}
                                    handleClick={handleClick}
                                    kindName={categoryMap[activeTab] || 'X'}
                                    kindColor={categoryColorMap[activeTab] || '#ccc'}
                                    clearCartSignal={clearCartSignal}
                                    backgroundColor={ backgroundColor}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            })}
        </Box>
    );
}

export default MyProducts;