import React, {useEffect, useMemo, useState} from 'react';
import {Avatar, Box, Chip, Grid} from '@mui/material';
import MyCard from "../MyCard";
import {DetailsProps, MenuData, ProductItem} from "./Type";
import {useFetchData} from "../../../common/FetchData";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import {GenerateColorFromId} from "../../../utils/randColor";
import {resolveMenuIconUrl} from "./Icons";
import {
    applyStock,
    readCombs,
    readMenus,
    readProducts,
    useCatalogRefresh,
    useCatalogTick,
    writeCombs,
    writeMenus,
    writeProducts,
} from "../../../utils/catalogCache";
import {productCardGridXs, useProductCardStyle} from "../../../layout/productCardStyle";
import VoiceOrderBar from "./VoiceOrderBar";
import VoiceResultsPanel from "./VoiceResultsPanel";
import ComboOfferStrip from "./ComboOfferStrip";
import ComboPickBoard from "./ComboPickBoard";
import {normalizeComboOffers} from "../../../utils/comboMatch";
import {ComboGroup} from "../types";
import {toast} from "react-toastify";
import {tPos} from "../../../i18n/t";

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
    const refreshTick = useCatalogRefresh();
    const [activeTab, setActiveTab] = useState(localStorage.getItem("current_category") || '');
    const [rawData, setRawData] = useState<ProductItem[]>(() => {
        const menuId = localStorage.getItem("current_category") || '';
        return readProducts(merchantId, menuId)?.data ?? [];
    });
    const [categories, setCategories] = useState<MenuData[]>(() => readMenus(merchantId)?.data ?? []);
    const [combos, setCombos] = useState<ComboGroup[]>(() => readCombs(merchantId)?.data ?? []);
    const [selectedComboId, setSelectedComboId] = useState('');
    const [query, setQuery] = useState("");
    const [voiceBusy, setVoiceBusy] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState("");
    const [voiceProducts, setVoiceProducts] = useState<ProductItem[] | null>(null);
    const [voiceUnmatched, setVoiceUnmatched] = useState<string[]>([]);
    const [voiceSource, setVoiceSource] = useState("");
    const [voiceError, setVoiceError] = useState("");
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
    const regularMenus = useMemo(
        () => categories.filter(menu => !menu.isComboMode),
        [categories],
    );
    const comboSource = useMemo(
        () => {
            const list = combos.length
                ? combos
                : categories.filter(menu => menu.isComboMode) as unknown as ComboGroup[];
            return list.filter(item => item.is_sell !== false);
        },
        [combos, categories],
    );
    const comboOffers = useMemo(() => normalizeComboOffers(comboSource), [comboSource]);
    const selectedCombo = comboOffers.find(offer => offer.id === selectedComboId);

    const getCategoryName = (id: string): string => {
        const item = categoryMap[id];
        return item?.name;
    };

    const getCategoryId = (id: string): string => {
        const item = categoryMap[id];
        return item?.id;
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

        // TTL 内不回源；手动刷新走 invalidateCatalog（清缓存 + bump refreshTick）。
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
        }, "POST", {merchantId}, true);

        return () => {
            cancelled = true;
        };
    }, [merchantId, fetchData, refreshTick]);

    useEffect(() => {
        if (!merchantId) {
            return;
        }
        const cached = readCombs(merchantId);
        if (cached) {
            setCombos(cached.data);
        } else {
            setCombos([]);
        }
        if (cached?.fresh) {
            return;
        }
        let cancelled = false;
        fetchData('/v1/hlj/product/pos/combs', (response) => {
            const list = Array.isArray(response) ? response : (response?.data || []);
            writeCombs(merchantId, list);
            if (!cancelled) {
                setCombos(list);
            }
        }, 'POST', {merchantId}, true);
        return () => {
            cancelled = true;
        };
    }, [merchantId, fetchData, refreshTick]);

    useEffect(() => {
        if (regularMenus.length === 0 && comboOffers.length === 0) {
            return;
        }
        const onRegular = regularMenus.some(menu => menu.id === activeTab);
        const onCombo = comboOffers.some(offer => offer.id === activeTab);
        if (onCombo && !selectedComboId) {
            setSelectedComboId(activeTab);
            return;
        }
        if (!onRegular && !onCombo) {
            const fallback = regularMenus[0]?.id || comboOffers[0]?.id;
            if (!fallback) {
                return;
            }
            setActiveTab(fallback);
            localStorage.setItem('current_category', fallback);
        }
    }, [regularMenus, comboOffers, activeTab, selectedComboId]);

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

        // 2 分钟内切分类只画缓存，不重复打同一接口。
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
        }, true);

        return () => {
            cancelled = true;
        };
    }, [activeTab, merchantId, fetchData, refreshTick]);

    const handleChipClick = (categoryId: string) => {
        setSelectedComboId('');
        setActiveTab(categoryId);
        localStorage.setItem('current_category', categoryId);
    };

    const handleComboSelect = (comboId: string) => {
        if (selectedComboId === comboId) {
            setSelectedComboId('');
            const fallback = regularMenus[0]?.id;
            if (fallback) {
                setActiveTab(fallback);
                localStorage.setItem('current_category', fallback);
            }
            return;
        }
        setSelectedComboId(comboId);
        setActiveTab(comboId);
        localStorage.setItem('current_category', comboId);
    };

    // 按combIndex分组（随 data 缓存）
    const groupedData = useMemo(() => data.reduce((acc, item) => {
        const combIndex = item.combIndex;
        if (!acc[combIndex]) {
            acc[combIndex] = [];
        }
        acc[combIndex].push(item);
        return acc;
    }, {} as { [key: number]: ProductItem[] }), [data]);

    const runVoiceMatch = async (transcript: string) => {
        if (!merchantId) {
            toast.warning(tPos('voice.need_store'), {position: 'top-center'});
            return;
        }
        setVoiceBusy(true);
        try {
            const raw = await fetchData('/v1/hlj/product/pos/voice-match', () => {}, "POST", {
                merchantId,
                transcript,
            }, true);
            const body = raw?.data ?? raw;
            const products = (body?.products || []) as ProductItem[];
            setVoiceTranscript(body?.transcript || transcript);
            setVoiceProducts(products);
            setVoiceUnmatched(body?.unmatched || []);
            setVoiceSource(body?.source || '');
            setVoiceError(body?.error || '');
            if (!products.length) {
                toast.info(tPos('voice.none'), {position: 'top-center'});
            }
        } catch {
            toast.error(tPos('voice.match_failed'), {position: 'top-center'});
        } finally {
            setVoiceBusy(false);
        }
    };

    const clearVoiceResults = () => {
        setVoiceProducts(null);
        setVoiceTranscript('');
        setVoiceUnmatched([]);
        setVoiceSource('');
        setVoiceError('');
    };

    return (
        <Box>
            {alertComponent}
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1.75, overflowX: 'auto', mb: 2, py: 1.5, px: 1}}>
                <VoiceOrderBar busy={voiceBusy} onTranscript={runVoiceMatch} />
                {voiceProducts == null && regularMenus.map(category => {
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

            {voiceProducts != null ? (
                <VoiceResultsPanel
                    transcript={voiceTranscript}
                    products={voiceProducts}
                    unmatched={voiceUnmatched}
                    source={voiceSource}
                    error={voiceError}
                    handleClick={handleClick}
                    clearCartSignal={clearCartSignal}
                    onClose={clearVoiceResults}
                />
            ) : (
            <>
            <ComboOfferStrip
                combos={comboSource}
                merchantId={merchantId}
                selectedId={selectedComboId}
                onSelect={handleComboSelect}
            />
            {selectedCombo ? (
                <ComboPickBoard
                    offer={selectedCombo}
                    products={data}
                    handleClick={handleClick}
                    kindName={selectedCombo.name}
                    kindColor={categoryColorMap[selectedCombo.id] || '#c62828'}
                    clearCartSignal={clearCartSignal}
                    onBack={() => handleComboSelect(selectedCombo.id)}
                />
            ) : Object.keys(groupedData).map((combIndex) => {
                const groupItems = groupedData[parseInt(combIndex, 10)];
                const hue = (parseInt(combIndex, 10) * 20) % 360;
                const backgroundColor = `hsl(${hue}, 50%, 40%)`;

                return (
                    <Grid container spacing={2} key={combIndex}>
                        {groupItems?.map((item) => (
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
                                    combPrice={0}
                                    combRequestItems={[]}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            })}
            </>
            )}
        </Box>
    );
}

export default MyProducts;