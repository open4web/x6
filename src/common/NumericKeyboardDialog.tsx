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

    // 🚀 新增：按钮文案（可选）
    confirmText?: string;
    clearText?: string;
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
        defaultValue = "",

        // 🚀 默认值（关键）
        confirmText = "保存",
        clearText = "清空",
    } = props;

    const [inputValue, setInputValue] = useState(defaultValue);
    const [error, setError] = useState(false);

    const updateInputValue = (newValue: string) => {
        const numericValue = parseInt(newValue, 10);

        if (
            newValue === "" ||
            (numericValue >= min && numericValue <= max)
        ) {
            setError(false);
        } else {
            setError(true);
        }

        setInputValue(newValue);
    };

    const handleNumberClick = (num: string) => {
        updateInputValue(inputValue + num);
    };

    const handleDelete = () => {
        updateInputValue(inputValue.slice(0, -1));
    };

    const handleClear = () => {
        updateInputValue("");
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

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <TextField
                    value={inputValue}
                    fullWidth
                    variant="outlined"
                    inputProps={{ readOnly: true }}
                    placeholder={title}
                    error={error}
                    helperText={error ? `请输入 ${min} 到 ${max} 之间的数字` : " "}
                    InputProps={{
                        endAdornment: isValidLength && (
                            <InputAdornment position="end">
                                <CheckIcon color="success" />
                            </InputAdornment>
                        ),
                    }}
                />

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
            </DialogContent>

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
        </Dialog>
    );
}