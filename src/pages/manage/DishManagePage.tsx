import * as React from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useFetchData} from '../../common/FetchData';
import {useCartContext} from '../../dataProvider/MyCartProvider';
import {invalidateCatalog} from '../../utils/catalogCache';
import {tPos} from '../../i18n/t';
import TouchChipSelect from './components/TouchChipSelect';
import VoiceFillButton from './components/VoiceFillButton';
import DishImagePicker from './components/DishImagePicker';
import NumericKeyboardDialog from '../../common/NumericKeyboardDialog';
import {
    DEFAULT_MIN_BUY,
    DEFAULT_PACK,
    DEFAULT_STOCK,
    DEFAULT_UNIT,
    DISH_UNITS,
    MIN_BUY_OPTIONS,
    coverForCategory,
    fallbackIntro,
} from './dishDefaults';

type CatalogMenu = {id: string; name: string; product_ids?: string[]; is_combo?: boolean};
type CatalogProduct = {
    id: string;
    name: string;
    price: number;
    is_sell: boolean;
    category_id: string;
    menu_ids?: string[];
    stock?: number;
    content?: string;
    unit?: string;
    cover_img?: string;
};
type CatalogLite = {
    categories?: {id: string; name: string}[];
    menus?: CatalogMenu[];
    products?: CatalogProduct[];
    presets?: string[];
};
type QuickResult = {menuId?: string; needBindMenu?: boolean};

const DEFAULT_CATEGORY = '其他';

