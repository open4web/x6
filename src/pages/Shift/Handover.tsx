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
import {useTranslate} from 'react-admin';

const HandoverPageDrawer: React.FC = () => {
    const [form] = Form.useForm();
    const [currentShift, setCurrentShift] = useState<ShiftHandover | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showOpenOrders, setShowOpenOrders] = useState(false);
    const {shiftOpen, setShiftOpen, merchantId, setReady} = useCartContext();
    const {fetchData} = useFetchData();
    const translate = useTranslate();

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
            toast.error(translate('pos.handover.load_failed'));
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
            toast.success(translate('pos.handover.success'));
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
            title: translate('pos.handover.confirm_title'),
            content: translate('pos.handover.confirm_body'),
            okText: translate('pos.handover.confirm_ok'),
            cancelText: translate('pos.handover.confirm_check'),
            onOk: async () => {
                setSubmitting(true);
                try {
                    await doHandover(values);
                } catch {
                    Modal.error({title: translate('pos.handover.fail'), content: translate('pos.handover.retry')});
                } finally {
                    setSubmitting(false);
                }
            },
        });
    };

    const openOrderColumns: ColumnsType<Order> = [
        {title: translate('pos.handover.order_no'), dataIndex: 'order_id'},
        {title: translate('pos.handover.table'), dataIndex: 'table_id'},
        {title: translate('pos.handover.amount'), dataIndex: 'total_amount', render: (v) => `¥${Number(v || 0).toFixed(2)}`},
        {
            title: translate('pos.handover.status'),
            dataIndex: 'status',
            render: (status: number) => {
                const info = statusInfoMap[status] || {text: translate('pos.handover.unknown'), color: 'default'};
                return <Tag color={info.color}>{translate(`pos.status.${status}`, {_: info.text})}</Tag>;
            },
        },
        {
            title: translate('pos.handover.created'),
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
                        {translate('pos.handover.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {translate('pos.handover.subtitle')}
                    </Typography>
                </Box>
                <IconButton onClick={closeDrawer} aria-label={translate('pos.handover.close')} disabled={submitting}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{p: 3}}>
                <Card loading={loading} bordered={false} bodyStyle={{padding: 0}}>
                    {!currentShift && !loading && (
                        <Alert
                            type="warning"
                            message={translate('pos.handover.no_data')}
                            action={<Button size="small" onClick={loadCurrentShift}>{translate('pos.handover.reload')}</Button>}
                        />
                    )}

                    {currentShift && (
                        <>
                            <Descriptions bordered column={3} size="small">
                                <Descriptions.Item label={translate('pos.handover.cashier')}>{currentShift.previous_cashier}</Descriptions.Item>
                                <Descriptions.Item label={translate('pos.handover.start_time')}>
                                    {currentShift.start_time ? dayjs(currentShift.start_time).format('MM-DD HH:mm') : '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label={translate('pos.handover.order_count')}>{translate('pos.handover.orders_unit', {count: currentShift.total_orders})}</Descriptions.Item>
                                <Descriptions.Item label={translate('pos.handover.sales')}>
                                    <strong>¥{Number(currentShift.total_sales_amount || 0).toFixed(2)}</strong>
                                </Descriptions.Item>
                                <Descriptions.Item label={translate('pos.handover.paid')}>
                                    <strong>¥{Number(currentShift.total_paid_amount || 0).toFixed(2)}</strong>
                                </Descriptions.Item>
                                <Descriptions.Item label={translate('pos.handover.refund')}>
                                    <strong>¥{Number(currentShift.total_refund_amount || 0).toFixed(2)}</strong>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                <Form.Item label={translate('pos.handover.next_cashier')} name="next_cashier" rules={[{required: true, message: translate('pos.handover.next_required')}]}>
                                    <Input placeholder={translate('pos.handover.next_placeholder')} style={{width: 320}} />
                                </Form.Item>
                                <Form.Item label={translate('pos.handover.cash')} name="closing_cash" rules={[{required: true, message: translate('pos.handover.cash_required')}]}>
                                    <InputNumber style={{width: 320}} precision={2} prefix="¥" />
                                </Form.Item>
                                <Form.Item label={translate('pos.handover.supervisor')} name="supervisor">
                                    <Input placeholder={translate('pos.handover.optional')} style={{width: 320}} />
                                </Form.Item>
                                <Form.Item label={translate('pos.handover.notes')} name="special_notes">
                                    <Input.TextArea rows={3} />
                                </Form.Item>

                                <Space wrap>
                                    <Button onClick={closeDrawer} size="large" disabled={submitting}>
                                        {translate('pos.handover.cancel')}
                                    </Button>
                                    <Button icon={<PrinterOutlined />} size="large" onClick={() => window.print()}>
                                        {translate('pos.handover.print')}
                                    </Button>
                                    <Button size="large" onClick={() => setShowOpenOrders(true)}>
                                        {translate('pos.handover.open_orders')} ({currentShift.open_orders?.length || 0})
                                    </Button>
                                    <Button type="primary" htmlType="submit" loading={submitting} size="large">
                                        {translate('pos.handover.confirm_ok')}
                                    </Button>
                                </Space>
                            </Form>

                            {currentShift.anomalies?.length > 0 && (
                                <Alert
                                    type="warning"
                                    icon={<WarningOutlined />}
                                    message={translate('pos.handover.anomalies')}
                                    description={currentShift.anomalies.join(' | ')}
                                    style={{marginTop: 16}}
                                />
                            )}

                            {currentShift.low_stock_items?.length > 0 ? (
                                <Alert
                                    message={translate('pos.handover.low_stock')}
                                    description={currentShift.low_stock_items.join('、')}
                                    type="warning"
                                    showIcon
                                    style={{marginTop: 16}}
                                />
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                    {translate('pos.handover.no_low_stock')}
                                </Typography>
                            )}
                        </>
                    )}
                </Card>

                <Modal
                    title={translate('pos.handover.open_orders')}
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
