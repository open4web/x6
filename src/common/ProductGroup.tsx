import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Slider from "react-slick"; // react-slick library
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MyCard from "../pages/home/MyCard";

interface ProductItem {
    id: string | number; // 商品唯一标识
    name: string;        // 商品名称
    image?: string;      // 商品图片 (可选)
    price?: number;      // 商品价格 (可选)
    [key: string]: any;  // 其他商品属性
}

interface ProductSelectorProps {
    filteredData: ProductItem[];  // 过滤后的商品数据列表
    handleClick: (item: ProductItem) => void; // 点击商品卡片时的回调函数
    categoryMap: { [key: string]: string };   // 分类名称映射表
    categoryColorMap: { [key: string]: string }; // 分类颜色映射表
    activeTab: string;        // 当前激活的分类键
    clearCartSignal: boolean; // 是否触发清空购物车的信号
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
                                                             filteredData,
                                                             handleClick,
                                                             categoryMap,
                                                             categoryColorMap,
                                                             activeTab,
                                                             clearCartSignal,
                                                         }) => {
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: ProductItem | null }>({});

    /**
     * 将商品数据分组为多列
     * @param data - 商品列表
     * @param numColumns - 列数
     * @returns 分组后的商品数据
     */
    const groupData = (data: ProductItem[], numColumns: number): ProductItem[][] => {
        const grouped = Array.from({ length: numColumns }, () => [] as ProductItem[]);
        data.forEach((item, index) => {
            grouped[index % numColumns].push(item);
        });
        return grouped;
    };

    const columns = groupData(filteredData, 3); // 分成 3 列

    /**
     * 处理商品选择逻辑
     * @param columnIndex - 列索引
     * @param item - 被选中的商品
     */
    const handleItemSelect = (columnIndex: number, item: ProductItem) => {
        setSelectedItems((prev) => ({
            ...prev,
            [columnIndex]: item,
        }));
    };

    // react-slick 配置
    const sliderSettings = {
        dots: false,
        infinite: true,
        vertical: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        verticalSwiping: true,
        arrows: false,
    };

    return (
        <Grid container spacing={2}>
            {columns.map((column, colIndex) => (
                <Grid item xs={4} key={colIndex}>
                    <Slider {...sliderSettings}>
                        {column.map((item) => (
                            <div key={item.id}>
                                <MyCard
                                    item={item}
                                    handleClick={() => {
                                        handleClick(item);
                                        handleItemSelect(colIndex, item);
                                    }}
                                    kindName={categoryMap[activeTab] || "X"}
                                    kindColor={categoryColorMap[activeTab] || "#ccc"}
                                    clearCartSignal={clearCartSignal}
                                    isSelected={selectedItems[colIndex]?.id === item.id} // 判断是否选中
                                />
                            </div>
                        ))}
                    </Slider>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductSelector;