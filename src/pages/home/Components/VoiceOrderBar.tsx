import * as React from 'react';
import {Box, Button, CircularProgress, IconButton, TextField, Tooltip} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SearchIcon from '@mui/icons-material/Search';
import {toast} from 'react-toastify';
import {isVoiceSupported, listenOnce} from '../../../utils/voiceInput';
import {tPos} from '../../../i18n/t';

type Props = {
    busy?: boolean;
    onTranscript: (text: string) => void | Promise<void>;
};

export default function VoiceOrderBar({busy, onTranscript}: Props) {
    const [listening, setListening] = React.useState(false);
    const [manual, setManual] = React.useState('');
    const supported = isVoiceSupported();

    const submit = async (text: string) => {
        const trimmed = String(text || '').trim();
        if (!trimmed) {
            toast.info(tPos('voice.empty'), {position: 'top-center'});
            return;
        }
        await onTranscript(trimmed);
    };

    const onMic = async () => {
        if (!supported) {
            toast.info(tPos('voice.unsupported'), {position: 'top-center'});
            return;
        }
        setListening(true);
        try {
            const text = await listenOnce();
            if (text) {
                setManual(text);
                await submit(text);
            }
        } catch {
            toast.warning(tPos('voice.failed'), {position: 'top-center'});
        } finally {
            setListening(false);
        }
    };

    const disabled = Boolean(busy || listening);

    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0}}>
            <Tooltip title={supported ? tPos('voice.hint') : tPos('voice.unsupported')}>
                <span>
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={disabled}
                        onClick={onMic}
                        startIcon={listening || busy ? <CircularProgress size={22} color="inherit" /> : <MicIcon />}
                        sx={{minHeight: 56, minWidth: 112, px: 2, fontSize: '1.05rem', fontWeight: 700}}
                    >
                        {listening ? tPos('voice.listening') : busy ? tPos('voice.matching') : tPos('voice.order')}
                    </Button>
                </span>
            </Tooltip>
            <TextField
                size="small"
                value={manual}
                disabled={disabled}
                onChange={(e) => setManual(e.target.value)}
                placeholder={tPos('voice.manual_ph')}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        void submit(manual);
                    }
                }}
                sx={{
                    minWidth: 160,
                    '& .MuiInputBase-root': {minHeight: 56, fontSize: '1.05rem'},
                }}
            />
            <IconButton
                color="primary"
                disabled={disabled || !manual.trim()}
                onClick={() => void submit(manual)}
                sx={{width: 56, height: 56}}
                aria-label={tPos('voice.search')}
            >
                <SearchIcon fontSize="large" />
            </IconButton>
        </Box>
    );
}
