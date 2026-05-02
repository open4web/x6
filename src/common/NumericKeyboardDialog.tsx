import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    InputAdornment,
    Box,
    Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: (value: string) => void;
    title?: string;
    min?: number;
    max?: number;
    requiredLength?: number;
    defaultValue?: string;
    confirmText?: string;
    clearText?: string;
    inline?: boolean;

    // 🚀 新增
    type?: "number" | "money";
}

export default function NumericKeyboardDialog(props: Props) {
    const {
        open,
        setOpen,
        onSave,
        title = "请输入数字",
        min = 0,
        max = 100,
        requiredLength = 5,
        defaultValue = "0",
        confirmText = "保存",
        clearText = "清空",
        inline = false,
        type = "number",
    } = props;

    // 🚀 money 默认 0
    const [inputValue, setInputValue] = useState(
        type === "money" && defaultValue === "" ? "0" : defaultValue
    );

    const [error, setError] = useState(false);

    // ================================
    // 🚀 money 输入控制
    // ================================
    const updateInputValue = (val: string) => {

        if (type === "money") {
            // 只允许数字 + 小数点
            if (!/^\d*\.?\d*$/.test(val)) return;

            // 防止多个点
            const parts = val.split(".");
            if (parts.length > 2) return;

            // 防止空
            if (val === "") val = "0";

            setInputValue(val);
            return;
        }

        // number 模式
        const numericValue = parseInt(val, 10);

        if (
            val === "" ||
            (numericValue >= min && numericValue <= max)
        ) {
            setError(false);
        } else {
            setError(true);
        }

        setInputValue(val);
    };

    const handleNumberClick = (num: string) => {
        if (type === "money") {
            // 防止 0 开头重复
            setInputValue((prev) => {
                if (prev === "0") return num;
                return prev + num;
            });
            return;
        }

        updateInputValue(inputValue + num);
    };

    const handleDelete = () => {
        if (type === "money") {
            setInputValue((prev) => {
                if (prev.length <= 1) return "0";
                return prev.slice(0, -1);
            });
            return;
        }

        updateInputValue(inputValue.slice(0, -1));
    };

    const handleClear = () => {
        setInputValue(type === "money" ? "0" : "");
    };

    const handleSave = () => {
        if (!error && inputValue !== "") {
            onSave(inputValue);
            setOpen(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const isValidLength = inputValue.length === requiredLength;

    // ================================
    // 🚀 输入框 UI
    // ================================
    const renderInput = () => (
        <TextField
            value={inputValue}
            fullWidth
            variant="outlined"
            inputProps={{ readOnly: true }}
            placeholder={title}
            error={error}
            helperText={error ? `请输入 ${min} 到 ${max} 之间的数字` : " "}
            InputProps={{
                startAdornment: type === "money" && (
                    <InputAdornment position="start">
                        <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
                            ¥
                        </Typography>
                    </InputAdornment>
                ),
                endAdornment: isValidLength && (
                    <InputAdornment position="end">
                        <CheckIcon color="success" />
                    </InputAdornment>
                ),
                sx: {
                    input: {
                        fontSize: type === "money" ? 32 : 18,
                        fontWeight: type === "money" ? "bold" : "normal",
                        textAlign: type === "money" ? "right" : "left",
                    }
                }
            }}
        />
    );

    const KeyboardContent = (
        <Box>
            {renderInput()}

            <Grid container spacing={1} sx={{ marginTop: 2 }}>
                {[1,2,3,4,5,6,7,8,9,0].map((num) => (
                    <Grid item xs={4} key={num}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleNumberClick(num.toString())}
                        >
                            {num}
                        </Button>
                    </Grid>
                ))}

                <Grid item xs={4}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="warning"
                        onClick={handleDelete}
                    >
                        删除
                    </Button>
                </Grid>

                <Grid item xs={4}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={handleClear}
                    >
                        {clearText}
                    </Button>
                </Grid>
            </Grid>

            {!inline && (
                <DialogActions>
                    <Button onClick={handleCancel}>取消</Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        disabled={error || inputValue === ""}
                    >
                        {confirmText}
                    </Button>
                </DialogActions>
            )}
        </Box>
    );

    if (inline) {
        return (
            <Box sx={{ p: 2 }}>
                {KeyboardContent}
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button onClick={handleCancel}>取消</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={error || inputValue === ""}
                    >
                        {confirmText}
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{KeyboardContent}</DialogContent>
        </Dialog>
    );
}