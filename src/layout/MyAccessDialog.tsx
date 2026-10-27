import * as React from 'react';
import {useUserMenu} from 'react-admin';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Chip,
    CircularProgress,
    Dialog,
    alpha,
    DialogContent,
    DialogTitle,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloseIcon from '@mui/icons-material/Close';
import {tPos} from '../i18n/t';
import {authHeaders} from '../utils/authToken';
import {grantExceedsX6} from '../auth/scanX6Apis';
import {X6_REQUIRED_APIS} from '../auth/x6RequiredApis';

const ACCESS_PATH = '/v1/system/auth/user/access';

type InspectResource = {
    path: string;
    name_key?: string;
    actions?: string[];
};

type InspectService = {
    key: string;
    name_key?: string;
    resources?: InspectResource[];
};

type InspectRole = {
    id: string;
    name?: string;
    path_count?: number;
};

type InspectDTO = {
    source?: string;
    super?: boolean;
    roles?: InspectRole[];
    services?: InspectService[];
    path_count?: number;
};

type FilterMode = 'all' | 'exceed' | 'needed';

const ACTION_COLOR: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'> = {
    create: 'success',
    delete: 'error',
    update: 'warning',
    read: 'info',
    list: 'primary',
    show: 'secondary',
};

function unwrapAccess(json: any): InspectDTO {
    if (json && Array.isArray(json.services)) return json;
    if (json?.data && Array.isArray(json.data.services)) return json.data;
    if (json?.payload && Array.isArray(json.payload.services)) return json.payload;
    return json || {};
}

async function loadAccess(): Promise<InspectDTO> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...authHeaders(),
    };
    const res = await fetch(ACCESS_PATH, {credentials: 'include', headers});
    if (!res.ok) {
        throw new Error(String(res.status));
    }
    return unwrapAccess(await res.json());
}

function serviceTitle(svc: InspectService): string {
    const key = svc.name_key || '';
    if (!key) return svc.key;
    const label = tPos(key);
    return label === key ? svc.key : label;
}

export const MyAccessMenuItem = React.forwardRef<HTMLLIElement, {onOpen?: () => void} & any>((props, ref) => {
    const {onClose} = useUserMenu();
    const {onOpen, onClick, ...rest} = props;
    return (
        <MenuItem
            ref={ref}
            {...rest}
            onClick={(event) => {
                onClick?.(event);
                onClose?.();
                onOpen?.();
            }}
        >
            <ListItemIcon>
                <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{tPos('access.menu')}</ListItemText>
        </MenuItem>
    );
});

function actionLabel(action: string) {
    const key = `access.perm.${action}`;
    const text = tPos(key);
    return text === key ? action : text;
}

