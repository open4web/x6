import * as React from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useFetchData} from '../../common/FetchData';
import {useCartContext} from '../../dataProvider/MyCartProvider';
import {tPos} from '../../i18n/t';
import TouchChipSelect from './components/TouchChipSelect';
import VoiceFillButton from './components/VoiceFillButton';
import NumericKeyboardDialog from '../../common/NumericKeyboardDialog';

const STORE_CATEGORIES = ['餐饮', '奶茶', '烧烤', '面馆', '咖啡', '小吃', '其他'];

type OnboardDTO = {
    count: number;
    can_create: boolean;
    store?: {
        id: string;
        name: string;
        status?: number;
        phone?: string;
        address?: string;
        category?: string;
    };
};

export default function StoreManagePage() {
    const navigate = useNavigate();
    const {fetchData, alertComponent} = useFetchData();
    const {setMerchantId} = useCartContext();
    const [loading, setLoading] = React.useState(true);
    const [onboard, setOnboard] = React.useState<OnboardDTO | null>(null);
    const [name, setName] = React.useState('');
    const [category, setCategory] = React.useState(STORE_CATEGORIES[0]);
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [phonePad, setPhonePad] = React.useState(false);

    const reload = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchData('/v1/hlj/store/pos/onboard', () => {}, 'GET', {}, true);
            setOnboard(data as OnboardDTO);
        } catch {
            setOnboard(null);
        } finally {
            setLoading(false);
        }
    }, [fetchData]);

    React.useEffect(() => {
        reload();
    }, [reload]);

    const selectStore = (id: string) => {
        localStorage.setItem('current_store_id', id);
        setMerchantId(id);
        toast.success(tPos('manage.store_selected'), {position: 'top-center'});
        window.location.replace('/#/');
    };

    const createStore = async () => {
        if (!name.trim()) {
            toast.warning(tPos('manage.store_name_required'), {position: 'top-center'});
            return;
        }
        setSubmitting(true);
        try {
            const data = await fetchData(
                '/v1/hlj/store/pos/quick',
                () => {},
                'POST',
                {
                    name: name.trim(),
                    category,
                    callNumber: phone.trim(),
                    address: address.trim(),
                },
                true,
            );
            const id = String((data as any)?.id || '');
            toast.success(tPos('manage.store_created'), {position: 'top-center'});
            if (id) {
                localStorage.setItem('current_store_id', id);
                setMerchantId(id);
            }
            await reload();
            navigate('/manage/dishes');
        } catch (err: any) {
            const status = err?.response?.status;
            if (status === 409) {
                toast.error(tPos('manage.store_exists'), {position: 'top-center'});
                await reload();
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{p: {xs: 2, md: 3}, maxWidth: 900, mx: 'auto'}}>
            {alertComponent}
            <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2}}>
                <StorefrontIcon color="primary" />
                <Typography variant="h5" fontWeight={800}>{tPos('manage.store_title')}</Typography>
                <Box sx={{flex: 1}} />
                <Button size="large" onClick={() => navigate('/')}>{tPos('manage.back_pos')}</Button>
            </Stack>

            {loading && <Typography color="text.secondary">{tPos('manage.loading')}</Typography>}

            {!loading && onboard && !onboard.can_create && onboard.store && (
                <Card sx={{mb: 2}}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={800}>{onboard.store.name}</Typography>
                        <Typography color="text.secondary" sx={{mt: 1}}>
                            {[onboard.store.category, onboard.store.phone, onboard.store.address].filter(Boolean).join(' · ')}
                        </Typography>
                        <Alert severity="info" sx={{mt: 2}}>{tPos('manage.store_one_only')}</Alert>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{mt: 2, minHeight: 56}}
                            onClick={() => selectStore(onboard.store!.id)}
                        >
                            {tPos('manage.store_use_current')}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {!loading && onboard?.can_create && (
                <Card>
                    <CardContent>
                        <Alert severity="success" sx={{mb: 2}}>{tPos('manage.store_empty_hint')}</Alert>
                        <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.store_name')}</Typography>
                        <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} sx={{mb: 2}}>
                            <TextField
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={tPos('manage.store_name_ph')}
                                inputProps={{style: {fontSize: 20, minHeight: 28}}}
                            />
                            <VoiceFillButton onText={setName} />
                        </Stack>

                        <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.store_category')}</Typography>
                        <TouchChipSelect options={STORE_CATEGORIES} value={category} onChange={setCategory} />

                        <Typography fontWeight={700} sx={{mt: 2, mb: 1}}>{tPos('manage.store_phone')}</Typography>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            sx={{minHeight: 56, justifyContent: 'flex-start', px: 2, mb: 2}}
                            onClick={() => setPhonePad(true)}
                        >
                            {phone || tPos('manage.store_phone_ph')}
                        </Button>

                        <Typography fontWeight={700} sx={{mb: 1}}>{tPos('manage.store_address')}</Typography>
                        <TextField
                            fullWidth
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder={tPos('manage.store_address_ph')}
                            sx={{mb: 2}}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={submitting}
                            onClick={createStore}
                            sx={{minHeight: 56, fontWeight: 800}}
                        >
                            {tPos('manage.store_create')}
                        </Button>
                    </CardContent>
                </Card>
            )}

            <NumericKeyboardDialog
                open={phonePad}
                setOpen={setPhonePad}
                type="number"
                title={tPos('manage.store_phone')}
                max={99999999999}
                defaultValue={phone}
                onSave={(v) => setPhone(v)}
            />
        </Box>
    );
}
