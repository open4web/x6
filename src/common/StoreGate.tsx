import * as React from 'react';
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {useLogout, useTranslate} from 'react-admin';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useFetchData} from './FetchData';
import {useCartContext} from '../dataProvider/MyCartProvider';
import {CachedStore, unwrapStoreList, writeStores} from '../utils/storeCache';
import {readPersistedCart} from '../utils/cartPersist';
import {canManageStoreAndDishes} from '../utils/posRole';
import {isStoreGateExempt, readSavedStoreId, resolveStorePick, saveStoreId} from '../utils/storePick';
import {StoreOption} from './StoreOption';

const STORE_LIST_PATH = '/v1/hlj/store/list';

type GatePhase = 'loading' | 'ready' | 'pick' | 'empty' | 'error';

type StoreGateValue = {
    phase: GatePhase;
    stores: CachedStore[];
    // 已校验过权限的门店；为空表示还没选，依赖门店的检查和接口都不要发。
    storeId: string;
    chooseStore: (id: string) => void;
    reload: () => void;
};

const fallback: StoreGateValue = {
    phase: 'loading',
    stores: [],
    storeId: '',
    chooseStore: () => undefined,
    reload: () => undefined,
};

const StoreGateContext = React.createContext<StoreGateValue>(fallback);

export const useStoreGate = () => React.useContext(StoreGateContext);

/**
 * 进入点餐前先确定门店。
 * 1. 拉取当前账号有权限的门店（store-api 按店长过滤）。
 * 2. 本机已存门店仍在列表里就沿用；不在了就清掉。
 * 3. 只有一家时自动选中；多家时弹出不可关闭的选择框；一家都没有时提示联系管理员。
 * 选好之前 merchantId 保持为空，交接班核对、打印机检查、菜单等依赖门店的请求都不会发出。
 */
