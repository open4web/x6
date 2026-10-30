import * as React from 'react';
import {
    Alert,
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
    ListItemText,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useFetchData} from '../../common/FetchData';
import {useCartContext} from '../../dataProvider/MyCartProvider';
import {invalidateCatalog} from '../../utils/catalogCache';
import {tPos} from '../../i18n/t';
import TouchChipSelect from './components/TouchChipSelect';
import VoiceFillButton from './components/VoiceFillButton';
import NumericKeyboardDialog from '../../common/NumericKeyboardDialog';

type CatalogLite = {
    categories?: {id: string; name: string}[];
    products?: {id: string; name: string; price: number; is_sell: boolean; category_id: string}[];
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
    const [pricePad, setPricePad] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

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
                },
                true,
            );
            const menuId = String((data as any)?.menuId || '');
            if ((data as any)?.needBindMenu && menuId) {
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
            setName('');
            setPrice('0');
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
                            <ListItem key={p.id} divider sx={{minHeight: 64}}>
                                <ListItemText
                                    primary={<Typography fontWeight={700} fontSize={18}>{p.name}</Typography>}
                                    secondary={p.is_sell ? tPos('manage.on_sale') : tPos('manage.off_sale')}
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

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
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
                        sx={{minHeight: 56, justifyContent: 'flex-start', px: 2}}
                        onClick={() => setPricePad(true)}
                    >
                        ¥ {price}
                    </Button>
                </DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button size="large" onClick={() => setOpen(false)}>{tPos('manage.cancel')}</Button>
                    <Button size="large" variant="contained" disabled={saving} onClick={saveDish} sx={{minHeight: 56, minWidth: 140}}>
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
        </Box>
    );
}
