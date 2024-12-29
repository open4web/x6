import React, {useEffect, useState, useMemo} from 'react';
import {Grid, Chip, Box, TextField} from '@mui/material';
import MyCard from "../MyCard";
import {DetailsProps, ProductCategory, ProductItem} from "./Type";
import {useFetchData} from "../../../common/FetchData";

function MyProducts({handleClick}: DetailsProps) {
    const [data, setData] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [activeTab, setActiveTab] = useState(localStorage.getItem("current_category") || '');
    const [query, setQuery] = useState("");
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
            <Box sx={{mb: 2}}>
                <TextField
                    label="查找"
                    variant="outlined"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </Box>
            {/* Category Chips */}
            <Box sx={{display: 'flex', gap: 1, overflowX: 'auto', mb: 2}}>
                <Chip
                    label="All"
                    clickable
                    color={activeTab === '' ? 'primary' : 'default'}
                    onClick={() => handleChipClick('')}
                />
                {categories.map(category => (
                    <Chip
                        key={category.id}
                        label={category.name}
                        clickable
                        color={activeTab === category.id ? 'primary' : 'default'}
                        onClick={() => handleChipClick(category.id)}
                    />
                ))}
            </Box>

            {/* Search Bar */}

            {/* Product Grid */}
            <Grid container spacing={2}>
                {filteredData.map((item) => (
                    <Grid item xs={2.4} key={item.id}>
                        <MyCard item={item} handleClick={handleClick}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default MyProducts;