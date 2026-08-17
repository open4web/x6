import React, {useEffect, useState} from 'react';
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
    CircularProgress,
    Button,
} from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    LineChart,
    Line,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip as ChartTooltip,
} from 'recharts';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import {useCartContext} from '../../dataProvider/MyCartProvider';

type NamedAmount = { id: number; name: string; amount: number; count: number; ratio: number };
type NamedCount = { id: number; name: string; count: number; ratio: number };
type HotProduct = { id: string; name: string; count: number; amount: number };
type HourlyPoint = { hour: number; label: string; count: number; amount: number };

type StoreStats = {
    storeId: string;
    date: string;
    summary: {
        orderCount: number;
        paidCount: number;
        unpaidCount: number;
        cancelCount: number;
        refundCount: number;
        itemCount: number;
        salesAmount: number;
        paidAmount: number;
        refundAmount: number;
        avgTicket: number;
        newCustomerCount: number;
        memberOrderCount: number;
        guestOrderCount: number;
    };
    hotProducts: HotProduct[];
    payChannels: NamedAmount[];
    payMethods: NamedAmount[];
    sources: NamedCount[];
    pickups: NamedCount[];
    statuses: NamedCount[];
    hourly: HourlyPoint[];
};

const COLORS = ['#fb8c00', '#2e7d32', '#1976d2', '#7b1fa2', '#d32f2f', '#00897b', '#5d4037', '#546e7a'];

const emptyStats = (): StoreStats => ({
    storeId: '',
    date: '',
    summary: {
        orderCount: 0,
        paidCount: 0,
        unpaidCount: 0,
        cancelCount: 0,
        refundCount: 0,
        itemCount: 0,
        salesAmount: 0,
        paidAmount: 0,
        refundAmount: 0,
        avgTicket: 0,
        newCustomerCount: 0,
        memberOrderCount: 0,
        guestOrderCount: 0,
    },
    hotProducts: [],
    payChannels: [],
    payMethods: [],
    sources: [],
    pickups: [],
    statuses: [],
    hourly: [],
});

const money = (value?: number) => `¥${Number(value || 0).toFixed(2)}`;

async function fetchStoreStats(storeId: string): Promise<StoreStats> {
    const cookie = localStorage.getItem('cookie') || '';
    const today = new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Shanghai'});
    const response = await axios({
        method: 'GET',
        url: '/v1/hlj/order/pos/stats?filter=' + JSON.stringify({storeId, date: today}),
        headers: {
            'Content-Type': 'application/json',
            Cookies: cookie,
            Authorization: cookie,
        },
    });
    return response.data;
}

