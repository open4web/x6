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

// ==================== 所有类型定义（同一个文件） ====================
interface MenuItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    order_id: string;
    table_id?: string;
    items: MenuItem[];
    status: string;
    total_amount: number;
    paid_amount: number;
    payment_method: string;
    create_time: string;
}

interface ShiftHandover {
    handover_id: string;
    start_time: string;
    end_time: string;
    previous_cashier: string;
    next_cashier: string;
    supervisor?: string;

    total_orders: number;
    total_sales_amount: number;
    total_paid_amount: number;

    opening_cash: number;
    closing_cash: number;
    expected_cash: number;
    cash_difference: number;

    payment_summary: Record<string, number>;
    open_orders: Order[];
    low_stock_items: string[];
    special_notes: string;
    anomalies: string[];
    cancelled_orders: number;
    refunded_amount: number;
}

// ==================== Mock 数据（同一个文件） ====================
const mockShiftData: ShiftHandover = {
    handover_id: "HO_20250517_2230",
    start_time: "2025-05-17T14:00:00",
    end_time: "2025-05-17T22:30:00",
    previous_cashier: "张三",
    next_cashier: "",
    supervisor: "",

    total_orders: 87,
    total_sales_amount: 4580.5,
    total_paid_amount: 4520.5,

    opening_cash: 500.0,
    closing_cash: 0,
    expected_cash: 1240.0,
    cash_difference: 0,

    payment_summary: {
        cash: 740.0,
        wechat: 2800.0,
        alipay: 980.5,
    },

    open_orders: [
        {
            order_id: "ORD20250517001",
            table_id: "A01",
            items: [
                { id: "item1", name: "宫保鸡丁", price: 38.0, quantity: 1 },
                { id: "item2", name: "可乐", price: 8.0, quantity: 2 },
            ],
            status: "cooking",
            total_amount: 54.0,
            paid_amount: 0,
            payment_method: "pending",
            create_time: "2025-05-17T22:05:00",
        },
        {
            order_id: "ORD20250517002",
            table_id: "B05",
            items: [{ id: "item3", name: "麻辣香锅", price: 68.0, quantity: 1 }],
            status: "pending",
            total_amount: 68.0,
            paid_amount: 0,
            payment_method: "pending",
            create_time: "2025-05-17T22:15:00",
        },
    ],

    low_stock_items: ["可乐", "啤酒"],
    special_notes: "今日A区空调故障，已赠送两杯饮料",
    anomalies: ["ORD2025051698 已退款 ¥128", "B03 桌免单一份宫保鸡丁"],
    cancelled_orders: 3,
    refunded_amount: 256.0,
};

// ==================== Mock API（同一个文件） ====================
const shiftApi = {
    getCurrentShift: async (): Promise<{ data: ShiftHandover }> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: { ...mockShiftData } };
    },

    doHandover: async (payload: any): Promise<{ data: ShiftHandover }> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return {
            data: {
                ...mockShiftData,
                next_cashier: payload.next_cashier,
                closing_cash: payload.closing_cash,
                cash_difference: payload.closing_cash - mockShiftData.expected_cash,
                end_time: new Date().toISOString(),
            }
        };
    },
};

// ==================== 交接班页面 ====================
const HandoverPageDrawer: React.FC = () => {
    const [form] = Form.useForm();
    const [currentShift, setCurrentShift] = useState<ShiftHandover | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showOpenOrders, setShowOpenOrders] = useState(false);
    const { shiftOpen, setShiftOpen } = useCartContext();

    const toggleDrawer = (newOpen: boolean) => () => {
        setShiftOpen(newOpen);
    };

    const loadCurrentShift = async () => {
        setLoading(true);
        const res = await shiftApi.getCurrentShift();
        setCurrentShift(res.data);
        form.setFieldsValue({
            next_cashier: '',
            closing_cash: res.data.opening_cash + (res.data.payment_summary.cash || 0),
            supervisor: '',
            special_notes: res.data.special_notes,
        });
        setLoading(false);
    };

    useEffect(() => {
        loadCurrentShift();
    }, []);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        try {
            const res = await shiftApi.doHandover(values);
            Modal.success({
                title: '交接班成功',
                content: `现金差异：¥${res.data.cash_difference.toFixed(2)}`,
                onOk: loadCurrentShift,
            });
        } catch (error) {
            Modal.error({ title: '交接失败', content: '请稍后重试' });
        }
        setSubmitting(false);
    };

    const openOrderColumns: ColumnsType<Order> = [
        { title: '订单号', dataIndex: 'order_id' },
        { title: '桌号', dataIndex: 'table_id' },
        { title: '金额', dataIndex: 'total_amount', render: (v) => `¥${v.toFixed(2)}` },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status: string) => <Tag color={status === 'cooking' ? 'orange' : 'blue'}>{status}</Tag>
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (v) => dayjs(v).format('HH:mm')
        },
    ];

    if (!currentShift) return <Card loading>加载中...</Card>;

    return (
        <Drawer open={shiftOpen} onClose={toggleDrawer(false)} elevation={2} anchor="top">
        <div style={{ padding: 24 }}>
            <Card title="交接班管理" loading={loading}>
                <Descriptions bordered column={3}>
                    <Descriptions.Item label="当前收银员">{currentShift.previous_cashier}</Descriptions.Item>
                    <Descriptions.Item label="开始时间">{dayjs(currentShift.start_time).format('MM-DD HH:mm')}</Descriptions.Item>
                    <Descriptions.Item label="总订单数">{currentShift.total_orders} 单</Descriptions.Item>

                    <Descriptions.Item label="总销售额" span={3}>
                        <strong>¥{currentShift.total_sales_amount.toFixed(2)}</strong>
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
            </Card>

            <Modal
                title="未完成订单"
                open={showOpenOrders}
                onCancel={() => setShowOpenOrders(false)}
                width={800}
                footer={null}
            >
                <Table columns={openOrderColumns} dataSource={currentShift.open_orders} rowKey="order_id" pagination={false} />
            </Modal>
        </div>
        </Drawer>
    );
};

export default HandoverPageDrawer;