export function StoreGate({children}: {children: React.ReactNode}) {
    const translate = useTranslate();
    const logout = useLogout();
    const navigate = useNavigate();
    const location = useLocation();
    const {merchantId, setMerchantId, setCartItems} = useCartContext();
    const {fetchData} = useFetchData();
    // 重新登录时上一位账号的门店还留在内存里：先清空再渲染子组件，避免旧门店的检查先跑起来。
    const [armed, setArmed] = React.useState(() => !merchantId);
    const [phase, setPhase] = React.useState<GatePhase>('loading');
    const [stores, setStores] = React.useState<CachedStore[]>([]);
    const committedRef = React.useRef('');
    const ticketRef = React.useRef(0);

    React.useEffect(() => {
        if (armed) {
            return;
        }
        setMerchantId('');
        setArmed(true);
    }, [armed, setMerchantId]);

    const commit = React.useCallback((id: string) => {
        if (!id) {
            return;
        }
        if (id !== readSavedStoreId()) {
            // 换店时不要把上一家店的购物车带过来。
            setCartItems(readPersistedCart(id)?.items || []);
        }
        saveStoreId(id);
        committedRef.current = id;
        setMerchantId(id);
        setPhase('ready');
    }, [setCartItems, setMerchantId]);

    const load = React.useCallback(async () => {
        const ticket = ++ticketRef.current;
        setPhase('loading');
        try {
            const body = await fetchData(STORE_LIST_PATH, () => undefined, 'GET', {}, true);
            if (ticket !== ticketRef.current) {
                return;
            }
            const list = unwrapStoreList(body).filter(store => store?.id);
            setStores(list);
            writeStores(list);
            const pick = resolveStorePick(readSavedStoreId(), list);
            if (pick.kind === 'keep') {
                commit(pick.id);
                return;
            }
            if (pick.kind === 'auto') {
                commit(pick.id);
                const name = list.find(store => store.id === pick.id)?.name || '';
                toast.info(translate('pos.store.gate_auto', {name, _: 'Store selected: %{name}'}), {
                    position: 'top-center',
                    autoClose: 2200,
                    toastId: 'store-gate-auto',
                });
                return;
            }
            committedRef.current = '';
            saveStoreId('');
            setMerchantId('');
            setPhase(pick.kind === 'empty' ? 'empty' : 'pick');
        } catch {
            if (ticket !== ticketRef.current) {
                return;
            }
            setPhase('error');
        }
    }, [commit, fetchData, setMerchantId, translate]);

    React.useEffect(() => {
        if (!armed) {
            return;
        }
        void load();
    }, [armed, load]);

    // 门店管理页新建或切换门店后，merchantId 会被直接改掉：重新拉一次列表核对权限。
    React.useEffect(() => {
        if (!armed || !merchantId || merchantId === committedRef.current) {
            return;
        }
        void load();
    }, [armed, merchantId, load]);

    const chooseStore = React.useCallback((id: string) => {
        if (!stores.some(store => store.id === id)) {
            return;
        }
        commit(id);
    }, [commit, stores]);

    const value = React.useMemo<StoreGateValue>(() => ({
        phase,
        stores,
        storeId: phase === 'ready' ? merchantId : '',
        chooseStore,
        reload: () => void load(),
    }), [phase, stores, merchantId, chooseStore, load]);

    const exempt = isStoreGateExempt(location.pathname);
    const blocking = armed && !exempt && (phase === 'pick' || phase === 'empty' || phase === 'error');
    const canManage = canManageStoreAndDishes();

    return (
        <StoreGateContext.Provider value={value}>
            {armed ? children : null}
            <Dialog
                open={blocking}
                disableEscapeKeyDown
                onClose={() => undefined}
                fullWidth
                maxWidth="sm"
                aria-labelledby="store-gate-title"
            >
                <DialogTitle id="store-gate-title" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <StorefrontIcon />
                    {phase === 'pick'
                        ? translate('pos.store.gate_title', {_: 'Choose a store'})
                        : phase === 'empty'
                            ? translate('pos.store.gate_empty_title', {_: 'No store access'})
                            : translate('pos.store.gate_error_title', {_: 'Could not load stores'})}
                </DialogTitle>
                <DialogContent dividers>
                    {phase === 'pick' && (
                        <>
                            <Typography variant="body2" sx={{color: 'text.secondary', mb: 1.5}}>
                                {translate('pos.store.gate_hint', {_: 'Pick the store you work at before ordering.'})}
                            </Typography>
                            <Stack spacing={1}>
                                {stores.map(store => (
                                    <Card key={store.id} variant="outlined">
                                        <CardActionArea
                                            sx={{px: 2, py: 1.25}}
                                            onClick={() => chooseStore(store.id)}
                                            data-store-id={store.id}
                                        >
                                            <StoreOption store={store} />
                                        </CardActionArea>
                                    </Card>
                                ))}
                            </Stack>
                        </>
                    )}
                    {phase === 'empty' && (
                        <Typography variant="body1">
                            {translate('pos.store.gate_empty', {_: 'This account has no store access. Please contact an admin.'})}
                        </Typography>
                    )}
                    {phase === 'error' && (
                        <Typography variant="body1">
                            {translate('pos.store.gate_error', {_: 'Store list failed to load. Check the network and try again.'})}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{justifyContent: 'space-between', px: 3}}>
                    <Button color="inherit" onClick={() => logout()}>
                        {translate('pos.store.gate_logout', {_: 'Sign out'})}
                    </Button>
                    <Box sx={{display: 'flex', gap: 1}}>
                        {phase === 'empty' && canManage && (
                            <Button onClick={() => navigate('/manage/store')}>
                                {translate('pos.store.gate_manage', {_: 'Store setup'})}
                            </Button>
                        )}
                        {phase !== 'pick' && (
                            <Button variant="contained" onClick={() => void load()}>
                                {translate('pos.store.gate_retry', {_: 'Try again'})}
                            </Button>
                        )}
                    </Box>
                </DialogActions>
            </Dialog>
            {armed && !exempt && phase === 'loading' && !merchantId ? (
                <Box sx={{position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 1500}}>
                    <CircularProgress size={28} />
                </Box>
            ) : null}
        </StoreGateContext.Provider>
    );
}

export default StoreGate;
