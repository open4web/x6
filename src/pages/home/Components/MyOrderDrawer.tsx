import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { useCartContext } from "../../../dataProvider/MyCartProvider";
import MyOrder from "./MyOrder";
import { orderSaleStatusMap, orderStatusMap } from "../../../common/orderStatus";
import { payMethodList } from "../../../common/payMethod";
import { Badge, Button, FormControlLabel, InputAdornment } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import GradingIcon from '@mui/icons-material/Grading';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export default function MyOrderDrawer() {
    const { orderDrawerOpen, setOrderDrawerOpen } = useCartContext();

    // 用于触发 MyOrder 重新加载的 key
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    // 当抽屉打开时，自动刷新最近一天的订单
    React.useEffect(() => {
        if (orderDrawerOpen) {
            console.log("📌 订单抽屉已打开 → 自动刷新最近一天订单");
            setRefreshTrigger(prev => prev + 1);
        }
    }, [orderDrawerOpen]);

    // ==================== 时间处理 ====================
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
        return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    };

    const now = getShanghaiTime();
    const today = formatDateTime(new Date(now.setHours(0, 0, 0, 0)));
    const formattedNow = formatDateTime(getShanghaiTime());

    const [onlyMyOrder, setOnlyMyOrder] = React.useState<boolean>(true);
    const [status, setStatus] = React.useState<number>(1);
    const [saleStatus, setSaleStatus] = React.useState<number>(1);
    const [source, setSource] = React.useState<number>(4);
    const [totalRecord, setTotalRecord] = React.useState<number>(4);
    const [startDate, setStartDate] = React.useState<string>(today);
    const [endDate, setEndDate] = React.useState<string>(formattedNow);
    const [orderNo, setOrderNo] = React.useState<string>('');

    const toggleDrawer = (newOpen: boolean) => () => {
        setOrderDrawerOpen(newOpen);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value.toUpperCase();
        console.log("搜索订单:", searchTerm);
        setOrderNo(searchTerm);
        setSaleStatus(-1);
        setSource(-1);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStatus = event.target.value;
        console.log("订单状态:", selectedStatus);
        setStatus(Number(selectedStatus));
        setSaleStatus(-1);
        setSource(-1);
    };

    const handleSaleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStatus = event.target.value;
        console.log("销售状态:", selectedStatus);
        setSaleStatus(Number(selectedStatus));
        setSource(-1);
        setStatus(-1);
    };

    const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStatus = event.target.value;
        console.log("订单来源:", selectedStatus);
        setSource(Number(selectedStatus));
        setSaleStatus(-1);
    };

    const handleQuickFilter = (days: number) => () => {
        const now = getShanghaiTime();
        const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        setStartDate(formatDateTime(pastDate));
        setEndDate(formatDateTime(now));
    };

    const handleDateChange = (type: "start" | "end") => (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = event.target.value;
        const parts = inputDate.split(":");
        const hasSeconds = parts.length === 3;

        if (type === "start") {
            const formattedDate = hasSeconds ? inputDate.replace("T", " ") : inputDate.replace("T", " ") + ":00";
            setStartDate(formattedDate);
        } else {
            const formattedDate = hasSeconds ? inputDate.replace("T", " ") : inputDate.replace("T", " ") + ":59";
            setEndDate(formattedDate);
        }
    };

    const handleClearOrderNo = () => {
        setOrderNo("");
    };

    const handleOnlyMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOnlyMyOrder(event.target.checked);
    };

    return (
        <div>
            <Drawer open={orderDrawerOpen} onClose={toggleDrawer(false)} elevation={2} anchor="bottom">
                {/* 搜索框和过滤条件 - 完全保持你原来的样式 */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "right",
                        padding: "6px 5px",
                        borderBottom: "1px solid",
                        flexWrap: "nowrap",
                        overflowX: "auto",
                        gap: 2,
                    }}
                >
                    <Badge badgeContent={totalRecord} color="primary">
                        <GradingIcon color="inherit" />
                    </Badge>
                    <Box component="span" sx={{ flex: 1 }} />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch checked={onlyMyOrder} onChange={handleOnlyMeChange} name="antoine"/>
                            }
                            label="我的"
                        />
                    </FormGroup>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="搜索订单..."
                            value={orderNo}
                            onChange={handleSearch}
                            sx={{
                                flexGrow: 1,
                                maxWidth: "300px",
                                borderRadius: "4px",
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="medium"
                                            color="error"
                                            onClick={handleClearOrderNo}
                                        >
                                            <SearchOffIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
                        <TextField
                            select
                            label="销售状态"
                            value={saleStatus}
                            onChange={handleSaleStatusChange}
                            size="small"
                            sx={{ minWidth: "150px", flexShrink: 0 }}
                        >
                            {orderSaleStatusMap.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
                        <TextField
                            select
                            label="订单状态"
                            value={status}
                            onChange={handleStatusChange}
                            size="small"
                            sx={{ minWidth: "150px", flexShrink: 0 }}
                        >
                            {orderStatusMap.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
                        <TextField
                            select
                            label="订单来源"
                            value={source}
                            onChange={handleSourceChange}
                            size="small"
                            sx={{ minWidth: "150px", flexShrink: 0 }}
                        >
                            {payMethodList.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
                        <TextField
                            label="开始时间"
                            type="datetime-local"
                            value={startDate}
                            onChange={handleDateChange("start")}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: "200px", flexShrink: 0 }}
                        />
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
                        <TextField
                            label="结束时间"
                            type="datetime-local"
                            value={endDate}
                            onChange={handleDateChange("end")}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: "200px", flexShrink: 0 }}
                        />
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Button variant="contained" color="secondary" size="small" onClick={handleQuickFilter(3)}>近3天</Button>
                        <Button variant="contained" color="success" size="small" onClick={handleQuickFilter(7)}>近7天</Button>
                        <Button variant="contained" color="warning" size="small" onClick={handleQuickFilter(15)}>近15天</Button>
                        <Button variant="contained" color="error" size="small" onClick={handleQuickFilter(30)}>近30天</Button>
                    </Box>
                </Box>

                {/* ==================== 订单列表区域 ==================== */}
                <Box sx={{ padding: 2 }}>
                    <MyOrder
                        key={refreshTrigger}           // 关键：抽屉打开时触发刷新
                        orderNo={orderNo}
                        phoneNumber={""}
                        status={status}
                        source={source}
                        startDate={startDate}
                        endDate={endDate}
                        onlyMyOrder={onlyMyOrder}
                        setTotalRecord={setTotalRecord}
                        saleStatus={saleStatus}
                    />
                </Box>
            </Drawer>
        </div>
    );
}