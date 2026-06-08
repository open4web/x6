import React, { useState, useEffect } from 'react';
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
import { PrinterOutlined, WarningOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import Drawer from "@mui/material/Drawer";
import {useCartContext} from "../../dataProvider/MyCartProvider";
import {toast} from "react-toastify";
import {useFetchData} from "../../common/FetchData";
import {Order, ShiftHandover} from "./types";
import {statusInfoMap} from "./orderStatus";


// ==================== 交接班页面 ====================
const HandoverPageDrawer: React.FC = () => {
    const [form] = Form.useForm();
    const [currentShift, setCurrentShift] = useState<ShiftHandover | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showOpenOrders, setShowOpenOrders] = useState(false);
    const { shiftOpen, setShiftOpen, merchantId, setReady } = useCartContext();
    const { fetchData } = useFetchData();


    const toggleDrawer = (newOpen: boolean) => () => {
        setShiftOpen(newOpen);
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
            }, "GET", {});
        } catch {
            toast.error("会员查询失败");
        } finally {
        }
        setLoading(false);
    };

    const doHandover = async (values: any) => {
        setLoading(true);
        try {

            const postData = {
                current: currentShift,           // 可根据后端需求决定是否需要传整个对象
                remark: values.special_notes || '',   // ← 关键：从表单取 special_notes
                next_cashier: values.next_cashier,
                closing_cash: values.closing_cash,
                supervisor: values.supervisor || '',
                special_notes: values.special_notes || '',
            };

            // 清空本地状态缓存
            localStorage.removeItem("shiftReadyTime:" + merchantId)
            localStorage.removeItem("shiftReady:" + merchantId)

            await fetchData('/v1/hlj/finance/shift/' + merchantId, (res: any) => {
                form.setFieldsValue({
                    next_cashier: '',
                    closing_cash: res.data.opening_cash + (res.data.payment_summary.cash || 0),
                    supervisor: '',
                    special_notes: res.data.special_notes,
                });
            }, "POST", postData);
        } catch {
            toast.error("会员查询失败");
        } finally {
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCurrentShift();
    }, [shiftOpen]);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        try {
            const res = await doHandover(values);

        } catch (error) {
            Modal.error({ title: '交接失败', content: '请稍后重试' });
        }
        setSubmitting(false);
        setReady(false)
    };

    const openOrderColumns: ColumnsType<Order> = [
        { title: '订单号', dataIndex: 'order_id' },
        { title: '桌号', dataIndex: 'table_id' },
        { title: '金额', dataIndex: 'total_amount', render: (v) => `¥${v.toFixed(2)}` },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status: number) => {
                const info = statusInfoMap[status] || { text: `未知(${status})`, color: 'default' };
                return <Tag color={info.color}>{info.text}</Tag>;
            }
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (v) => dayjs(v).format('YY-MM-DD HH:mm')
        },
    ];

    if (!currentShift) return <Card loading>加载中...</Card>;

    // @ts-ignore
    return (
        <Drawer open={shiftOpen} onClose={toggleDrawer(false)}
                elevation={2} anchor="top"
                PaperProps={{ sx: { height: '96vh', overflow: 'auto', zIndex: 1300 } }}
        >
        <div style={{ padding: 24 }}>
            <Card title="交接班管理" loading={loading}>
                <Descriptions bordered column={3}>
                    <Descriptions.Item label="当前收银员">{currentShift.previous_cashier}</Descriptions.Item>
                    <Descriptions.Item label="开始时间">{dayjs(currentShift.start_time).format('MM-DD HH:mm')}</Descriptions.Item>
                    <Descriptions.Item label="总订单数">{currentShift.total_orders} 单</Descriptions.Item>

                    <Descriptions.Item label="销售额" span={1}>
                        <strong>¥{currentShift.total_sales_amount.toFixed(2)}</strong>
                    </Descriptions.Item>

                    <Descriptions.Item label="总收款" span={1}>
                        <strong>¥{currentShift.total_paid_amount.toFixed(2)}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="总退款" span={1}>
                        <strong>¥{currentShift.total_refund_amount.toFixed(2)}</strong>
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="下一班收银员" name="next_cashier" rules={[{ required: true }]}>
                        <Input placeholder="请输入下一班收银员" style={{ width: 300 }} />
                    </Form.Item>

                    <Form.Item label="实点现金" name="closing_cash" rules={[{ required: true }]}>
                        <InputNumber style={{ width: 300 }} precision={2} prefix="¥" />
                    </Form.Item>

                    <Form.Item label="监交人" name="supervisor">
                        <Input placeholder="可选" style={{ width: 300 }} />
                    </Form.Item>

                    <Form.Item label="备注" name="special_notes">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Space>
                        <Button type="primary" htmlType="submit" loading={submitting} size="large">
                            确认交接班
                        </Button>
                        <Button icon={<PrinterOutlined />} size="large" onClick={() => window.print()}>
                            打印交接单
                        </Button>
                        <Button size="large" onClick={() => setShowOpenOrders(true)}>
                            未完成订单 ({currentShift.open_orders.length})
                        </Button>
                    </Space>
                </Form>

                {currentShift.anomalies.length > 0 && (
                    <Alert
                        type="warning"
                        icon={<WarningOutlined />}
                        message="异常记录"
                        description={currentShift.anomalies.join(' | ')}
                        style={{ marginTop: 16 }}
                    />
                )}

                {currentShift.low_stock_items.length > 0 ? (
                    <Alert
                        message="以下商品库存不足"
                        description={currentShift.low_stock_items.join('、')}
                        type="warning"
                        showIcon
                    />
                ) : (
                    <p>当前无库存告急</p>
                )}
            </Card>

            <Modal
                title="未完成订单"
                open={showOpenOrders}
                onCancel={() => setShowOpenOrders(false)}
                width={800}
                footer={null}
                zIndex={1500}           // ← 关键修复：提高层级
            >
                <Table columns={openOrderColumns} dataSource={currentShift.open_orders} rowKey="order_id" pagination={false} />
            </Modal>
        </div>
        </Drawer>
    );
};

export default HandoverPageDrawer;