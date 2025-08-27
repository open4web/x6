import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import {useCartContext} from "../../../dataProvider/MyCartProvider";
import MyOrder from "./MyOrder";
import {orderSaleStatusMap, orderStatusMap} from "../../../common/orderStatus";
import {platformTypeLists} from "../../../common/payMethod";
import {Badge, Button, FormControlLabel, InputAdornment} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import GradingIcon from '@mui/icons-material/Grading';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export default function MyOrderDrawer() {
    const {orderDrawerOpen, setOrderDrawerOpen} = useCartContext();

    // 获取中国上海时区当前时间
    const getShanghaiTime = () => {
        const now = new Date();
        const shanghaiTime = new Date(
            now.toLocaleString("en-US", {timeZone: "Asia/Shanghai"})
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
    const today = formatDateTime(new Date(now.setHours(0, 0, 0, 0))); // 开始时间：当天00:00
    const formattedNow = formatDateTime(getShanghaiTime()); // 当前时间作为结束时间
    const [onlyMyOrder, setOnlyMyOrder] = React.useState<boolean>(true);
    const [status, setStatus] = React.useState<number>(1);
    const [saleStatus, setSaleStatus] = React.useState<number>(1);
    // setSource
    const [source, setSource] = React.useState<number>(4);
    const [totalRecord, setTotalRecord] = React.useState<number>(4);
    const [startDate, setStartDate] = React.useState<string>(today);
    const [endDate, setEndDate] = React.useState<string>(formattedNow);
    const [orderNo, setOrderNo] = React.useState<string>('');
    const toggleDrawer = (newOpen: boolean) => () => {
        setOrderDrawerOpen(newOpen);
    };

    const handleSearch = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        const searchTermWithUpper = searchTerm.toUpperCase();
        console.log(`搜索${type === "order" ? "订单" : "会员"}:`, searchTermWithUpper);
        // 在此添加搜索逻辑
        setOrderNo(searchTermWithUpper)
        // 清除销售状态过滤
        setSaleStatus(-1)
        setSource(-1)
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStatus = event.target.value;
        console.log("订单状态:", selectedStatus);

        setStatus(Number(selectedStatus));
        // 在此添加状态过滤逻辑

        // 清除销售状态过滤
        setSaleStatus(-1)
        setSource(-1)

    };

    // 销售状态： 售前，售后
    const handleSaleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStatus = event.target.value;
        console.log("订单状态:", selectedStatus);

        setSaleStatus(Number(selectedStatus));
        // 在此添加状态过滤逻辑
        setSource(-1)
        setStatus(-1)
    };

    // handleSourceChange
    const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStatus = event.target.value;
        console.log("订单来源:", selectedStatus);

        setSource(Number(selectedStatus));
        // 在此添加状态过滤逻辑
        // 清除销售状态过滤
        setSaleStatus(-1)
    };

    const handleQuickFilter = (days: number) => () => {
        const now = getShanghaiTime();
        const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000); // 计算过去的时间
        setStartDate(formatDateTime(pastDate));
        setEndDate(formatDateTime(now));
        console.log(`筛选最近${days}天:`, formatDateTime(pastDate), "到", formatDateTime(now));
    };

    const handleDateChange = (type: "start" | "end") => (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = event.target.value; // 用户输入的值 (格式: YYYY-MM-DDTHH:mm 或 YYYY-MM-DDTHH:mm:ss)
        const parts = inputDate.split(":"); // 分割时间部分

        // 如果输入值已经包含秒部分，不进行修改
        const hasSeconds = parts.length === 3;

        if (type === "start") {
            const formattedDate = hasSeconds ? inputDate.replace("T", " ") : inputDate.replace("T", " ") + ":00"; // 添加秒数为 00
            setStartDate(formattedDate);
            console.log("格式化后的开始日期:", formattedDate);
        } else {
            const formattedDate = hasSeconds ? inputDate.replace("T", " ") : inputDate.replace("T", " ") + ":59"; // 添加秒数为 59
            setEndDate(formattedDate);
            console.log("格式化后的结束日期:", formattedDate);
        }


    };

    const handleClearOrderNo = () => {
        setOrderNo(""); // 重置订单号为空
        console.log("订单号已清空");
        // 清除销售状态过滤
        setSaleStatus(-1)
        setSource(-1)
    };

    const handleOnlyMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        console.log("订单设置:", isChecked ? "只看我的" : "全部订单");

        setOnlyMyOrder(isChecked);
        // 清除销售状态过滤
        setSaleStatus(-1)

    };


    return (
        <div>
            <Drawer open={orderDrawerOpen} onClose={toggleDrawer(false)} elevation={2} anchor="bottom">
                {/* 搜索框和过滤条件 */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "right",
                        padding: "6px 5px",
                        borderBottom: "1px solid",
                        flexWrap: "nowrap", // 确保所有元素在同一行
                        overflowX: "auto", // 当空间不足时允许滚动
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
                            label="只看我的"
                        />
                    </FormGroup>

                    {/* 订单搜索框 */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="搜索订单..."
                            value={orderNo}
                            onChange={handleSearch("order")}
                            sx={{
                                flexGrow: 1,
                                maxWidth: "300px", // 限制最大宽度
                                borderRadius: "4px",
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="medium"
                                            color="error"
                                            onClick={handleClearOrderNo} // 清空订单号
                                        >
                                            <SearchOffIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
                        {/* 订单状态筛选 */}
                        <TextField
                            select
                            label="销售状态"
                            value={saleStatus}
                            onChange={handleSaleStatusChange}
                            size="small"
                            sx={{
                                minWidth: "150px",
                                flexShrink: 0,
                            }}
                        >
                            {orderSaleStatusMap.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
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
                            {orderStatusMap.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    {/* 订单来源筛选 */}
                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
                        <TextField
                            select
                            label="订单来源"
                            value={source}
                            onChange={handleSourceChange}
                            size="small"
                            sx={{
                                minWidth: "150px",
                                flexShrink: 0,
                            }}
                        >
                            {platformTypeLists.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
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
                    </Box>
                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
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

                    {/* 快捷筛选按钮 */}
                    <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Button
                            variant="contained"
                            color={"secondary"}
                            size="small"
                            onClick={handleQuickFilter(3)}
                        >
                            最近3天
                        </Button>
                        <Button
                            variant="contained"
                            color={"success"}
                            size="small"
                            onClick={handleQuickFilter(7)}
                        >
                            最近7天
                        </Button>
                    </Box>

                </Box>

                {/* 订单内容
                orderNo, phoneNumber, status, startDate, endDate
                */}
                <Box sx={{padding: 2}}>
                    <MyOrder orderNo={orderNo} phoneNumber={""} status={status} source={source} startDate={startDate}
                             endDate={endDate} onlyMyOrder={onlyMyOrder} setTotalRecord={setTotalRecord} saleStatus={saleStatus}/>
                </Box>
            </Drawer>
        </div>
    );
}