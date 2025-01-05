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
    open: boolean; // 传入的 open 状态
    setOpen: React.Dispatch<React.SetStateAction<boolean>>; // 用于更新 open 状态的函数
    onSave: (value: string) => void; // 保存时触发的回调函数，接收一个字符串参数
    title?: string; // 可选的标题参数
    min?: number; // 最小值限制
    max?: number; // 最大值限制
    requiredLength?: number; // 要求的数字长度
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
    } = props; // 默认值
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(false);

    // 更新输入值的同时检查范围和长度
    const updateInputValue = (newValue: string) => {
        const numericValue = parseInt(newValue, 10);

        if (
            newValue === "" ||
            (numericValue >= min && numericValue <= max)
        ) {
            setError(false); // 输入值在范围内，清除错误
        } else {
            setError(true); // 输入值超出范围，显示错误
        }

        setInputValue(newValue);
    };

    // 数字按钮点击事件
    const handleNumberClick = (num: string) => {
        const newValue = inputValue + num;
        updateInputValue(newValue);
    };

    // 删除按钮点击事件
    const handleDelete = () => {
        const newValue = inputValue.slice(0, -1);
        updateInputValue(newValue);
    };

    // 清空按钮点击事件
    const handleClear = () => {
        updateInputValue("");
    };

    // 保存操作
    const handleSave = () => {
        if (!error && inputValue !== "") {
            onSave(inputValue); // 将输入值传递给外部
            setOpen(false); // 关闭弹窗
        }
    };

    // 取消操作
    const handleCancel = () => {
        setOpen(false);
    };

    const isValidLength = inputValue.length === requiredLength;

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>{title}</DialogTitle> {/* 使用传入的标题 */}
            <DialogContent>
                <TextField
                    value={inputValue}
                    fullWidth
                    variant="outlined"
                    inputProps={{ readOnly: true }}
                    placeholder={title}
                    error={error} // 显示错误状态
                    helperText={error ? `请输入 ${min} 到 ${max} 之间的数字` : " "} // 显示错误提示
                    InputProps={{
                        endAdornment: isValidLength && (
                            <InputAdornment position="end">
                                <CheckIcon color="success" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
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
                        <Button fullWidth variant="contained" color="warning" onClick={handleDelete}>
                            删除
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button fullWidth variant="contained" color="error" onClick={handleClear}>
                            清空
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>取消</Button>
                <Button onClick={handleSave} color="primary" disabled={error || inputValue === ""}>
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    );
}