function KpiCard({label, value, hint}: {label: string; value: string; hint?: string}) {
    return (
        <Card elevation={0} sx={{border: '1px solid #eee', borderRadius: 2, height: '100%'}}>
            <CardContent sx={{py: 1.75, '&:last-child': {pb: 1.75}}}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="h5" sx={{fontWeight: 800, mt: 0.5, letterSpacing: 0.2}}>{value}</Typography>
                {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
            </CardContent>
        </Card>
    );
}

export default function MyDashboard() {
    const {setDataDrawerOpen, merchantId} = useCartContext();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<StoreStats>(emptyStats());
    const [error, setError] = useState('');

    const load = async () => {
        if (!merchantId) {
            setError('未选择门店');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await fetchStoreStats(merchantId);
            setStats(data || emptyStats());
        } catch (e) {
            console.error(e);
            setError('销售数据加载失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [merchantId]);

    const summary = stats.summary;
    const hourly = (stats.hourly || []).filter(item => item.count > 0 || item.amount > 0);

    return (
        <Box sx={{p: 3, maxHeight: '100vh', overflow: 'auto', position: 'relative', bgcolor: '#fafafa'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                <Box>
                    <Typography variant="h5" sx={{fontWeight: 800}}>当日销售</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {stats.date || '今天'} · 当前门店实时汇总
                    </Typography>
                </Box>
                <Box>
                    <Tooltip title="刷新">
                        <IconButton onClick={load} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="关闭">
                        <IconButton onClick={() => setDataDrawerOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {loading && (
                <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && error && (
                <Box sx={{textAlign: 'center', py: 6}}>
                    <Typography color="error" sx={{mb: 2}}>{error}</Typography>
                    <Button variant="contained" onClick={load}>重新加载</Button>
                </Box>
            )}

            {!loading && !error && (
                <Grid container spacing={2}>
                    <Grid item xs={6} md={2.4}>
                        <KpiCard label="实收金额" value={money(summary.paidAmount)} hint={`${summary.paidCount} 笔已支付`} />
                    </Grid>
                    <Grid item xs={6} md={2.4}>
                        <KpiCard label="客单价" value={money(summary.avgTicket)} hint={`共售 ${summary.itemCount} 件`} />
                    </Grid>
                    <Grid item xs={6} md={2.4}>
                        <KpiCard label="订单数" value={String(summary.orderCount)} hint={`待付 ${summary.unpaidCount} · 取消 ${summary.cancelCount}`} />
                    </Grid>
                    <Grid item xs={6} md={2.4}>
                        <KpiCard label="新会员" value={String(summary.newCustomerCount)} hint={`会员单 ${summary.memberOrderCount} · 散客 ${summary.guestOrderCount}`} />
                    </Grid>
                    <Grid item xs={6} md={2.4}>
                        <KpiCard label="退款" value={money(summary.refundAmount)} hint={`${summary.refundCount} 笔`} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{border: '1px solid #eee', borderRadius: 2, height: 320}}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{fontWeight: 700, mb: 1}}>支付渠道金额</Typography>
                                {stats.payChannels.length === 0 ? (
                                    <Typography color="text.secondary">暂无支付数据</Typography>
                                ) : (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie data={stats.payChannels} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name, ratio}) => `${name} ${ratio}%`}>
                                                {stats.payChannels.map((entry, index) => (
                                                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip formatter={(value: number) => money(value)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{border: '1px solid #eee', borderRadius: 2, height: 320}}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{fontWeight: 700, mb: 1}}>热销产品</Typography>
                                {stats.hotProducts.length === 0 ? (
                                    <Typography color="text.secondary">暂无热销数据</Typography>
                                ) : (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <BarChart data={stats.hotProducts} layout="vertical" margin={{left: 16}}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis type="category" dataKey="name" width={80} />
                                            <ChartTooltip />
                                            <Bar dataKey="count" name="销量" fill="#fb8c00" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{border: '1px solid #eee', borderRadius: 2, height: 320}}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{fontWeight: 700, mb: 1}}>分时销售额</Typography>
                                {hourly.length === 0 ? (
                                    <Typography color="text.secondary">暂无分时数据</Typography>
                                ) : (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <LineChart data={hourly}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="label" />
                                            <YAxis />
                                            <ChartTooltip formatter={(value: number) => money(value)} />
                                            <Line type="monotone" dataKey="amount" name="金额" stroke="#1976d2" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{border: '1px solid #eee', borderRadius: 2}}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{fontWeight: 700, mb: 1}}>热销明细</Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>商品</TableCell>
                                            <TableCell align="right">销量</TableCell>
                                            <TableCell align="right">金额</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stats.hotProducts.map(item => (
                                            <TableRow key={item.id || item.name}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell align="right">{item.count}</TableCell>
                                                <TableCell align="right">{money(item.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                        {stats.hotProducts.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3}>暂无数据</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{border: '1px solid #eee', borderRadius: 2}}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{fontWeight: 700, mb: 1}}>来源 / 取餐 / 状态</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        {(stats.sources || []).map(item => (
                                            <Typography key={item.name} variant="body2" sx={{mb: 0.75}}>
                                                {item.name} {item.count}（{item.ratio}%）
                                            </Typography>
                                        ))}
                                    </Grid>
                                    <Grid item xs={4}>
                                        {(stats.pickups || []).map(item => (
                                            <Typography key={item.name} variant="body2" sx={{mb: 0.75}}>
                                                {item.name} {item.count}（{item.ratio}%）
                                            </Typography>
                                        ))}
                                    </Grid>
                                    <Grid item xs={4}>
                                        {(stats.statuses || []).slice(0, 6).map(item => (
                                            <Typography key={item.name} variant="body2" sx={{mb: 0.75}}>
                                                {item.name.replace(/（.*）/, '').replace(/订单/, '')} {item.count}
                                            </Typography>
                                        ))}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
