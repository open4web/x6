import * as React from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Alert, Button, Chip, Stack, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {authHeaders} from '../utils/authToken';
import {tPos} from '../i18n/t';
import {canApply, currentApplication, RoleApplication, RolePreset} from '../auth/roleApplication';

const REQUEST_PATH = '/v1/system/auth/user/role-applications/x6';
async function request(method = 'GET') {
    const res = await fetch(REQUEST_PATH, {
        method, cache: 'no-store', credentials: 'include',
        headers: {...authHeaders(), 'Content-Type': 'application/json'},
        ...(method === 'POST' ? {body: '{}'} : {}),
    });
    if (!res.ok) throw new Error(res.status === 403 ? tPos('access.apply_admin_only') : tPos('access.apply_error'));
    return res.json();
}
export default function X6RoleApplication({onPreset}: {onPreset?: (preset: RolePreset) => void}) {
    const [preset, setPreset] = React.useState<RolePreset | null>(null);
    const [rows, setRows] = React.useState<RoleApplication[]>([]);
    const [busy, setBusy] = React.useState(false);
    const [eligible, setEligible] = React.useState(false);
    const [error, setError] = React.useState('');
    const refresh = React.useCallback(async () => {
        setBusy(true); setError('');
        try { const json = await request(); setPreset(json.preset); onPreset?.(json.preset); setRows(json.applications || []); setEligible(json.eligible === true); }
        catch (e) {setError(e instanceof Error ? e.message : tPos('access.apply_error'));}
        finally {setBusy(false);}
    }, [onPreset]);
    React.useEffect(() => {void refresh();}, [refresh]);
    const apply = async () => {
        setBusy(true); setError('');
        try {await request('POST'); await refresh();}
        catch (e) {setError(e instanceof Error ? e.message : tPos('access.apply_error'));}
        finally {setBusy(false);}
    };
    const active = preset ? currentApplication(rows, preset.version) : undefined;
    const grants = preset?.resources.filter((r) => r.grant) || [];
    return <Stack spacing={1} sx={{mb: 2}}>
        <Alert severity="info">{tPos('access.apply_hint')}</Alert>
        {error && <Alert severity="warning">{error}</Alert>}
        {preset && !eligible && <Alert severity="info">{tPos('access.apply_admin_only')}</Alert>}
        <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
            <Button variant="contained" disabled={busy || !eligible || !preset || !canApply(active)} onClick={apply}>
                {tPos('access.apply_button')}
            </Button>
            <Button disabled={busy} onClick={refresh}>{tPos('access.apply_refresh')}</Button>
            {active && <Chip label={tPos(`access.apply_status_${active.status}`)} color={active.status === 'bound' ? 'success' : 'default'} />}
            {preset && <Typography variant="caption">{preset.version}</Typography>}
        </Stack>
        {active?.status === 'rejected' && <Alert severity="warning">{active.audit.filter((e) => e.action === 'reject').slice(-1)[0]?.reason}</Alert>}
        {rows.some((r) => r.status === 'bound' && r.preset.version !== preset?.version) && <Alert severity="warning">{tPos('access.apply_old_version')}</Alert>}
        {preset && <Accordion disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{tPos('access.apply_preview', {n: grants.length})}</AccordionSummary>
            <AccordionDetails>
                {grants.map((r) => <Typography key={r.path} variant="caption" component="div" sx={{fontFamily: 'monospace', overflowWrap: 'anywhere'}}>
                    {r.calls.map((c) => `${c.method}${c.single ? ' /:id' : ''}`).join(', ')} · attr={r.attr} · {r.path}
                </Typography>)}
                <Typography variant="body2" sx={{mt: 1}}>{tPos('access.apply_excluded')}</Typography>
            </AccordionDetails>
        </Accordion>}
    </Stack>;
}
