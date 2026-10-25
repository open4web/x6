import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    Typography,
} from "@mui/material";
import {useTranslate} from "react-admin";
import {playPosSound} from "../utils/touchSound";

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
    due?: number;
    seat?: string;
    wide?: boolean;
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
    minWidth: 0,
    minHeight: {xs: 64, sm: 76},
    p: 0,
    fontSize: 28,
    fontWeight: 800,
    borderRadius: 2,
    lineHeight: 1,
    touchAction: "manipulation",
};

function DigitSlots({value, length}: {value: string; length: number}) {
    return (
        <Box sx={{display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap"}}>
            {Array.from({length}, (_, index) => (
                <Box
                    key={index}
                    sx={{
                        width: 56,
                        height: 68,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor: value[index] ? "primary.main" : "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 32,
                        fontWeight: 800,
                    }}
                >
                    {value[index] || ""}
                </Box>
            ))}
        </Box>
    );
}

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
        due,
        seat,
        wide = false,
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
    const received = type === "money" && hasNumber ? parsed : 0;
    const dueNumber = due != null && Number.isFinite(due) ? due : null;
    const short = dueNumber != null && hasNumber && received + 0.001 < dueNumber;
    const change = dueNumber != null && hasNumber ? Math.max(0, received - dueNumber) : 0;
    const showSlots = requiredLength != null && requiredLength > 0 && requiredLength <= 8;

    const handleNumberClick = (num: string) => {
        if (type === "money") {
            setInputValue((prev) => {
                if (num === ".") {
                    if (prev.includes(".")) return prev;
                    return prev === "" ? "0." : prev + ".";
                }
                const next = prev === "0" ? num : prev + num;
                if (!/^\d*\.?\d*$/.test(next)) return prev;
                const dot = next.indexOf(".");
                if (dot >= 0 && next.length - dot - 1 > 2) return prev;
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

    const pressDigit = (num: string) => {
        playPosSound("key");
        handleNumberClick(num);
    };

    const renderDisplay = () => {
        if (showSlots) {
            return <DigitSlots value={inputValue} length={requiredLength || 0} />;
        }
        if (type === "money" && dueNumber != null) {
            return (
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        {translate('pos.pay.wait_pay')}
                    </Typography>
                    <Typography sx={{fontSize: 22, fontWeight: 700}}>
                        ¥{dueNumber.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{display: "block", mt: 1.5}}>
                        {translate('pos.pay.received', {_: '实收'})}
                    </Typography>
                    <Typography sx={{fontSize: {xs: 40, sm: 48}, fontWeight: 800, lineHeight: 1.05, textAlign: "right"}}>
                        ¥{inputValue || "0"}
                    </Typography>
                    <Typography
                        sx={{
                            mt: 1,
                            fontWeight: 800,
                            fontSize: 20,
                            color: !hasNumber ? "text.secondary" : short ? "error.main" : "success.main",
                        }}
                    >
                        {!hasNumber
                            ? `${translate('pos.pay.change', {_: '找零'})} ¥0.00`
                            : short
                                ? `${translate('pos.pay.short', {_: '还差'})} ¥${(dueNumber - received).toFixed(2)}`
                                : `${translate('pos.pay.change', {_: '找零'})} ¥${change.toFixed(2)}`}
                    </Typography>
                </Box>
            );
        }
        return (
            <Box
                sx={{
                    minHeight: 84,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor: error ? "error.main" : "divider",
                    bgcolor: "action.hover",
                }}
            >
                {type === "money" && (
                    <Typography sx={{fontSize: 32, fontWeight: 800, mr: 0.5}}>¥</Typography>
                )}
                <Typography sx={{fontSize: {xs: 36, sm: 44}, fontWeight: 800, letterSpacing: type === "money" ? 0 : 2}}>
                    {inputValue || (type === "money" ? "0" : "—")}
                </Typography>
            </Box>
        );
    };

    const renderKeys = () => {
        const keys = type === "money"
            ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"]
            : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];
        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1.25,
                    width: "100%",
                    maxWidth: wide ? "none" : 420,
                    mx: wide ? 0 : "auto",
                }}
            >
                {keys.map((key) => {
                    const muted = key === "C" || key === "⌫" || key === ".";
                    return (
                        <Button
                            key={key}
                            variant={muted ? "outlined" : "contained"}
                            color={muted ? "inherit" : "primary"}
                            disableElevation
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                                if (key === "⌫") {
                                    playPosSound("key");
                                    handleDelete();
                                    return;
                                }
                                if (key === "C") {
                                    playPosSound("tap");
                                    handleClear();
                                    return;
                                }
                                pressDigit(key);
                            }}
                            sx={{
                                ...keySx,
                                fontSize: key === "⌫" || key === "C" ? 22 : 30,
                            }}
                        >
                            {key === "C" ? clearText : key}
                        </Button>
                    );
                })}
            </Box>
        );
    };

    const renderActions = () => (
        <Box sx={{display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 1.25, mt: 1.5}}>
            <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                    playPosSound("tap");
                    handleCancel();
                }}
                sx={{minHeight: 60, fontSize: 18, fontWeight: 700}}
            >
                {translate('pos.keypad.cancel')}
            </Button>
            <Button
                onClick={() => {
                    if (!canSubmit) {
                        playPosSound("warn");
                        return;
                    }
                    handleSave();
                }}
                color="success"
                variant="contained"
                disabled={!canSubmit}
                sx={{minHeight: 60, fontSize: 18, fontWeight: 800}}
            >
                {confirmText}
            </Button>
        </Box>
    );

    const split = wide || dueNumber != null || Boolean(seat);
    const KeyboardContent = (
        <Box>
            {seat ? (
                <Box sx={{mb: 1.5, p: 1.5, borderRadius: 2, bgcolor: "action.hover", display: split ? {md: "none"} : "block"}}>
                    <Typography variant="caption" color="text.secondary">
                        {translate('pos.pay.seat', {_: '座位号'})}
                    </Typography>
                    <Typography sx={{fontSize: 28, fontWeight: 800, lineHeight: 1.1}}>
                        {seat}
                    </Typography>
                </Box>
            ) : null}
            <Box
                sx={{
                    display: "grid",
                    gap: 2,
                    alignItems: "center",
                    gridTemplateColumns: split ? {xs: "1fr", md: "minmax(200px, 260px) minmax(280px, 1fr)"} : "1fr",
                }}
            >
                <Box>
                    {seat ? (
                        <Box sx={{display: split ? {xs: "none", md: "block"} : "none", mb: 2, p: 1.5, borderRadius: 2, bgcolor: "action.hover"}}>
                            <Typography variant="caption" color="text.secondary">
                                {translate('pos.pay.seat', {_: '座位号'})}
                            </Typography>
                            <Typography sx={{fontSize: 36, fontWeight: 800, lineHeight: 1.1}}>
                                {seat}
                            </Typography>
                        </Box>
                    ) : null}
                    {renderDisplay()}
                    {error && (
                        <Typography color="error" variant="body2" sx={{mt: 1}}>
                            {translate('pos.keypad.range', {min, max})}
                        </Typography>
                    )}
                </Box>
                <Box>
                    {renderKeys()}
                    {renderActions()}
                </Box>
            </Box>
        </Box>
    );

    if (inline) {
        return <Box sx={{pt: 0.5}}>{KeyboardContent}</Box>;
    }

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
            <DialogTitle sx={{fontWeight: 800, fontSize: 22}}>{title}</DialogTitle>
            <DialogContent>{KeyboardContent}</DialogContent>
        </Dialog>
    );
}
