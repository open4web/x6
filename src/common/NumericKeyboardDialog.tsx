import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputAdornment,
    Box,
    Typography,
} from "@mui/material";
import {useTranslate} from "react-admin";

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: (value: string) => void;
    title?: string;
    min?: number;
    max?: number;
    requiredLength?: number;
    defaultValue?: string | number;
    confirmText?: string;
    clearText?: string;
    inline?: boolean;
    type?: "number" | "money";
}

const emptyDefault = (value?: string | number) => {
    if (value === undefined || value === null || value === "") {
        return "";
    }
    const str = String(value);
    return str === "0" ? "" : str;
};

const keySx = {
    width: "100%",
    aspectRatio: "1 / 1",
    minWidth: 0,
    minHeight: 56,
    p: 0,
    fontSize: {xs: 22, sm: 26},
    fontWeight: 700,
    borderRadius: 1,
    lineHeight: 1,
};

export default function NumericKeyboardDialog(props: Props) {
    const translate = useTranslate();
    const {
        open,
        setOpen,
        onSave,
        title = translate('pos.keypad.title'),
        min = 0,
        max = 100,
        requiredLength,
        defaultValue = "",
        confirmText = translate('pos.keypad.save'),
        clearText = translate('pos.keypad.clear'),
        inline = false,
        type = "number",
    } = props;

    const [inputValue, setInputValue] = useState(() => emptyDefault(defaultValue));

    useEffect(() => {
        if (open) {
            setInputValue(emptyDefault(defaultValue));
        }
    }, [open, defaultValue]);

    const parsed = type === "money" ? parseFloat(inputValue) : parseInt(inputValue, 10);
    const hasNumber = inputValue !== "" && inputValue !== "." && Number.isFinite(parsed);
    const outOfRange = hasNumber && (parsed < min || parsed > max);
    const tooLong = requiredLength != null && inputValue.length > requiredLength;
    const error = outOfRange || tooLong;
    const canSubmit =
        hasNumber &&
        !outOfRange &&
        (requiredLength == null || inputValue.length === requiredLength);

    const handleNumberClick = (num: string) => {
        if (type === "money") {
            setInputValue((prev) => {
                const next = prev === "0" ? num : prev + num;
                if (!/^\d*\.?\d*$/.test(next)) return prev;
                const nextParsed = parseFloat(next);
                if (Number.isFinite(nextParsed) && nextParsed > max) return prev;
                return next;
            });
            return;
        }

        const next = !requiredLength && inputValue === "0" ? num : inputValue + num;
        if (requiredLength != null && next.length > requiredLength) return;
        const nextParsed = parseInt(next, 10);
        if (Number.isFinite(nextParsed) && nextParsed > max) return;
        setInputValue(next);
    };

    const handleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
    };

    const handleClear = () => {
        setInputValue("");
    };

    const handleSave = () => {
        if (!canSubmit) return;
        onSave(inputValue);
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const renderInput = () => (
        <TextField
            value={inputValue}
            fullWidth
            variant="outlined"
            inputProps={{readOnly: true}}
            placeholder={title}
            error={error}
            helperText={error ? translate('pos.keypad.range', {min, max}) : " "}
            InputProps={{
                startAdornment: type === "money" && (
                    <InputAdornment position="start">
                        <Typography sx={{fontSize: 24, fontWeight: "bold"}}>
                            ¥
                        </Typography>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end" sx={{gap: 0.25, mr: -0.5}}>
                        <Button
                            size="small"
                            variant="text"
                            onClick={handleDelete}
                            onMouseDown={(e) => e.preventDefault()}
                            disabled={inputValue === ""}
                            sx={{minWidth: "auto", px: 0.75, whiteSpace: "nowrap"}}
                        >
                            {translate('pos.keypad.delete')}
                        </Button>
                        <Button
                            size="small"
                            color="error"
                            variant="text"
                            onClick={handleClear}
                            onMouseDown={(e) => e.preventDefault()}
                            disabled={inputValue === ""}
                            sx={{minWidth: "auto", px: 0.75, whiteSpace: "nowrap"}}
                        >
                            {clearText}
                        </Button>
                    </InputAdornment>
                ),
                sx: {
                    input: {
                        fontSize: type === "money" ? 32 : 24,
                        fontWeight: 700,
                        textAlign: type === "money" ? "right" : "center",
                        letterSpacing: 1,
                    }
                }
            }}
        />
    );

    const renderKeys = () => (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                mt: 1,
                maxWidth: 280,
                mx: "auto",
            }}
        >
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <Button
                    key={num}
                    variant="contained"
                    disableElevation
                    onClick={() => handleNumberClick(num)}
                    sx={keySx}
                >
                    {num}
                </Button>
            ))}
            <Box />
            <Button
                variant="contained"
                disableElevation
                onClick={() => handleNumberClick("0")}
                sx={keySx}
            >
                0
            </Button>
            <Box />
        </Box>
    );

    const renderActions = () => (
        <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end", width: "100%"}}>
            <Button onClick={handleCancel}>{translate('pos.keypad.cancel')}</Button>
            {canSubmit && (
                <Button
                    onClick={handleSave}
                    color="success"
                    variant="contained"
                >
                    {confirmText}
                </Button>
            )}
        </Box>
    );

    const KeyboardContent = (
        <Box>
            {renderInput()}
            {renderKeys()}
        </Box>
    );

    if (inline) {
        return (
            <Box sx={{p: 2}}>
                {KeyboardContent}
                <Box sx={{mt: 2}}>
                    {renderActions()}
                </Box>
            </Box>
        );
    }

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{KeyboardContent}</DialogContent>
            <DialogActions>{renderActions()}</DialogActions>
        </Dialog>
    );
}
