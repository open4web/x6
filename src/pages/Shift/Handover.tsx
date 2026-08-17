import React, {useState, useEffect} from 'react';
import {
    Card,
    Button,
    Form,
    Input,
    InputNumber,
    Table,
    Descriptions,
    Alert,
    Divider,
    Space,
    Tag,
    Modal,
} from 'antd';
import {PrinterOutlined, WarningOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import dayjs from 'dayjs';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import {useCartContext} from '../../dataProvider/MyCartProvider';
import {toast} from 'react-toastify';
import {useFetchData} from '../../common/FetchData';
import {Order, ShiftHandover} from './types';
import {statusInfoMap} from './orderStatus';

const HandoverPageDrawer: React.FC = () => {
    const [form] = Form.useForm();
    const [currentShift, setCurrentShift] = useState<ShiftHandover | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showOpenOrders, setShowOpenOrders] = useState(false);
    const {shiftOpen, setShiftOpen, merchantId, setReady} = useCartContext();
    const {fetchData} = useFetchData();

    const closeDrawer = () => {
        if (submitting) {
            return;
        }
        setShiftOpen(false);
    };

    const loadCurrentShift = async () => {
        setLoading(true);
        try {
            await fetchData('/v1/hlj/finance/shift/' + merchantId, (res: any) => {
                setCurrentShift(res.data);
                form.setFieldsValue({
                    next_cashier: '',
                    closing_cash: res.data.closing_cash,
                    supervisor: '',
                    special_notes: res.data.special_notes,
                });
            }, 'GET', {});
        } catch {
            toast.error('交接数据加载失败');
        } finally {
            setLoading(false);
        }
    };

    const doHandover = async (values: any) => {
        const postData = {
            current: currentShift,
            remark: values.special_notes || '',
            next_cashier: values.next_cashier,
            closing_cash: values.closing_cash,
            supervisor: values.supervisor || '',
            special_notes: values.special_notes || '',
        };

        await fetchData('/v1/hlj/finance/shift/' + merchantId, () => {
            localStorage.removeItem('shiftReadyTime:' + merchantId);
            localStorage.removeItem('shiftReady:' + merchantId);
            setReady(false);
            setShiftOpen(false);
            setCurrentShift(null);
            form.resetFields();
            toast.success('交接成功');
        }, 'POST', postData);
    };

    useEffect(() => {
        if (!shiftOpen) {
            return;
        }
        loadCurrentShift();
    }, [shiftOpen]);

    const handleSubmit = async (values: any) => {
        Modal.confirm({
            title: '确认完成本班交接？',
            content: '提交后当前班次将结束，本机退出值班状态。',
            okText: '确认交接',
            cancelText: '再检查一下',
            onOk: async () => {
                setSubmitting(true);
                try {
                    await doHandover(values);
                } catch {
                    Modal.error({title: '交接失败', content: '请稍后重试'});
                } finally {
                    setSubmitting(false);
                }
            },
        });
    };

    const openOrderColumns: ColumnsType<Order> = [
        {title: '订单号', dataIndex: 'order_id'},
        {title: '桌号', dataIndex: 'table_id'},
        {title: '金额', dataIndex: 'total_amount', render: (v) => `¥${Number(v || 0).toFixed(2)}`},
        {
            title: '状态',
            dataIndex: 'status',
            render: (status: number) => {
                const info = statusInfoMap[status] || {text: `未知(${status})`, color: 'default'};
                return <Tag color={info.color}>{info.text}</Tag>;
            },
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (v) => dayjs(v).format('YY-MM-DD HH:mm'),
        },
    ];

    return (
        <Drawer
            open={shiftOpen}
            onClose={closeDrawer}
            elevation={8}
            anchor="top"
            ModalProps={{keepMounted: false}}
            PaperProps={{
                sx: {
                    height: 'auto',
                    maxHeight: '92vh',
                    overflow: 'auto',
                    borderRadius: '0 0 16px 16px',
                    maxWidth: 980,
                    mx: 'auto',
                    left: 0,
                    right: 0,
                },
            }}
        >
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 1.5,
                    bgcolor: '#fff',
                    borderBottom: '1px solid #eee',
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{fontWeight: 700, lineHeight: 1.2}}>
                        交接班
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        核对账目后交给下一班。不想交了可以直接取消。
                    </Typography>
                </Box>
                <IconButton onClick={closeDrawer} aria-label="关闭交接班" disabled={submitting}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{p: 3}}>
                <Card loading={loading} bordered={false} bodyStyle={{padding: 0}}>
                    {!currentShift && !loading && (
                        <Alert
                            type="warning"
                            message="暂未获取到本班数据"
                            action={<Button size="small" onClick={loadCurrentShift}>重新加载</Button>}
                        />
                    )}

                    {currentShift && (
                        <>
                            <Descriptions bordered column={3} size="small">
                                <Descriptions.Item label="当前收银员">{currentShift.previous_cashier}</Descriptions.Item>
                                <Descriptions.Item label="开始时间">
                                    {currentShift.start_time ? dayjs(currentShift.start_time).format('MM-DD HH:mm') : '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="总订单数">{currentShift.total_orders} 单</Descriptions.Item>
                                <Descriptions.Item label="销售额">
                                    <strong>¥{Number(currentShift.total_sales_amount || 0).toFixed(2)}</strong>
                                </Descriptions.Item>
                                <Descriptions.Item label="总收款">
                                    <strong>¥{Number(currentShift.total_paid_amount || 0).toFixed(2)}</strong>
                                </Descriptions.Item>
                                <Descriptions.Item label="总退款">
                                    <strong>¥{Number(currentShift.total_refund_amount || 0).toFixed(2)}</strong>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                <Form.Item label="下一班收银员" name="next_cashier" rules={[{required: true, message: '请填写下一班收银员'}]}>
                                    <Input placeholder="请输入下一班收银员" style={{width: 320}} />
                                </Form.Item>
                                <Form.Item label="实点现金" name="closing_cash" rules={[{required: true, message: '请填写实点现金'}]}>
                                    <InputNumber style={{width: 320}} precision={2} prefix="¥" />
                                </Form.Item>
                                <Form.Item label="监交人" name="supervisor">
                                    <Input placeholder="可选" style={{width: 320}} />
                                </Form.Item>
                                <Form.Item label="备注" name="special_notes">
                                    <Input.TextArea rows={3} />
                                </Form.Item>

                                <Space wrap>
                                    <Button onClick={closeDrawer} size="large" disabled={submitting}>
                                        取消
                                    </Button>
                                    <Button icon={<PrinterOutlined />} size="large" onClick={() => window.print()}>
                                        打印交接单
                                    </Button>
                                    <Button size="large" onClick={() => setShowOpenOrders(true)}>
                                        未完成订单 ({currentShift.open_orders?.length || 0})
                                    </Button>
                                    <Button type="primary" htmlType="submit" loading={submitting} size="large">
                                        确认交接班
                                    </Button>
                                </Space>
                            </Form>

                            {currentShift.anomalies?.length > 0 && (
                                <Alert
                                    type="warning"
                                    icon={<WarningOutlined />}
                                    message="异常记录"
                                    description={currentShift.anomalies.join(' | ')}
                                    style={{marginTop: 16}}
                                />
                            )}

                            {currentShift.low_stock_items?.length > 0 ? (
                                <Alert
                                    message="以下商品库存不足"
                                    description={currentShift.low_stock_items.join('、')}
                                    type="warning"
                                    showIcon
                                    style={{marginTop: 16}}
                                />
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                    当前无库存告急
                                </Typography>
                            )}
                        </>
                    )}
                </Card>

                <Modal
                    title="未完成订单"
                    open={showOpenOrders}
                    onCancel={() => setShowOpenOrders(false)}
                    width={800}
                    footer={null}
                    zIndex={1500}
                >
                    <Table
                        columns={openOrderColumns}
                        dataSource={currentShift?.open_orders || []}
                        rowKey="order_id"
                        pagination={false}
                    />
                </Modal>
            </Box>
        </Drawer>
    );
};

export default HandoverPageDrawer;
