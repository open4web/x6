import React, {useEffect, useState} from 'react';
import {Grid} from '@mui/material';
import MyCard from "../MyCard";
import {DetailsProps, ProductCategory, ProductItem} from "./Type";
import {useFetchData} from "../../../common/FetchData";

function MyProducts({handleClick}: DetailsProps) {
    const [data, setData] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>();
    const [activeTab, setActiveTab] = useState(localStorage.getItem("current_category") || '');
    const fetchData = useFetchData()

    useEffect(() => {
        const userData = {
            "storeId": localStorage.getItem("current_store_id") || '',
            "categoryId": localStorage.getItem("current_category") || '',
        }
        fetchData('/v1/product/pos/menu', (response) => {
            const cm = response?.categories || [];
            const pd = response?.products || [];

            setCategories(cm);
            setData(pd);
        }, "POST", userData);
    }, [activeTab]); // Empty dependency array ensures the effect runs only once

    //search functionality
    const [query, setQuery] = useState("")

    // @ts-ignore
    return (
        <Grid container spacing={2}>
            {data?.filter(title => {
                if (query === '') {
                    return title;
                } else if (title.name.toLowerCase().includes(query.toLowerCase())) {
                    return title;
                }
            }).map((item) => (
                <Grid item xs={2.4} key={item.id}> {/* xs={2.4} 分布较均匀 */}
                    <MyCard item={item} handleClick={handleClick}/>
                </Grid>
            ))}
        </Grid>
    );
}

export default MyProducts;
