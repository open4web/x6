import React, { useState, useEffect } from 'react';
import Cards from './Cards';
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
  title: string;
  amount: number;
  price: number;
  kind: string;
  // Add more properties as needed
}

interface Category {
  id: string;
  name: string;
}

function Details({ handleClick }: DetailsProps) {
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

      console.log("logs-->", cm)
      setCategories(cm)
      setData(pd);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  //search functionality
  const [query, setQuery] = useState("")

  const handleBtns = (category_id: string) => {
    console.log("current category_id", category_id)
    localStorage.setItem("current_category", category_id)
    setActiveTab(category_id);
  };

  // @ts-ignore
  // @ts-ignore
  return (
    // <>
    //   <section className="container pt-4 mx-auto w-full bg-bgColor">
    //     <section className="px-6 flex flex-row justify-between">
    //       <div className="relative w-80 h-11 mt-4">
    //       </div>
    //       <div className="flex flex-wrap mt-4 lg:mb-4 mb-8">
    //         { // @ts-ignore
    //           categories?.map((i) => (
    //             <button
    //                 key={i.id}
    //                 value={i.id}
    //                 onClick={() => handleBtns(i.id)}
    //                 className={
    //               `mr-2 text-brandColor border-brandColor border-2 py-1 md:w-24 h-10 rounded-lg text-lg ${
    //                   // @ts-ignore
    //                     activeTab === i.id ? 'bg-brandColor outline-none text-white' : ''
    //                 }`}
    //             >
    //               {i.name}
    //             </button>
    //         ))}
    //       </div>
    //
    //     </section>
          <Grid container spacing={2}>
            {data?.filter(title => {
              if (query === '') {
                return title;
              } else if (title.title.toLowerCase().includes(query.toLowerCase())) {
                return title;
              }
            }).map((item) => (
              <Grid xs={3} columnSpacing={2}>
                {/*<Cards key={item.id} item={item} handleClick={handleClick}/>*/}
                <MyCard item={item} handleClick={handleClick}/>
            </Grid>
            ))}
          </Grid>
    //   </section>
    // </>
  );
}

export default Details;
