import React, {useEffect, useState, useMemo} from 'react';
import {Grid, Chip, Box} from '@mui/material';
import MyCard from "../MyCard";
import {DetailsProps, ProductCategory, ProductItem} from "./Type";
import {useFetchData} from "../../../common/FetchData";
import {useCartContext} from "../../../dataProvider/MyCartProvider";

function generateColorFromId(id: string): string {
    // 简单的哈希函数，将字符串转化为一个数值
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 将哈希值转化为颜色值
    const hue = Math.abs(hash % 360); // 取模 360 得到 0-360 之间的值
    const saturation = 70; // 固定的饱和度
    const lightness = 50; // 固定的亮度
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function MyProducts({handleClick, clearCartSignal}: DetailsProps) {
    const {  setShowProductImage, showProductImage } = useCartContext();
    const [data, setData] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [activeTab, setActiveTab] = useState(localStorage.getItem("current_category") || '');
    const [query, setQuery] = useState("");
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
    const [categoryColorMap, setCategoryColorMap] = useState<Record<string, string>>({});
    const {  merchantId } = useCartContext();
    const { fetchData, alertComponent } = useFetchData();

    useEffect(() => {
        const userData = {
            "storeId": localStorage.getItem("current_store_id") || '',
            "categoryId": localStorage.getItem("current_category") || '',
        };

        fetchData('/v1/product/pos/menu', (response) => {
            const cm = response?.categories || [];
            const pd = response?.products || [];

            // 去重处理
            const uniqueProducts = Array.from(new Map(pd.map((item: { id: any; }) => [item.id, item])).values());

            setCategories(cm);
            // @ts-ignore
            setData(uniqueProducts);

            const nameMap = cm.reduce((acc: Record<string, string>, category: ProductCategory) => {
                acc[category.id] = category.name;
                return acc;
            }, {});

            const colorMap = cm.reduce((acc: Record<string, string>, category: ProductCategory) => {
                acc[category.id] = generateColorFromId(category.id);
                return acc;
            }, {});

            setCategoryMap(nameMap);
            console.log("===nameMap=>", nameMap)
            setCategoryColorMap(colorMap);
        }, "POST", userData);
    }, [activeTab, merchantId]);

    const handleChipClick = (categoryId: string) => {
        setActiveTab(categoryId);
        localStorage.setItem("current_category", categoryId);
    };

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesCategory =
                activeTab === '' || (categories.find(cat => cat.id === activeTab)?.product_id_list || []).includes(item.id);

            const matchesQuery = query === '' || item.name.toLowerCase().includes(query.toLowerCase());

            const matchesMenu = item.menu?.some(menuId =>
                categories.some(cat => cat.id === menuId)
            );

            return matchesCategory && matchesQuery && matchesMenu;
        });
    }, [data, activeTab, query, categories]);

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
            <Grid
                container
                spacing={showProductImage ? 2 : 0.1} // 动态调整间距
            >
                {filteredData.map((item) => (
                    <Grid
                        item
                        xs={showProductImage ? 2.4 : 1.714} // 动态调整宽度，7 个项目一行
                        key={item.id}
                    >
                        <MyCard
                            item={item}
                            handleClick={handleClick}
                            kindName={categoryMap[activeTab] || "X"}
                            kindColor={categoryColorMap[activeTab] || "#ccc"}
                            clearCartSignal={clearCartSignal}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default MyProducts;