function ResourceLine({row}: {row: InspectResource}) {
    const exceeds = grantExceedsX6(row.path, X6_REQUIRED_APIS);
    return (
        <Box
            sx={{
                py: 1.25,
                px: 1.25,
                borderBottom: '1px solid',
                borderColor: 'divider',
                borderLeft: '4px solid',
                borderLeftColor: exceeds ? 'error.main' : 'success.main',
                bgcolor: (theme) => (exceeds ? alpha(theme.palette.error.main, 0.12) : 'transparent'),
            }}
        >
            <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
                <Box sx={{minWidth: 0}}>
                    <Typography variant="body2" sx={{fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', wordBreak: 'break-all'}}>
                        {row.path}
                    </Typography>
                    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" sx={{mt: 0.75}}>
                        {(row.actions || []).map((action) => (
                            <Chip
                                key={action}
                                size="small"
                                variant="outlined"
                                color={ACTION_COLOR[action] || 'default'}
                                label={actionLabel(action)}
                            />
                        ))}
                        {!row.actions?.length && (
                            <Typography variant="caption" color="text.secondary">-</Typography>
                        )}
                    </Stack>
                </Box>
                <Chip
                    size="small"
                    color={exceeds ? 'error' : 'success'}
                    label={exceeds ? tPos('access.exceed') : tPos('access.needed')}
                    sx={{flexShrink: 0, fontWeight: 700}}
                />
            </Stack>
            {exceeds && (
                <Typography variant="caption" color="error" sx={{display: 'block', mt: 0.5}}>
                    {tPos('access.exceed_hint')}
                </Typography>
            )}
        </Box>
    );
}

export function MyAccessDialog({open, onClose}: {open: boolean; onClose: () => void}) {
    const fullScreen = useMediaQuery('(max-width:600px)');
    const [data, setData] = React.useState<InspectDTO | null>(null);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filter, setFilter] = React.useState<FilterMode>('all');
    const [query, setQuery] = React.useState('');

    React.useEffect(() => {
        if (!open) return;
        let alive = true;
        setLoading(true);
        setError(false);
        setData(null);
        loadAccess()
            .then((json) => {
                if (!alive) return;
                setData(json);
                setLoading(false);
            })
            .catch(() => {
                if (!alive) return;
                setError(true);
                setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [open]);

    const services = data?.services || [];
    const rows = services.flatMap((svc) => svc.resources || []);
    const exceedCount = rows.filter((row) => grantExceedsX6(row.path, X6_REQUIRED_APIS)).length;
    const neededCount = rows.length - exceedCount;
    const q = query.trim().toLowerCase();

    const visibleServices = services
        .map((svc) => {
            const resources = (svc.resources || []).filter((row) => {
                const exceeds = grantExceedsX6(row.path, X6_REQUIRED_APIS);
                if (filter === 'exceed' && !exceeds) return false;
                if (filter === 'needed' && exceeds) return false;
                if (!q) return true;
                return row.path.toLowerCase().includes(q) || (row.name_key || '').toLowerCase().includes(q);
            });
            const ordered = [...resources].sort((a, b) => {
                const ae = grantExceedsX6(a.path, X6_REQUIRED_APIS) ? 0 : 1;
                const be = grantExceedsX6(b.path, X6_REQUIRED_APIS) ? 0 : 1;
                if (ae !== be) return ae - be;
                return a.path.localeCompare(b.path);
            });
            return {...svc, resources: ordered};
        })
        .filter((svc) => svc.resources.length > 0);

    return (
        <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="md">
            <DialogTitle sx={{pr: 6, pb: 1}}>
                {tPos('access.title')}
                <IconButton aria-label={tPos('access.close')} onClick={onClose} sx={{position: 'absolute', right: 8, top: 8}}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{pt: 1.5}}>
                <Alert severity="info" sx={{mb: 1.5}}>
                    {tPos('access.hint')}
                </Alert>
                {loading && (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress size={28} />
                    </Box>
                )}
                {!loading && error && <Alert severity="error">{tPos('access.error')}</Alert>}
                {!loading && !error && data && (
                    <>
                        {data.super && services.length === 0 && (
                            <Alert severity="warning" sx={{mb: 1.5}}>
                                {tPos('access.super')}
                            </Alert>
                        )}
                        {exceedCount > 0 && (
                            <Alert severity="error" sx={{mb: 1.5}}>
                                {tPos('access.exceed_banner', {n: exceedCount})}
                            </Alert>
                        )}
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{mb: 1.5}}>
                            <Chip size="small" variant="outlined" label={tPos('access.source', {source: data.source || 'redis'})} />
                            <Chip size="small" variant="outlined" label={tPos('access.services', {n: services.length})} />
                            <Chip size="small" variant="outlined" label={tPos('access.paths', {n: data.path_count || rows.length})} />
                            <Chip size="small" color="error" variant={exceedCount ? 'filled' : 'outlined'} label={tPos('access.exceed_count', {n: exceedCount})} />
                            <Chip size="small" color="success" variant="outlined" label={tPos('access.needed_count', {n: neededCount})} />
                            <Chip size="small" variant="outlined" label={tPos('access.x6_count', {n: X6_REQUIRED_APIS.length})} />
                            {(data.roles || []).map((role) => (
                                <Chip
                                    key={role.id}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    label={`${role.name || role.id.slice(-6)} · ${role.path_count ?? 0}`}
                                />
                            ))}
                        </Stack>
                        <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} sx={{mb: 1.5}}>
                            <ToggleButtonGroup
                                exclusive
                                size="small"
                                value={filter}
                                onChange={(_, next: FilterMode | null) => next && setFilter(next)}
                            >
                                <ToggleButton value="all">{tPos('access.filter_all')}</ToggleButton>
                                <ToggleButton value="exceed">{tPos('access.filter_exceed')}</ToggleButton>
                                <ToggleButton value="needed">{tPos('access.filter_needed')}</ToggleButton>
                            </ToggleButtonGroup>
                            <TextField
                                size="small"
                                fullWidth
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={tPos('access.search')}
                            />
                        </Stack>
                        {services.length === 0 && !data.super && (
                            <Typography color="text.secondary">{tPos('access.empty')}</Typography>
                        )}
                        {services.length === 0 && data.super && (
                            <Box>
                                <Typography variant="subtitle2" sx={{mb: 1}}>{tPos('access.super_list')}</Typography>
                                {X6_REQUIRED_APIS.map((path) => (
                                    <Typography key={path} variant="body2" sx={{fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', py: 0.25}}>
                                        {path}
                                    </Typography>
                                ))}
                            </Box>
                        )}
                        {visibleServices.length === 0 && services.length > 0 && (
                            <Typography color="text.secondary">{tPos('access.no_match')}</Typography>
                        )}
                        {visibleServices.map((svc) => {
                            const exceedN = svc.resources.filter((row) => grantExceedsX6(row.path, X6_REQUIRED_APIS)).length;
                            return (
                            <Accordion key={svc.key} defaultExpanded disableGutters>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                        <Typography fontWeight={700}>{serviceTitle(svc)}</Typography>
                                        <Chip size="small" variant="outlined" label={svc.resources.length} />
                                        {exceedN > 0 && (
                                            <Chip size="small" color="error" label={tPos('access.exceed_count', {n: exceedN})} />
                                        )}
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails sx={{p: 0}}>
                                    {svc.resources.map((row) => (
                                        <ResourceLine key={row.path} row={row} />
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                            );
                        })}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
