import React, { useState } from "react";
import { TextField, Box } from "@mui/material";

export default function DateTimeWithSeconds() {
    const [startDate, setStartDate] = useState<string>("");

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "start",
            }}
        >
            <TextField
                label="开始时间"
                type="datetime-local"
                value={startDate}
                onChange={handleDateChange}
                size="small"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 1, // Allows seconds selection
                }}
                sx={{
                    minWidth: "250px",
                }}
            />
            <Box>选择的时间: {startDate || "未选择"}</Box>
        </Box>
    );
}