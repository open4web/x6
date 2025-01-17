import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import { useCartContext } from "../../../dataProvider/MyCartProvider";
import MyOrder from "./MyOrder";

export default function MyOrderDrawer() {
    const { orderDrawerOpen, setOrderDrawerOpen } = useCartContext();

    // 获取中国上海时区当前时间
    const getShanghaiTime = () => {
        const now = new Date();
        const shanghaiTime = new Date(
            now.toLocaleString("en-US", { timeZone: "Asia/Shanghai" })
        );
        return shanghaiTime;
    };

    const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const now = getShanghaiTime();
    const today = formatDateTime(new Date(now.setHours(0, 0, 0, 0))); // 开始时间：当天00:00
    const formattedNow = formatDateTime(getShanghaiTime()); // 当前时间作为结束时间

    const [status, setStatus] = React.useState<number>(1);
    const [startDate, setStartDate] = React.useState<string>(today);
    const [endDate, setEndDate] = React.useState<string>(formattedNow);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOrderDrawerOpen(newOpen);
    };

    const handleSearch = (type: "order" | "member") => (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        console.log(`搜索${type === "order" ? "订单" : "会员"}:`, searchTerm);
        // 在此添加搜索逻辑
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStatus = event.target.value;
        console.log("订单状态:", selectedStatus);

        setStatus(Number(selectedStatus));
        // 在此添加状态过滤逻辑
    };

    const handleDateChange = (type: "start" | "end") => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (type === "start") {
            setStartDate(value);
            console.log("开始日期:", value);
        } else {
            setEndDate(value);
            console.log("结束日期:", value);
        }
        // 在此添加时间范围过滤逻辑
    };

    return (
        <div>
            <Drawer open={orderDrawerOpen} onClose={toggleDrawer(false)} elevation={2} anchor="bottom">
                {/* 搜索框和过滤条件 */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 5px",
                        borderBottom: "1px solid",
                        flexWrap: "nowrap", // 确保所有元素在同一行
                        overflowX: "auto", // 当空间不足时允许滚动
                        gap: 0.1,
                    }}
                >
                    {/* 订单搜索框 */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="搜索订单..."
                            onChange={handleSearch("order")}
                            sx={{
                                flexGrow: 1,
                                maxWidth: "300px", // 限制最大宽度
                                borderRadius: "4px",
                            }}
                        />
                        <IconButton
                            size="medium"
                            color="primary"
                            onClick={() => console.log("订单搜索按钮点击")}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>

                    {/* 订单状态筛选 */}
                    <TextField
                        select
                        label="订单状态"
                        value={status}
                        onChange={handleStatusChange}
                        size="small"
                        sx={{
                            minWidth: "150px",
                            flexShrink: 0,
                        }}
                    >
                        <MenuItem value="0">待支付</MenuItem>
                        <MenuItem value="1">已支付</MenuItem>
                        <MenuItem value="2">已发货</MenuItem>
                        <MenuItem value="3">已完成</MenuItem>
                        <MenuItem value="4">已取消</MenuItem>
                    </TextField>

                    {/* 开始时间 */}
                    <TextField
                        label="开始时间"
                        type="datetime-local"
                        value={startDate}
                        onChange={handleDateChange("start")}
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{
                            minWidth: "200px",
                            flexShrink: 0,
                        }}
                    />

                    {/* 结束时间 */}
                    <TextField
                        label="结束时间"
                        type="datetime-local"
                        value={endDate}
                        onChange={handleDateChange("end")}
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{
                            minWidth: "200px",
                            flexShrink: 0,
                        }}
                    />
                </Box>

                {/* 订单内容
                orderNo, phoneNumber, status, startDate, endDate
                */}
                <Box sx={{ padding: 2 }}>
                    <MyOrder orderNo={""} phoneNumber={""} status={status} startDate={startDate} endDate={endDate}/>
                </Box>
            </Drawer>
        </div>
    );
}