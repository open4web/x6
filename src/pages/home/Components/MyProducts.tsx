import React, {useEffect, useState, useMemo} from 'react';
import {Grid, Chip, Box, TextField} from '@mui/material';
import MyCard from "../MyCard";
import {DetailsProps, ProductCategory, ProductItem} from "./Type";
import {useFetchData} from "../../../common/FetchData";

function generateRandomColor(): string {
    const hue = Math.floor(Math.random() * 360); // 随机色相
    const saturation = 70; // 固定饱和度
    const lightness = 50; // 固定亮度
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function MyProducts({handleClick}: DetailsProps) {
    const [data, setData] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [activeTab, setActiveTab] = useState(localStorage.getItem("current_category") || '');
    const [query, setQuery] = useState("");
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
    const [categoryColorMap, setCategoryColorMap] = useState<Record<string, string>>({});


    const fetchData = useFetchData();

    useEffect(() => {
        const userData = {
            "storeId": localStorage.getItem("current_store_id") || '',
            "categoryId": localStorage.getItem("current_category") || '',
        };

        fetchData('/v1/product/pos/menu', (response) => {
            const cm = response?.categories || [];
            const pd = response?.products || [];

            setCategories(cm);
            setData(pd);
            // 转换 categories 为 id -> name 的映射
            const nameMap = cm.reduce((acc: Record<string, string>, category: ProductCategory) => {
                acc[category.id] = category.name;
                return acc;
            }, {});

            const colorMap = cm.reduce((acc: Record<string, string>, category: ProductCategory) => {
                acc[category.id] = generateRandomColor(); // 为每个类别生成随机颜色
                return acc;
            }, {});

            setCategoryMap(nameMap);
            setCategoryColorMap(colorMap);

        }, "POST", userData);
    }, [activeTab]);

    const handleChipClick = (categoryId: string) => {
        setActiveTab(categoryId);
        localStorage.setItem("current_category", categoryId);
    };

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesCategory = activeTab === '' || categories.some(cat => cat.id === activeTab && cat.product_id_list.includes(item.id));
            const matchesQuery = query === '' || item.name.toLowerCase().includes(query.toLowerCase());
            return matchesCategory && matchesQuery;
        });
    }, [data, activeTab, query, categories]);

    return (
        <Box>
            {/*<Box sx={{mb: 2}}>*/}
            {/*    <TextField*/}
            {/*        label="查找"*/}
            {/*        variant="outlined"*/}
            {/*        value={query}*/}
            {/*        onChange={(e) => setQuery(e.target.value)}*/}
            {/*    />*/}
            {/*</Box>*/}
            {/* Category Chips */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 2 }}>
                <Chip
                    label="All"
                    clickable
                    style={{
                        backgroundColor: activeTab === '' ? '#1976d2' : '#e0e0e0', // primary or default color
                        color: activeTab === '' ? '#fff' : '#000', // text color based on active state
                    }}
                    onClick={() => handleChipClick('')}
                />
                {categories.map(category => (
                    <Chip
                        key={category.id}
                        label={category.name}
                        clickable
                        style={{
                            backgroundColor: categoryColorMap[category.id] || '#e0e0e0', // 根据类型 ID 设置颜色，默认灰色
                            color: '#fff', // 设置文本颜色为白色，保证对比度
                            border: activeTab === category.id ? '2px solid #1976d2' : 'none', // 添加边框以突出选中状态
                        }}
                        onClick={() => handleChipClick(category.id)}
                    />
                ))}
            </Box>

            {/* Search Bar */}

            {/* Product Grid */}
            <Grid container spacing={2}>
                {filteredData.map((item) => (
                    <Grid item xs={2.4} key={item.id}>
                        <MyCard
                            item={item}
                            handleClick={handleClick}
                            kindName={categoryMap[item.kind] || "X"} // 如果未找到匹配的，返回 "x"
                            kindColor={categoryColorMap[item.kind] || "#ccc"} // 如果未找到匹配的，返回默认颜色
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default MyProducts;