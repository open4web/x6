import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import MyCard from "../MyCard";

const demoHost = ""

interface DetailsProps {
  handleClick: (item: any) => void;
}

interface Resp {
  categories: Category[];
  products: ProductItem[];
}

// Define the type for your data
export interface ProductItem {
  id: string;
  img: string;
  name: string;
  quantity: number;
  price: number;
  kind: string;
  desc: string;
  // Add more properties as needed
}

interface Category {
  id: string;
  name: string;
}

function MyProducts({ handleClick }: DetailsProps) {
  const [data, setData] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>();
  const [activeTab, setActiveTab] = useState(localStorage.getItem("current_category") || '');
  useEffect(() => {
    fetchData().then(r => {
      console.log("categories ==>", categories, "data", data)
    });
  }, [activeTab]); // Empty dependency array ensures the effect runs only once


  const fetchData = async () => {
    const userData = {
      "storeId": localStorage.getItem("current_store_id") || '',
      "categoryId": localStorage.getItem("current_category") || '',
    }
    try {
      // @ts-ignore
      const response = await axios.post<Resp>(demoHost + "/v1/product/pos/menu", userData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const cm = response?.data?.categories
      const pd = response?.data?.products

      setCategories(cm)
      setData(pd);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
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
              <Grid xs={2} columnSpacing={4}>
                <MyCard item={item} handleClick={handleClick}/>
            </Grid>
            ))}
          </Grid>
  );
}

export default MyProducts;
