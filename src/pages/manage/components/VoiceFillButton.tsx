import * as React from 'react';
import {Button, Tooltip} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import {toast} from 'react-toastify';
import {isVoiceSupported, listenOnce} from '../../../utils/voiceInput';
import {tPos} from '../../../i18n/t';

type Props = {
    onText: (text: string) => void;
    disabled?: boolean;
};

export default function VoiceFillButton({onText, disabled}: Props) {
    const [busy, setBusy] = React.useState(false);
    const supported = isVoiceSupported();

    const onClick = async () => {
        if (!supported) {
            toast.info(tPos('manage.voice_unsupported'), {position: 'top-center'});
            return;
        }
        setBusy(true);
        try {
            const text = await listenOnce();
            if (text) onText(text);
        } catch {
            toast.warning(tPos('manage.voice_failed'), {position: 'top-center'});
        } finally {
            setBusy(false);
        }
    };

    return (
        <Tooltip title={supported ? tPos('manage.voice_hint') : tPos('manage.voice_unsupported')}>
            <span>
                <Button
                    variant="outlined"
                    size="large"
                    disabled={disabled || busy || !supported}
                    onClick={onClick}
                    startIcon={<MicIcon />}
                    sx={{minHeight: 56, px: 2}}
                >
                    {busy ? tPos('manage.voice_listening') : tPos('manage.voice')}
                </Button>
            </span>
        </Tooltip>
    );
}
