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
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
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

type CatalogProduct = {
    id: string;
    name: string;
    price: number;
    is_sell: boolean;
    category_id: string;
    stock?: number;
    content?: string;
    unit?: string;
    cover_img?: string;
};

type CatalogLite = {
    categories?: {id: string; name: string}[];
    products?: CatalogProduct[];
    presets?: string[];
};

export default function DishManagePage() {
    const navigate = useNavigate();
    const {fetchData, alertComponent} = useFetchData();
    const {merchantId} = useCartContext();
    const storeId = merchantId || localStorage.getItem('current_store_id') || '';
    const [catalog, setCatalog] = React.useState<CatalogLite | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('0');
    const [category, setCategory] = React.useState('热菜');
    const [stock, setStock] = React.useState(String(DEFAULT_STOCK));
    const [unit, setUnit] = React.useState(DEFAULT_UNIT);
    const [onSale, setOnSale] = React.useState(true);
    const [packCost, setPackCost] = React.useState(DEFAULT_PACK);
    const [minBuy, setMinBuy] = React.useState(String(DEFAULT_MIN_BUY));
    const [intro, setIntro] = React.useState('');
    const [introTouched, setIntroTouched] = React.useState(false);
    const [imagePick, setImagePick] = React.useState('');
    const [pricePad, setPricePad] = React.useState(false);
    const [stockPad, setStockPad] = React.useState(false);
    const [packPad, setPackPad] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [aiBusy, setAiBusy] = React.useState(false);

    const categoryOptions = React.useMemo(() => {
        const fromApi = (catalog?.categories || []).map((c) => c.name).filter(Boolean);
        const presets = catalog?.presets || ['热菜', '凉菜', '主食', '汤', '饮品', '小食', '套餐', '其他'];
        return Array.from(new Set([...fromApi, ...presets]));
    }, [catalog]);

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
        if (categoryOptions.length && !categoryOptions.includes(category)) {
            setCategory(categoryOptions[0]);
        }
    }, [categoryOptions, category]);

    React.useEffect(() => {
        if (!open || introTouched) return;
        setIntro(fallbackIntro(name, category));
    }, [open, introTouched, name, category]);

    const resetDraft = () => {
        setName('');
        setPrice('0');
        setStock(String(DEFAULT_STOCK));
        setUnit(DEFAULT_UNIT);
        setOnSale(true);
        setPackCost(DEFAULT_PACK);
        setMinBuy(String(DEFAULT_MIN_BUY));
        setIntro('');
        setIntroTouched(false);
        setImagePick('');
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
                {name: name.trim(), categoryName: category},
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
                    categoryName: category,
                    categoryId: matched?.id || '',
                    stock: stockNum,
                    unit,
                    isSell: onSale,
                    packCost: packNum.toFixed(2),
                    minBuyNum,
                    content: intro.trim() || fallbackIntro(name, category),
                    coverImg: cover,
                },
                true,
            );
            const menuId = String((data as {menuId?: string})?.menuId || '');
            if ((data as {needBindMenu?: boolean})?.needBindMenu && menuId) {
                await fetchData(
                    '/v1/hlj/store/pos/bind-menu',
                    () => {},
                    'POST',
                    {storeId, menuId},
                    true,
                );
            }
            invalidateCatalog(storeId);
            toast.success(tPos('manage.dish_created'), {position: 'top-center'});
            setOpen(false);
            resetDraft();
            await reload();
        } catch {
            // alert via fetchData
        } finally {
            setSaving(false);
        }
    };

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
        <Box sx={{p: {xs: 2, md: 3}, maxWidth: 960, mx: 'auto', pb: 12}}>
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
                    <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.dish_category_hint')}</Typography>
                    <TouchChipSelect options={categoryOptions} value={category} onChange={setCategory} />
                </CardContent>
            </Card>

            {loading && <Typography color="text.secondary">{tPos('manage.loading')}</Typography>}
            {!loading && (
                <Card>
                    <List>
                        {(catalog?.products || []).length === 0 && (
                            <ListItem>
                                <ListItemText primary={tPos('manage.dish_empty')} />
                            </ListItem>
                        )}
                        {(catalog?.products || []).map((p) => (
                            <ListItem key={p.id} divider sx={{minHeight: 76}}>
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
                                    primary={<Typography fontWeight={700} fontSize={18}>{p.name}</Typography>}
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
                                />
                                <Typography fontWeight={800} fontSize={20}>¥{Number(p.price).toFixed(2)}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            )}

            <Box sx={{position: 'fixed', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', px: 2}}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => setOpen(true)}
                    sx={{minHeight: 64, minWidth: 280, fontSize: 20, fontWeight: 800}}
                >
                    {tPos('manage.dish_add')}
                </Button>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" scroll="paper">
                <DialogTitle>{tPos('manage.dish_add')}</DialogTitle>
                <DialogContent dividers>
                    <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.dish_category')}</Typography>
                    <TouchChipSelect options={categoryOptions} value={category} onChange={setCategory} />
                    <Typography fontWeight={700} sx={{mt: 2, mb: 1}}>{tPos('manage.dish_name')}</Typography>
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
                        sx={{minHeight: 56, justifyContent: 'flex-start', px: 2, mb: 2}}
                        onClick={() => setPricePad(true)}
                    >
                        ¥ {price}
                    </Button>

                    <Alert severity="info" sx={{mb: 2}}>{tPos('manage.dish_filled')}</Alert>

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
                            value={onSale ? saleOn : saleOff}
                            onChange={(next) => setOnSale(next === saleOn)}
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
                </DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button size="large" onClick={() => setOpen(false)}>{tPos('manage.cancel')}</Button>
                    <Button size="large" variant="contained" disabled={saving || aiBusy} onClick={saveDish} sx={{minHeight: 56, minWidth: 140}}>
                        {tPos('manage.save')}
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
