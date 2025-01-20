import React from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
} from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import CloseIcon from '@mui/icons-material/Close';
import { useCartContext } from "../../dataProvider/MyCartProvider";

// Sample data
const orders = [
    { source: 4, status: 1, price: { pay_price: 2 }, stp: { created_at: 1737229658 } },
    { source: 2, status: 0, price: { pay_price: 5 }, stp: { created_at: 1737229558 } },
    { source: 3, status: 1, price: { pay_price: 10 }, stp: { created_at: 1737229758 } },
];

// Data for charts
const sourceData = [
    { name: "Source 1", value: orders.filter((o) => o.source === 1).length },
    { name: "Source 2", value: orders.filter((o) => o.source === 2).length },
    { name: "Source 3", value: orders.filter((o) => o.source === 3).length },
    { name: "Source 4", value: orders.filter((o) => o.source === 4).length },
];

const statusData = [
    { name: "Status 0", count: orders.filter((o) => o.status === 0).length },
    { name: "Status 1", count: orders.filter((o) => o.status === 1).length },
];

const priceTrend = orders.map((order) => ({
    time: new Date(order.stp.created_at * 1000).toLocaleTimeString(),
    pay_price: order.price.pay_price,
}));

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function MyDashboard() {
    const { dataDrawerOpen, setDataDrawerOpen } = useCartContext();

    return (
        <Box
            sx={{
                padding: 4,
                maxHeight: "100vh", // Limit the height to fit within the viewport
                overflow: "hidden", // Prevent scrolling
                position: "relative", // For close button positioning
            }}
        >
            {/* Close Button */}
            <IconButton
                aria-label="close"
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 1000,
                }}
                onClick={() => setDataDrawerOpen(false)}
            >
                <Tooltip title="Close">
                    <CloseIcon />
                </Tooltip>
            </IconButton>

            <Typography variant="h4" gutterBottom>
                Order Dashboard
            </Typography>

            <Grid container spacing={4}>
                {/* Pie Chart */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Orders by Source
                            </Typography>
                            <PieChart width={250} height={250}>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Bar Chart */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Orders by Status
                            </Typography>
                            <BarChart width={250} height={250} data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Line Chart */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Pay Price Trend Over Time
                            </Typography>
                            <LineChart width={300} height={250} data={priceTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Line type="monotone" dataKey="pay_price" stroke="#8884d8" />
                            </LineChart>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Order Table */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Order Details
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Source</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Pay Price</TableCell>
                                        <TableCell>Created At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{order.source}</TableCell>
                                            <TableCell>{order.status}</TableCell>
                                            <TableCell>{order.price.pay_price}</TableCell>
                                            <TableCell>
                                                {new Date(order.stp.created_at * 1000).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}