import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MenuItem from "@mui/material/MenuItem";
import { useCartContext } from "../../dataProvider/MyCartProvider";
import MyDashboard from "./MyData";
export default function MyDataDrawer() {
    const { dataDrawerOpen, setDataDrawerOpen } = useCartContext();

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
        return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    };

    const now = getShanghaiTime();
    const today = formatDateTime(new Date(now.setHours(0, 0, 0, 0))); // 开始时间：当天00:00
    const formattedNow = formatDateTime(getShanghaiTime()); // 当前时间作为结束时间
    const [onlyMyOrder, setOnlyMyOrder] = React.useState<boolean>(false);
    const [status, setStatus] = React.useState<number>(1);
    // setSource
    const [source, setSource] = React.useState<number>(4);
    const [startDate, setStartDate] = React.useState<string>(today);
    const [endDate, setEndDate] = React.useState<string>(formattedNow);
    const [orderNo, setOrderNo] = React.useState<string>('');
    const toggleDrawer = (newOpen: boolean) => () => {
        setDataDrawerOpen(newOpen);
    };

    const handleSearch = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        const searchTermWithUpper = searchTerm.toUpperCase();
        console.log(`搜索${type === "order" ? "订单" : "会员"}:`, searchTermWithUpper);
        // 在此添加搜索逻辑
        setOrderNo(searchTermWithUpper)
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStatus = event.target.value;
        console.log("订单状态:", selectedStatus);

        setStatus(Number(selectedStatus));
        // 在此添加状态过滤逻辑
    };

    // handleSourceChange
    const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStatus = event.target.value;
        console.log("订单来源:", selectedStatus);

        setSource(Number(selectedStatus));
        // 在此添加状态过滤逻辑
    };

    const handleDateChange = (type: "start" | "end") => (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = event.target.value; // 用户输入的值 (格式: YYYY-MM-DDTHH:mm)
        const formattedDate = inputDate.replace("T", " "); // 替换 "T" 为 " " 符号

        if (type === "start") {
            setStartDate(formattedDate + ":00"); // 将秒数设置为 00
            console.log("格式化后的开始日期:", formattedDate + ":00");
        } else {
            setEndDate(formattedDate + ":59"); // 将秒数设置为 59
            console.log("格式化后的结束日期:", formattedDate + ":59");
        }
    };

    const handleClearOrderNo = () => {
        setOrderNo(""); // 重置订单号为空
        console.log("订单号已清空");
    };

    const handleOnlyMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        console.log("订单设置:", isChecked ? "只看我的" : "全部订单");

        setOnlyMyOrder(isChecked);
    };


    return (
        <div>
            <Drawer open={dataDrawerOpen} onClose={toggleDrawer(false)} elevation={2} anchor="top">

                {/* 订单内容
                orderNo, phoneNumber, status, startDate, endDate
                */}
                <Box sx={{ padding: 2 }}>
                    <MyDashboard/>
                </Box>
            </Drawer>
        </div>
    );
}