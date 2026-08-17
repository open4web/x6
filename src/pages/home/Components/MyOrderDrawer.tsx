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
import {useTranslate} from 'react-admin';

export default function MyOrderDrawer() {
    const { orderDrawerOpen, setOrderDrawerOpen, highlightOrderNo } = useCartContext();
    const translate = useTranslate();

    // 用于触发 MyOrder 重新加载的 key
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

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
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const getTodayRange = () => {
        const now = getShanghaiTime();
        const start = formatDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
        const end = formatDateTime(getShanghaiTime());
        return {start, end};
    };

    const todayRange = getTodayRange();

    const [onlyMyOrder, setOnlyMyOrder] = React.useState<boolean>(true);
    const [status, setStatus] = React.useState<number>(-1);
    const [saleStatus, setSaleStatus] = React.useState<number>(0);
    const [source, setSource] = React.useState<number>(-1);
    const [totalRecord, setTotalRecord] = React.useState<number>(4);
    const [startDate, setStartDate] = React.useState<string>(todayRange.start);
    const [endDate, setEndDate] = React.useState<string>(todayRange.end);
    const [orderNo, setOrderNo] = React.useState<string>('');

    // 每次打开订单图标：查当天最新订单
    React.useEffect(() => {
        if (!orderDrawerOpen) {
            return;
        }
        const {start, end} = getTodayRange();
        setStartDate(start);
        setEndDate(end);
        setOrderNo('');
        setSaleStatus(0);
        setStatus(-1);
        setSource(-1);
        setRefreshTrigger(prev => prev + 1);
    }, [orderDrawerOpen]);

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
        if (days === 0) {
            const {start, end} = getTodayRange();
            setStartDate(start);
            setEndDate(end);
            return;
        }
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
                        gap: 1,
                    }}
                >
                    <Badge badgeContent={totalRecord} color="primary">
                        <GradingIcon color="inherit" />
                    </Badge>
                    <Box component="span" sx={{ flex: 1 }} />
                    <FormGroup sx={{flexShrink: 0}}>
                        <FormControlLabel
                            sx={{
                                m: 0,
                                whiteSpace: 'nowrap',
                                '& .MuiFormControlLabel-label': {whiteSpace: 'nowrap'},
                            }}
                            control={
                                <Switch checked={onlyMyOrder} onChange={handleOnlyMeChange} name="antoine"/>
                            }
                            label={translate('pos.list.mine')}
                        />
                    </FormGroup>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder={translate('pos.list.search')}
                        value={orderNo}
                        onChange={handleSearch}
                        sx={{
                            width: 180,
                            flexShrink: 0,
                            '& .MuiInputBase-input': {whiteSpace: 'nowrap'},
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

                    <TextField
                        select
                        label={translate('pos.list.sale_status')}
                        value={saleStatus}
                        onChange={handleSaleStatusChange}
                        size="small"
                        InputLabelProps={{sx: {whiteSpace: 'nowrap'}}}
                        sx={{minWidth: 108, flexShrink: 0, '& .MuiSelect-select': {whiteSpace: 'nowrap'}}}
                    >
                        {orderSaleStatusMap.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {translate(`pos.sale_status.${item.id}`, {_: item.name})}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label={translate('pos.list.order_status')}
                        value={status}
                        onChange={handleStatusChange}
                        size="small"
                        InputLabelProps={{sx: {whiteSpace: 'nowrap'}}}
                        sx={{minWidth: 108, flexShrink: 0, '& .MuiSelect-select': {whiteSpace: 'nowrap'}}}
                    >
                        {orderStatusMap.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {translate(`pos.status.${item.id}`, {_: item.name})}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label={translate('pos.list.source')}
                        value={source}
                        onChange={handleSourceChange}
                        size="small"
                        InputLabelProps={{sx: {whiteSpace: 'nowrap'}}}
                        sx={{minWidth: 108, flexShrink: 0, '& .MuiSelect-select': {whiteSpace: 'nowrap'}}}
                    >
                        {payMethodList.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {translate(`pos.source.${item.id}`, {_: item.name})}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label={translate('pos.list.start')}
                        type="datetime-local"
                        value={startDate}
                        onChange={handleDateChange("start")}
                        size="small"
                        InputLabelProps={{shrink: true, sx: {whiteSpace: 'nowrap'}}}
                        sx={{minWidth: 188, flexShrink: 0}}
                    />

                    <TextField
                        label={translate('pos.list.end')}
                        type="datetime-local"
                        value={endDate}
                        onChange={handleDateChange("end")}
                        size="small"
                        InputLabelProps={{shrink: true, sx: {whiteSpace: 'nowrap'}}}
                        sx={{minWidth: 188, flexShrink: 0}}
                    />

                    <Box sx={{display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0}}>
                        {[
                            {days: 0, color: 'primary' as const, label: translate('pos.list.today')},
                            {days: 3, color: 'secondary' as const, label: translate('pos.list.last_days', {days: 3})},
                            {days: 7, color: 'success' as const, label: translate('pos.list.last_days', {days: 7})},
                            {days: 15, color: 'warning' as const, label: translate('pos.list.last_days', {days: 15})},
                            {days: 30, color: 'error' as const, label: translate('pos.list.last_days', {days: 30})},
                        ].map(item => (
                            <Button
                                key={item.days}
                                variant="contained"
                                color={item.color}
                                size="small"
                                onClick={handleQuickFilter(item.days)}
                                sx={{whiteSpace: 'nowrap', minWidth: 0, px: 1, flexShrink: 0, lineHeight: 1.5}}
                            >
                                {item.label}
                            </Button>
                        ))}
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