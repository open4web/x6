import {Box, Button} from '@mui/material';
import {useEffect, useRef} from 'react';
import type {KeyboardEvent} from 'react';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'clear'] as const;

type OtpKeypadProps = {
    value: string;
    onChange: (next: string) => void;
    disabled?: boolean;
    length?: number;
    onPress?: () => void;
    deleteLabel?: string;
    clearLabel?: string;
};

export default function OtpKeypad({
    value,
    onChange,
    disabled,
    length = 6,
    onPress,
    deleteLabel = '删除',
    clearLabel = '清空',
}: OtpKeypadProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.focus();
    }, []);

    const apply = (key: string) => {
        if (disabled) return;
        onPress?.();
        if (key === 'del') {
            onChange(value.slice(0, -1));
            return;
        }
        if (key === 'clear') {
            onChange('');
            return;
        }
        if (value.length >= length) return;
        onChange(`${value}${key}`);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key >= '0' && event.key <= '9') {
            event.preventDefault();
            apply(event.key);
            return;
        }
        if (event.key === 'Backspace') {
            event.preventDefault();
            apply('del');
            return;
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            apply('clear');
        }
    };

    return (
        <Box
            ref={ref}
            tabIndex={0}
            onKeyDown={onKeyDown}
            sx={{outline: 'none', maxWidth: 420, mx: 'auto', mb: 2}}
        >
            <Box sx={{display: 'flex', gap: 1, justifyContent: 'center', mb: 2}} aria-hidden>
                {Array.from({length}, (_, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: {xs: 40, sm: 52},
                            height: {xs: 52, sm: 64},
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: value[index] ? 'primary.main' : 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: {xs: 24, sm: 32},
                            fontWeight: 800,
                        }}
                    >
                        {value[index] || ''}
                    </Box>
                ))}
            </Box>
            <Box
                role="group"
                aria-label="数字键盘"
                sx={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.25}}
            >
                {KEYS.map((key) => {
                    const muted = key === 'del' || key === 'clear';
                    return (
                        <Button
                            key={key}
                            type="button"
                            variant={muted ? 'outlined' : 'contained'}
                            color={muted ? 'inherit' : 'primary'}
                            disableElevation
                            disabled={disabled}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => apply(key)}
                            sx={{
                                minHeight: {xs: 64, sm: 72},
                                p: 0,
                                fontSize: muted ? 18 : 30,
                                fontWeight: 800,
                                borderRadius: 2,
                                lineHeight: 1,
                                touchAction: 'manipulation',
                            }}
                        >
                            {key === 'del' ? deleteLabel : key === 'clear' ? clearLabel : key}
                        </Button>
                    );
                })}
            </Box>
        </Box>
    );
}
