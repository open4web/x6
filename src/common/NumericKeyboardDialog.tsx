import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
} from "@mui/material";

interface Props {
    open: boolean; // 传入的 open 状态
    setOpen: React.Dispatch<React.SetStateAction<boolean>>; // 用于更新 open 状态的函数
    onSave: (value: string) => void; // 保存时触发的回调函数，接收一个字符串参数
    title?: string; // 可选的标题参数
}

export default function NumericKeyboardDialog(props: Props) {
    const { open, setOpen, onSave, title = "请输入数字" } = props; // 设置默认标题
    const [inputValue, setInputValue] = useState("");

    // 数字按钮点击事件
    const handleNumberClick = (num: string) => {
        setInputValue((prev) => prev + num);
    };

    // 删除按钮点击事件
    const handleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
    };

    // 清空按钮点击事件
    const handleClear = () => {
        setInputValue("");
    };

    // 保存操作
    const handleSave = () => {
        onSave(inputValue); // 将输入值传递给外部
        setOpen(false); // 关闭弹窗
    };

    // 取消操作
    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>{title}</DialogTitle> {/* 使用传入的标题 */}
            <DialogContent>
                <TextField
                    value={inputValue}
                    fullWidth
                    variant="outlined"
                    inputProps={{ readOnly: true }}
                    placeholder="点击数字键输入"
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
                <Button onClick={handleSave} color="primary">
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    );
}