export default function DishManagePage() {
    const navigate = useNavigate();
    const {fetchData, alertComponent} = useFetchData();
    const {merchantId} = useCartContext();
    const storeId = merchantId || localStorage.getItem('current_store_id') || '';
    const [catalog, setCatalog] = React.useState<CatalogLite | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [menuId, setMenuId] = React.useState('');
    const [addOpen, setAddOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [moveOpen, setMoveOpen] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [deleteTarget, setDeleteTarget] = React.useState<CatalogProduct | null>(null);
    const [active, setActive] = React.useState<CatalogProduct | null>(null);
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('0');
    const [stock, setStock] = React.useState(String(DEFAULT_STOCK));
    const [unit, setUnit] = React.useState(DEFAULT_UNIT);
    const [packCost, setPackCost] = React.useState(DEFAULT_PACK);
    const [minBuy, setMinBuy] = React.useState(String(DEFAULT_MIN_BUY));
    const [intro, setIntro] = React.useState('');
    const [introTouched, setIntroTouched] = React.useState(false);
    const [imagePick, setImagePick] = React.useState('');
    const [isSell, setIsSell] = React.useState(true);
    const [category, setCategory] = React.useState(DEFAULT_CATEGORY);
    const [showMore, setShowMore] = React.useState(false);
    const [menuName, setMenuName] = React.useState('');
    const [moveTo, setMoveTo] = React.useState('');
    const [pricePad, setPricePad] = React.useState(false);
    const [stockPad, setStockPad] = React.useState(false);
    const [packPad, setPackPad] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [aiBusy, setAiBusy] = React.useState(false);

    const menus = React.useMemo(
        () => (catalog?.menus || []).filter((m) => !m.is_combo),
        [catalog],
    );
    const menuOptions = React.useMemo(() => menus.map((m) => m.name), [menus]);
    const menuNameToId = React.useMemo(() => {
        const map: Record<string, string> = {};
        menus.forEach((m) => {
            map[m.name] = m.id;
        });
        return map;
    }, [menus]);
    const selectedMenuName = menus.find((m) => m.id === menuId)?.name || '';

    const categoryOptions = React.useMemo(() => {
        const fromApi = (catalog?.categories || []).map((c) => c.name).filter(Boolean);
        const presets = catalog?.presets || ['热菜', '凉菜', '主食', '汤', '饮品', '小食', '套餐', '其他'];
        return Array.from(new Set([...fromApi, ...presets]));
    }, [catalog]);

    const products = React.useMemo(() => {
        const all = catalog?.products || [];
        if (!menuId) return all;
        const menu = menus.find((m) => m.id === menuId);
        if (!menu) return all;
        const idSet = new Set(menu.product_ids || []);
        return all.filter((p) => idSet.has(p.id) || (p.menu_ids || []).includes(menuId));
    }, [catalog, menuId, menus]);

    const reload = React.useCallback(async () => {
        if (!storeId) return;
        setLoading(true);
        try {
            const data = await fetchData(
                '/v1/hlj/product/pos/catalog-lite',
                () => {},
                'POST',
                {storeId},
                true,
            );
            setCatalog(data as CatalogLite);
        } catch {
            setCatalog(null);
        } finally {
            setLoading(false);
        }
    }, [fetchData, storeId]);

    React.useEffect(() => {
        reload();
    }, [reload]);

    React.useEffect(() => {
        if (!menus.length) {
            setMenuId('');
            return;
        }
        if (!menuId || !menus.some((m) => m.id === menuId)) {
            setMenuId(menus[0].id);
        }
    }, [menus, menuId]);

    React.useEffect(() => {
        if (!addOpen || introTouched) return;
        setIntro(fallbackIntro(name, category));
    }, [addOpen, introTouched, name, category]);

    const bindMenuIfNeeded = async (data: QuickResult | null) => {
        const mid = String(data?.menuId || '');
        if (data?.needBindMenu && mid) {
            await fetchData('/v1/hlj/store/pos/bind-menu', () => {}, 'POST', {storeId, menuId: mid}, true);
        }
        return mid;
    };

    const resetDishForm = () => {
        setName('');
        setPrice('0');
        setIsSell(true);
        setCategory(DEFAULT_CATEGORY);
        setShowMore(false);
        setActive(null);
        setStock(String(DEFAULT_STOCK));
        setUnit(DEFAULT_UNIT);
        setPackCost(DEFAULT_PACK);
        setMinBuy(String(DEFAULT_MIN_BUY));
        setIntro('');
        setIntroTouched(false);
        setImagePick('');
    };

    const openAdd = () => {
        resetDishForm();
        setAddOpen(true);
    };

    const openEdit = (p: CatalogProduct) => {
        setActive(p);
        setName(p.name);
        setPrice(String(p.price ?? 0));
        setIsSell(!!p.is_sell);
        const cat = (catalog?.categories || []).find((c) => c.id === p.category_id);
        setCategory(cat?.name || DEFAULT_CATEGORY);
        setShowMore(false);
        setEditOpen(true);
    };

    const openMove = (p: CatalogProduct) => {
        setActive(p);
        const others = menus.filter((m) => m.id !== menuId);
        setMoveTo(others[0]?.id || '');
        setMoveOpen(true);
    };

    const saleOn = tPos('manage.on_sale');
    const saleOff = tPos('manage.off_sale');
    const cover = imagePick || coverForCategory(category);

    const writeIntro = async () => {
        if (!name.trim()) {
            toast.warning(tPos('manage.dish_name_required'), {position: 'top-center'});
            return;
        }
        setAiBusy(true);
        try {
            const data = await fetchData(
                '/v1/hlj/product/pos/describe',
                () => {},
                'POST',
                {name: name.trim(), categoryName: category || DEFAULT_CATEGORY},
                true,
            );
            const text = String((data as {content?: string})?.content || '').trim();
            const source = String((data as {source?: string})?.source || '');
            if (!text) throw new Error('empty');
            setIntro(text);
            setIntroTouched(true);
            if (source !== 'ai') {
                toast.info(tPos('manage.dish_intro_fallback'), {position: 'top-center'});
            }
        } catch {
            setIntro(fallbackIntro(name, category));
            setIntroTouched(true);
            toast.info(tPos('manage.dish_intro_fallback'), {position: 'top-center'});
        } finally {
            setAiBusy(false);
        }
    };

    const saveDish = async () => {
        if (!storeId) {
            toast.warning(tPos('manage.need_store'), {position: 'top-center'});
            navigate('/manage/store');
            return;
        }
        if (!name.trim()) {
            toast.warning(tPos('manage.dish_name_required'), {position: 'top-center'});
            return;
        }
        const priceNum = Number(price);
        if (!Number.isFinite(priceNum) || priceNum < 0) {
            toast.warning(tPos('manage.dish_price_invalid'), {position: 'top-center'});
            return;
        }
        const stockNum = Number(stock);
        if (!Number.isInteger(stockNum) || stockNum < 0) {
            toast.warning(tPos('manage.dish_stock_invalid'), {position: 'top-center'});
            return;
        }
        const packNum = Number(packCost);
        if (!Number.isFinite(packNum) || packNum < 0) {
            toast.warning(tPos('manage.dish_pack_invalid'), {position: 'top-center'});
            return;
        }
        const minBuyNum = Number(minBuy);
        if (!Number.isInteger(minBuyNum) || minBuyNum < 1) {
            toast.warning(tPos('manage.dish_min_buy_invalid'), {position: 'top-center'});
            return;
        }
        setSaving(true);
        try {
            const matched = (catalog?.categories || []).find((c) => c.name === category);
            const data = await fetchData(
                '/v1/hlj/product/pos/quick',
                () => {},
                'POST',
                {
                    storeId,
                    name: name.trim(),
                    price: priceNum,
                    categoryName: category || DEFAULT_CATEGORY,
                    categoryId: matched?.id || '',
                    menuId: menuId || '',
                    stock: stockNum,
                    unit,
                    isSell,
                    packCost: packNum.toFixed(2),
                    minBuyNum,
                    content: intro.trim() || fallbackIntro(name, category || DEFAULT_CATEGORY),
                    coverImg: cover,
                },
                true,
            );
            await bindMenuIfNeeded(data as QuickResult);
            invalidateCatalog(storeId);
            toast.success(tPos('manage.dish_created'), {position: 'top-center'});
            setAddOpen(false);
            resetDishForm();
            await reload();
        } catch {
            // alert via fetchData
        } finally {
            setSaving(false);
        }
    };

    const saveEdit = async () => {
        if (!active) return;
        if (!name.trim()) {
            toast.warning(tPos('manage.dish_name_required'), {position: 'top-center'});
            return;
        }
        const priceNum = Number(price);
        if (!Number.isFinite(priceNum) || priceNum < 0) {
            toast.warning(tPos('manage.dish_price_invalid'), {position: 'top-center'});
            return;
        }
        setSaving(true);
        try {
            const matched = (catalog?.categories || []).find((c) => c.name === category);
            await fetchData(
                '/v1/hlj/product/pos/quick-update',
                () => {},
                'POST',
                {
                    storeId,
                    productId: active.id,
                    name: name.trim(),
                    price: priceNum,
                    isSell,
                    categoryName: category || DEFAULT_CATEGORY,
                    categoryId: matched?.id || '',
                },
                true,
            );
            invalidateCatalog(storeId);
            toast.success(tPos('manage.dish_updated'), {position: 'top-center'});
            setEditOpen(false);
            resetDishForm();
            await reload();
        } catch {
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setSaving(true);
        try {
            await fetchData(
                '/v1/hlj/product/pos/quick-delete',
                () => {},
                'POST',
                {storeId, productId: deleteTarget.id},
                true,
            );
            invalidateCatalog(storeId);
            toast.success(tPos('manage.dish_deleted'), {position: 'top-center'});
            setDeleteTarget(null);
            await reload();
        } catch {
        } finally {
            setSaving(false);
        }
    };

    const saveMove = async () => {
        if (!active || !moveTo) {
            toast.warning(tPos('manage.move_need_target'), {position: 'top-center'});
            return;
        }
        setSaving(true);
        try {
            await fetchData(
                '/v1/hlj/product/pos/menu-move',
                () => {},
                'POST',
                {
                    storeId,
                    productId: active.id,
                    fromMenuId: menuId || '',
                    toMenuId: moveTo,
                },
                true,
            );
            invalidateCatalog(storeId);
            toast.success(tPos('manage.dish_moved'), {position: 'top-center'});
            setMoveOpen(false);
            setActive(null);
            setMenuId(moveTo);
            await reload();
        } catch {
        } finally {
            setSaving(false);
        }
    };

    const saveMenu = async () => {
        if (!menuName.trim()) {
            toast.warning(tPos('manage.recipe_name_required'), {position: 'top-center'});
            return;
        }
        setSaving(true);
        try {
            const data = await fetchData(
                '/v1/hlj/product/pos/menu-create',
                () => {},
                'POST',
                {storeId, name: menuName.trim()},
                true,
            );
            const mid = await bindMenuIfNeeded(data as QuickResult);
            invalidateCatalog(storeId);
            toast.success(tPos('manage.recipe_created'), {position: 'top-center'});
            setMenuOpen(false);
            setMenuName('');
            await reload();
            if (mid) setMenuId(mid);
        } catch {
        } finally {
            setSaving(false);
        }
    };

    const dishFormFields = (rich: boolean) => (
        <>
            <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.dish_name')}</Typography>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} sx={{mb: 2}}>
                <TextField
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={tPos('manage.dish_name_ph')}
                    inputProps={{style: {fontSize: 20}}}
                />
                <VoiceFillButton onText={setName} />
            </Stack>
            <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.dish_price')}</Typography>
            <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{minHeight: 56, justifyContent: 'flex-start', px: 2, mb: 1}}
                onClick={() => setPricePad(true)}
            >
                ¥ {price}
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                {tPos('manage.dish_defaults_hint')}
            </Typography>
            <Button size="large" onClick={() => setShowMore((v) => !v)}>
                {showMore ? tPos('manage.hide_more') : tPos('manage.show_more')}
            </Button>
            {showMore && (
                <Box sx={{mt: 1}}>
                    <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.dish_category')}</Typography>
                    <TouchChipSelect options={categoryOptions} value={category} onChange={setCategory} />
                    {rich && (
                        <>
                            <Alert severity="info" sx={{my: 2}}>{tPos('manage.dish_filled')}</Alert>
                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} sx={{mb: 2}}>
                                <Box sx={{flex: 1}}>
                                    <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.dish_stock')}</Typography>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        size="large"
                                        sx={{minHeight: 56, justifyContent: 'flex-start', px: 2}}
                                        onClick={() => setStockPad(true)}
                                    >
                                        {stock}
                                    </Button>
                                    <Typography variant="caption" color="text.secondary">{tPos('manage.dish_stock_hint')}</Typography>
                                </Box>
                                <Box sx={{flex: 1}}>
                                    <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.dish_pack')}</Typography>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        size="large"
                                        sx={{minHeight: 56, justifyContent: 'flex-start', px: 2}}
                                        onClick={() => setPackPad(true)}
                                    >
                                        ¥ {packCost}
                                    </Button>
                                </Box>
                            </Stack>
                            <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.dish_unit')}</Typography>
                            <Box sx={{mb: 2}}>
                                <TouchChipSelect options={DISH_UNITS} value={unit} onChange={setUnit} />
                            </Box>
                            <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.dish_min_buy')}</Typography>
                            <Box sx={{mb: 2}}>
                                <TouchChipSelect options={MIN_BUY_OPTIONS} value={minBuy} onChange={setMinBuy} />
                            </Box>
                            <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.dish_sale')}</Typography>
                            <Box sx={{mb: 2}}>
                                <TouchChipSelect
                                    options={[saleOn, saleOff]}
                                    value={isSell ? saleOn : saleOff}
                                    onChange={(next) => setIsSell(next === saleOn)}
                                />
                            </Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 1}}>
                                <Typography fontWeight={700} sx={{flex: 1}}>{tPos('manage.dish_intro')}</Typography>
                                <Button size="small" onClick={() => setIntroTouched(false)} disabled={aiBusy}>
                                    {tPos('manage.dish_intro_reset')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<AutoAwesomeIcon />}
                                    disabled={aiBusy}
                                    onClick={writeIntro}
                                    sx={{minHeight: 44}}
                                >
                                    {aiBusy ? tPos('manage.dish_intro_ai_busy') : tPos('manage.dish_intro_ai')}
                                </Button>
                            </Stack>
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                value={intro}
                                placeholder={tPos('manage.dish_intro_ph')}
                                onChange={(e) => {
                                    setIntroTouched(true);
                                    setIntro(e.target.value);
                                }}
                                sx={{mb: 2}}
                                inputProps={{style: {fontSize: 18}}}
                            />
                            <Typography fontWeight={700} sx={{mb: 0.5}}>{tPos('manage.dish_image')}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{display: 'block', mb: 1}}>
                                {imagePick ? tPos('manage.dish_image_custom') : tPos('manage.dish_image_default')}
                            </Typography>
                            <DishImagePicker category={category} picked={imagePick} onPick={setImagePick} />
                        </>
                    )}
                </Box>
            )}
        </>
    );

    if (!storeId) {
        return (
            <Box sx={{p: 3, maxWidth: 720, mx: 'auto'}}>
                <Alert severity="warning" sx={{mb: 2}}>{tPos('manage.need_store')}</Alert>
                <Button variant="contained" size="large" onClick={() => navigate('/manage/store')}>
                    {tPos('manage.go_store')}
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{p: {xs: 2, md: 3}, maxWidth: 960, mx: 'auto', pb: 14}}>
            {alertComponent}
            <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2}}>
                <RestaurantMenuIcon color="primary" />
                <Typography variant="h5" fontWeight={800}>{tPos('manage.dish_title')}</Typography>
                <Box sx={{flex: 1}} />
                <Button size="large" onClick={() => reload()}>{tPos('manage.refresh')}</Button>
                <Button size="large" onClick={() => navigate('/')}>{tPos('manage.back_pos')}</Button>
            </Stack>

            <Card sx={{mb: 2}}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 1}}>
                        <Typography fontWeight={700}>{tPos('manage.recipe_hint')}</Typography>
                        <Box sx={{flex: 1}} />
                        <Button size="large" variant="outlined" onClick={() => { setMenuName(''); setMenuOpen(true); }}>
                            {tPos('manage.recipe_add')}
                        </Button>
                    </Stack>
                    {menus.length === 0 ? (
                        <Typography color="text.secondary">{tPos('manage.recipe_empty')}</Typography>
                    ) : (
                        <TouchChipSelect
                            options={menuOptions}
                            value={selectedMenuName}
                            onChange={(n) => setMenuId(menuNameToId[n] || '')}
                        />
                    )}
                </CardContent>
            </Card>

            {loading && <Typography color="text.secondary">{tPos('manage.loading')}</Typography>}
            {!loading && (
                <Card>
                    <List>
                        {products.length === 0 && (
                            <ListItem>
                                <ListItemText primary={tPos('manage.dish_empty')} />
                            </ListItem>
                        )}
                        {products.map((p) => (
                            <ListItem
                                key={p.id}
                                divider
                                sx={{minHeight: 76, alignItems: 'flex-start', py: 1.5}}
                                secondaryAction={
                                    <Stack direction="row" spacing={1}>
                                        <Button size="large" onClick={() => openEdit(p)}>{tPos('manage.action_edit')}</Button>
                                        <Button size="large" onClick={() => openMove(p)} disabled={menus.length < 2}>{tPos('manage.action_move')}</Button>
                                        <Button size="large" color="error" onClick={() => setDeleteTarget(p)}>{tPos('manage.action_delete')}</Button>
                                    </Stack>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        src={p.cover_img || undefined}
                                        variant="rounded"
                                        sx={{width: 56, height: 56, bgcolor: 'primary.light'}}
                                    >
                                        {(p.name || '?').slice(0, 1)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Stack direction="row" alignItems="baseline" spacing={1}>
                                            <Typography fontWeight={700} fontSize={18}>{p.name}</Typography>
                                            <Typography fontWeight={800} fontSize={20}>¥{Number(p.price).toFixed(2)}</Typography>
                                        </Stack>
                                    }
                                    secondary={
                                        <Typography component="span" variant="body2" color="text.secondary" noWrap>
                                            {tPos('manage.dish_stock_short', {
                                                unit: p.unit || DEFAULT_UNIT,
                                                stock: p.stock ?? 0,
                                            })}
                                            {' · '}
                                            {p.is_sell ? tPos('manage.on_sale') : tPos('manage.off_sale')}
                                            {p.content ? ` · ${p.content}` : ''}
                                        </Typography>
                                    }
                                    sx={{pr: {xs: 16, sm: 28}}}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            )}

            <Box sx={{position: 'fixed', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', px: 2, gap: 2}}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={openAdd}
                    sx={{minHeight: 64, minWidth: 280, fontSize: 20, fontWeight: 800}}
                >
                    {tPos('manage.dish_add')}
                </Button>
            </Box>

            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="md" scroll="paper">
                <DialogTitle>{tPos('manage.dish_add')}</DialogTitle>
                <DialogContent dividers>{dishFormFields(true)}</DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button size="large" onClick={() => setAddOpen(false)}>{tPos('manage.cancel')}</Button>
                    <Button size="large" variant="contained" disabled={saving || aiBusy} onClick={saveDish} sx={{minHeight: 56, minWidth: 140}}>
                        {tPos('manage.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{tPos('manage.dish_edit')}</DialogTitle>
                <DialogContent dividers>
                    {dishFormFields(false)}
                    <FormControlLabel
                        sx={{mt: 2}}
                        control={<Switch checked={isSell} onChange={(e) => setIsSell(e.target.checked)} />}
                        label={isSell ? tPos('manage.on_sale') : tPos('manage.off_sale')}
                    />
                </DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button size="large" onClick={() => setEditOpen(false)}>{tPos('manage.cancel')}</Button>
                    <Button size="large" variant="contained" disabled={saving} onClick={saveEdit} sx={{minHeight: 56, minWidth: 140}}>
                        {tPos('manage.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={moveOpen} onClose={() => setMoveOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{tPos('manage.dish_move')}</DialogTitle>
                <DialogContent dividers>
                    <Typography sx={{mb: 2}}>{active?.name}</Typography>
                    <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.move_target')}</Typography>
                    <TouchChipSelect
                        options={menus.filter((m) => m.id !== menuId).map((m) => m.name)}
                        value={menus.find((m) => m.id === moveTo)?.name || ''}
                        onChange={(n) => setMoveTo(menuNameToId[n] || '')}
                    />
                </DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button size="large" onClick={() => setMoveOpen(false)}>{tPos('manage.cancel')}</Button>
                    <Button size="large" variant="contained" disabled={saving || !moveTo} onClick={saveMove} sx={{minHeight: 56, minWidth: 140}}>
                        {tPos('manage.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{tPos('manage.recipe_add')}</DialogTitle>
                <DialogContent dividers>
                    <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.recipe_name')}</Typography>
                    <TextField
                        fullWidth
                        value={menuName}
                        onChange={(e) => setMenuName(e.target.value)}
                        placeholder={tPos('manage.recipe_name_ph')}
                        inputProps={{style: {fontSize: 20}}}
                    />
                </DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button size="large" onClick={() => setMenuOpen(false)}>{tPos('manage.cancel')}</Button>
                    <Button size="large" variant="contained" disabled={saving} onClick={saveMenu} sx={{minHeight: 56, minWidth: 140}}>
                        {tPos('manage.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} fullWidth maxWidth="xs">
                <DialogTitle>{tPos('manage.dish_delete')}</DialogTitle>
                <DialogContent dividers>
                    <Typography>{tPos('manage.dish_delete_confirm', {name: deleteTarget?.name || ''})}</Typography>
                </DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button size="large" onClick={() => setDeleteTarget(null)}>{tPos('manage.cancel')}</Button>
                    <Button size="large" color="error" variant="contained" disabled={saving} onClick={confirmDelete} sx={{minHeight: 56}}>
                        {tPos('manage.delete')}
                    </Button>
                </DialogActions>
            </Dialog>

            <NumericKeyboardDialog
                open={pricePad}
                setOpen={setPricePad}
                type="money"
                title={tPos('manage.dish_price')}
                max={99999}
                defaultValue={price}
                onSave={(v) => setPrice(v || '0')}
            />
            <NumericKeyboardDialog
                open={stockPad}
                setOpen={setStockPad}
                type="number"
                title={tPos('manage.dish_stock')}
                min={0}
                max={99999}
                defaultValue={stock}
                onSave={(v) => setStock(v || '0')}
            />
            <NumericKeyboardDialog
                open={packPad}
                setOpen={setPackPad}
                type="money"
                title={tPos('manage.dish_pack')}
                max={9999}
                defaultValue={packCost}
                onSave={(v) => setPackCost(v || '0')}
            />
        </Box>
    );
}
