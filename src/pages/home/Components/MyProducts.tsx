import React, {useEffect, useMemo, useState} from 'react';
import {Avatar, Box, Chip, Grid} from '@mui/material';
import MyCard from "../MyCard";
import {CombSelectInfo, DetailsProps, MenuData, ProductItem} from "./Type";
import {useFetchData} from "../../../common/FetchData";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {GenerateColorFromId} from "../../../utils/randColor";
import MyCardWithScroll from "./MyCardWithScroll";
import {resolveMenuIconUrl} from "./Icons";
import {
    applyStock,
    readMenus,
    readProducts,
    useCatalogTick,
    writeMenus,
    writeProducts,
} from "../../../utils/catalogCache";
import {productCardGridXs, useProductCardStyle} from "../../../layout/productCardStyle";

function mapsFromMenus(menus: MenuData[]) {
    const nameMap = menus.reduce((acc: Record<string, MenuData>, item: MenuData) => {
        acc[item.id] = item;
        return acc;
    }, {});
    const colorMap = menus.reduce((acc: Record<string, string>, item: { id: string }) => {
        acc[item.id] = GenerateColorFromId(item.id);
        return acc;
    }, {});
    return {nameMap, colorMap};
}

function MyProducts({handleClick, clearCartSignal}: DetailsProps) {
    const {showProductImage, merchantId} = useCartContext();
    const [cardStyle] = useProductCardStyle();
    const catalogTick = useCatalogTick();
    const [activeTab, setActiveTab] = useState(localStorage.getItem("current_category") || '');
    const [rawData, setRawData] = useState<ProductItem[]>(() => {
        const menuId = localStorage.getItem("current_category") || '';
        return readProducts(merchantId, menuId)?.data ?? [];
    });
    const [categories, setCategories] = useState<MenuData[]>(() => readMenus(merchantId)?.data ?? []);
    const [query, setQuery] = useState("");
    const [categoryMap, setCategoryMap] = useState<Record<string, MenuData>>(
        () => mapsFromMenus(readMenus(merchantId)?.data ?? []).nameMap,
    );
    const [categoryColorMap, setCategoryColorMap] = useState<Record<string, string>>(
        () => mapsFromMenus(readMenus(merchantId)?.data ?? []).colorMap,
    );
    const {fetchData, alertComponent} = useFetchData();

    const applyMenus = (menus: MenuData[]) => {
        const {nameMap, colorMap} = mapsFromMenus(menus);
        setCategories(menus);
        setCategoryMap(nameMap);
        setCategoryColorMap(colorMap);
    };

    const data = useMemo(
        () => applyStock(merchantId, rawData),
        [merchantId, rawData, catalogTick],
    );

    // 通过 id 获取 isComboMode
    const getIsComboModeById = (id: string): boolean | undefined => {
        const item = categoryMap[id]; // 获取对应的 MenuData 对象
        return item ? item.isComboMode : undefined; // 如果找到返回 isComboMode，否则返回 undefined
    };

    const getCategoryName = (id: string): string => {
        const item = categoryMap[id]; // 获取对应的 MenuData 对象
        return item?.name; // 如果找到返回 isComboMode，否则返回 undefined
    };

    const getCombPrice = (id: string): number => {
        const item = categoryMap[id]; // 获取对应的 MenuData 对象
        return item?.price; // 如果找到返回 isComboMode，否则返回 undefined
    };

    // getCombRequestItems
    const getCombRequestItems = (id: string): { id: string; quantity: number }[] => {
        const item = categoryMap[id];
        const slots = item?.combo || [];
        if (slots.length) {
            return slots.flatMap((slot: any) =>
                (slot.products || []).map((productId: string) => ({
                    id: productId,
                    quantity: slot.requires || 1,
                })),
            );
        }
        return (item?.products || []).map((productId: string) => ({id: productId, quantity: 1}));
    };
    const getCategoryId = (id: string): string => {
        const item = categoryMap[id]; // 获取对应的 MenuData 对象
        return item?.id; // 如果找到返回 isComboMode，否则返回 undefined
    };

    useEffect(() => {
        if (!merchantId) {
            return;
        }

        const cached = readMenus(merchantId);
        if (cached) {
            applyMenus(cached.data);
        } else {
            applyMenus([]);
        }
        if (cached?.fresh) {
            return;
        }

        let cancelled = false;
        fetchData('/v1/hlj/product/pos/menu', (response) => {
            const menus = response || [];
            writeMenus(merchantId, menus);
            if (!cancelled) {
                applyMenus(menus);
            }
        }, "POST", {merchantId});

        return () => {
            cancelled = true;
        };
    }, [merchantId, fetchData, catalogTick]);

    useEffect(() => {
        if (categories.length === 0) {
            return;
        }
        const exists = categories.some(category => category.id === activeTab);
        if (!exists) {
            setActiveTab(categories[0].id);
            localStorage.setItem("current_category", categories[0].id);
        }
    }, [categories, activeTab]);

    useEffect(() => {
        if (!merchantId || !activeTab) {
            return;
        }

        const cached = readProducts(merchantId, activeTab);
        if (cached) {
            setRawData(cached.data);
        } else {
            setRawData([]);
        }
        if (cached?.fresh) {
            return;
        }

        let cancelled = false;
        fetchData('/v1/hlj/product/pos/products', (response) => {
            const products = response || [];
            writeProducts(merchantId, activeTab, products);
            if (!cancelled) {
                setRawData(products);
            }
        }, "POST", {
            merchantId,
            menuId: activeTab,
        });

        return () => {
            cancelled = true;
        };
    }, [activeTab, merchantId, fetchData, catalogTick]);

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
            const slots = categoryMap[activeTab]?.combo || [];
            acc[combIndex] = {
                title: slots[Number(combIndex)]?.combName || getCategoryName(activeTab) || '',
                maxLimit: item.maxLimit || slots[Number(combIndex)]?.quantity || slots[Number(combIndex)]?.requires || 1,
            };
        }

        return acc;
    }, {} as { [key: string]: CombSelectInfo });

    return (
        <Box>
            {alertComponent}
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1.75, overflowX: 'auto', mb: 2, py: 1.5, px: 1}}>
                {categories.map(category => {
                    const iconUrl = resolveMenuIconUrl(category.icon);
                    const selected = activeTab === category.id;
                    return (
                        <Chip
                            key={category.id}
                            avatar={iconUrl ? (
                                <Avatar
                                    src={iconUrl}
                                    alt={category.name}
                                    sx={{
                                        bgcolor: '#fff',
                                        width: selected ? 32 : 28,
                                        height: selected ? 32 : 28,
                                        '& img': {
                                            objectFit: 'contain',
                                            padding: '3px',
                                        },
                                    }}
                                />
                            ) : undefined}
                            label={category.name}
                            clickable
                            sx={{
                                height: selected ? 48 : 40,
                                fontSize: selected ? '1.16rem' : '1.02rem',
                                fontWeight: selected ? 700 : 600,
                                transform: selected ? 'scale(1.12)' : 'scale(1)',
                                transformOrigin: 'center center',
                                transition: 'transform 180ms ease, box-shadow 180ms ease, height 180ms ease, font-size 180ms ease',
                                zIndex: selected ? 2 : 1,
                                color: '#fff',
                                backgroundColor: categoryColorMap[category.id] || '#e0e0e0',
                                border: selected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.28)',
                                boxShadow: selected
                                    ? '0 6px 18px rgba(0,0,0,0.28), 0 0 0 2px rgba(255,255,255,0.35)'
                                    : 'none',
                                '&:hover': {
                                    backgroundColor: categoryColorMap[category.id] || '#e0e0e0',
                                },
                                '& .MuiChip-avatar': {
                                    width: selected ? 32 : 28,
                                    height: selected ? 32 : 28,
                                    marginLeft: '8px',
                                },
                                '& .MuiChip-label': {
                                    px: 1.5,
                                },
                            }}
                            onClick={() => handleChipClick(category.id)}
                        />
                    );
                })}
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
                        {!getIsComboModeById(activeTab) && groupItems && groupItems?.map((item) => (
                            <Grid
                                item
                                xs={productCardGridXs(cardStyle, showProductImage)}
                                key={item.id}
                            >
                                <MyCard
                                    item={item}
                                    handleClick={handleClick}
                                    kindName={getCategoryName(activeTab)}
                                    combID={getCategoryId(activeTab)}
                                    kindColor={categoryColorMap[activeTab] || '#ccc'}
                                    clearCartSignal={clearCartSignal}
                                    backgroundColor={backgroundColor}
                                    combIndex={combIndex}
                                    combPrice={getCombPrice(activeTab)}
                                    combRequestItems={getCombRequestItems(activeTab)}
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
                                backgroundColor={backgroundColor}
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