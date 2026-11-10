import React, {useState, useEffect} from 'react';
import {
    Avatar,
    Card,
    Button,
    Form,
    Input,
    InputNumber,
    Table,
    Alert,
    Space,
    Tag,
    Modal,
    Row,
    Col,
    Checkbox,
    ConfigProvider,
    App as AntdApp,
} from 'antd';
import {PrinterOutlined, WarningOutlined} from '@ant-design/icons';
import axios from 'axios';
import {clearLocalDuty, dutyErrorMessage, dutyPhase, dutyUserId, elapsedSeconds, formatDutyClock, isNotStartedMessage, parseStartMs} from '../../common/shiftDuty';
import type {ColumnsType} from 'antd/es/table';
import dayjs from 'dayjs';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {alpha, useTheme} from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import {useCartContext} from '../../dataProvider/MyCartProvider';
import {toast} from 'react-toastify';
import {useFetchData} from '../../common/FetchData';
import {Assignee, Order, ShiftHandover} from './types';
import {statusInfoMap} from './orderStatus';
import {useTranslate} from 'react-admin';
import AdminMention from './AdminMention';
import {handoverAntdTheme} from './handoverTheme';

const payOrder = ['wechat', 'alipay', 'cash', 'balance', 'points', 'other'] as const;

const roleMessage = (role: string) => {
    if (role === 'owner') {
        return 'pos.login.role_owner';
    }
    if (role === 'admin') {
        return 'pos.login.role_admin';
    }
    return 'pos.login.role_user';
};

const CashierName: React.FC<{name?: string; people: Assignee[]}> = ({name, people}) => {
    const translate = useTranslate();
    const person = people.find(item => item.name === name);
    if (!person) {
        return <>{name || '-'}</>;
    }
    return (
        <Space size={6}>
            <Avatar size={22} src={person.avatar || undefined}>{person.name.slice(0, 1)}</Avatar>
            <span>{person.name}</span>
            <Tag color={person.role === 'owner' ? 'purple' : 'blue'}>{translate(roleMessage(person.role))}</Tag>
        </Space>
    );
};

const PaymentSummary: React.FC<{summary?: Record<string, number>}> = ({summary}) => {
    const translate = useTranslate();
    const rows = payOrder
        .map(key => ({key, amount: Number(summary?.[key] || 0)}))
        .filter(row => row.amount > 0);
    return (
        <div style={{marginTop: 12, paddingTop: 4}}>
            <Typography variant="body2" sx={{fontWeight: 700, mb: 0.5}}>
                {translate('pos.handover.payment_summary', {_: 'Payments this shift'})}
            </Typography>
            {rows.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    {translate('pos.handover.no_payment', {_: 'No payments this shift'})}
                </Typography>
            ) : (
                <Space wrap>
                    {rows.map(row => (
                        <Tag key={row.key}>
                            {translate(`pos.handover.pay_${row.key}`, {_: row.key})} ¥{row.amount.toFixed(2)}
                        </Tag>
                    ))}
                </Space>
            )}
        </div>
    );
};

const CashDifference: React.FC<{expected: number; counted: number | null | undefined}> = ({expected, counted}) => {
    const translate = useTranslate();
    if (counted === undefined || counted === null || Number.isNaN(Number(counted))) {
        return null;
    }
    const diff = Math.round((Number(counted) - expected) * 100) / 100;
    const tone = diff > 0 ? '#1677ff' : diff < 0 ? '#cf1322' : '#389e0d';
    const label = diff > 0
        ? translate('pos.handover.diff_over', {_: 'Over'})
        : diff < 0
            ? translate('pos.handover.diff_short', {_: 'Short'})
            : translate('pos.handover.diff_even', {_: 'Balanced'});
    return (
        <Typography variant="body2" sx={{mt: 0.75, color: tone, fontWeight: 700}}>
            {translate('pos.handover.difference', {_: 'Difference'})} ¥{diff.toFixed(2)} · {label}
        </Typography>
    );
};

const sheetPx = {xs: 2.5, sm: 4, lg: 5};

const StatTiles = ({items}: {items: {label: string; value: React.ReactNode}[]}) => (
    <Box
        sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(4, minmax(0, 1fr))',
                xl: 'repeat(8, minmax(0, 1fr))',
            },
        }}
    >
        {items.map(item => (
            <Box
                key={item.label}
                sx={{
                    minWidth: 0,
                    px: 1.75,
                    py: 1.25,
                    borderRadius: 1.5,
                    color: 'text.primary',
                    bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.1),
                    border: '1px solid',
                    borderColor: theme => alpha(theme.palette.primary.main, 0.28),
                }}
            >
                <Typography variant="caption" color="text.secondary" sx={{display: 'block', lineHeight: 1.3}}>
                    {item.label}
                </Typography>
                <Box sx={{mt: 0.5, fontWeight: 700, lineHeight: 1.35, wordBreak: 'break-word'}}>
                    {item.value}
                </Box>
            </Box>
        ))}
    </Box>
);

const ShiftOvertimeBanner = ({startMs, on}: {startMs: number; on: boolean}) => {
    const translate = useTranslate();
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (!on || !startMs) {
            return;
        }
        setNow(Date.now());
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, [on, startMs]);
    if (!on || !startMs) {
        return null;
    }
    const elapsed = elapsedSeconds(startMs, now);
    if (dutyPhase(elapsed).band !== 'red') {
        return null;
    }
    return (
        <Alert
            type="error"
            showIcon
            message={translate('pos.shift.overtime_title')}
            description={translate('pos.shift.overtime_drawer', {time: formatDutyClock(elapsed)})}
            style={{marginBottom: 12}}
        />
    );
};

const HandoverSheet: React.FC = () => {
    const {modal} = AntdApp.useApp();
    const [form] = Form.useForm();
    const [currentShift, setCurrentShift] = useState<ShiftHandover | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showOpenOrders, setShowOpenOrders] = useState(false);
    const [people, setPeople] = useState<Assignee[]>([]);
    const [peopleLoading, setPeopleLoading] = useState(false);
    const [peopleError, setPeopleError] = useState('');
    const {shiftOpen, setShiftOpen, merchantId, ready, setReady, startReady, setStartReady} = useCartContext();
    const {fetchData} = useFetchData();
    const translate = useTranslate();
    const dutyStartMs = parseStartMs(startReady) || parseStartMs(currentShift?.start_time);
    const nextCashierId = Form.useWatch('next_cashier_id', form);
    const supervisorId = Form.useWatch('supervisor_id', form);
    const countedCash = Form.useWatch('closing_cash', form);

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
                    next_cashier_id: undefined,
                    supervisor_id: undefined,
                    closing_cash: res.data.expected_cash || res.data.closing_cash,
                    special_notes: '',
                    ack_open: false,
                });
            }, 'GET', {});
        } catch (error) {
            const message = axios.isAxiosError(error) ? dutyErrorMessage(error.response?.data) : '';
            if (isNotStartedMessage(message)) {
                clearLocalDuty(dutyUserId(), merchantId);
                setStartReady(0);
                setReady(false);
                setShiftOpen(false);
                toast.warning(translate('pos.handover.need_duty'));
            } else {
                toast.error(message || translate('pos.handover.load_failed'));
            }
        } finally {
            setLoading(false);
        }
    };

    const loadAssignees = async () => {
        if (!merchantId) {
            setPeople([]);
            return;
        }
        setPeopleLoading(true);
        setPeopleError('');
        try {
            const cookie = localStorage.getItem('cookie') || '';
            const res = await axios.get('/v1/hlj/finance/shift/assignees/' + merchantId, {
                headers: {Cookies: cookie, Authorization: cookie},
            });
            const list = Array.isArray(res.data?.data) ? res.data.data : [];
            setPeople(list);
            if (list.length === 0) {
                setPeopleError(translate('pos.handover.mention_none', {_: 'No administrator to hand over to'}));
            }
        } catch {
            setPeople([]);
            setPeopleError(translate('pos.handover.mention_load_failed', {_: 'Could not load administrators'}));
        } finally {
            setPeopleLoading(false);
        }
    };

    const doHandover = async (values: any) => {
        const next = people.find(person => person.id === values.next_cashier_id);
        const supervisor = people.find(person => person.id === values.supervisor_id);
        const postData = {
            current: currentShift,
            remark: values.special_notes || '',
            next_cashier_id: values.next_cashier_id,
            next_cashier: next?.name || '',
            supervisor_id: values.supervisor_id || '',
            supervisor: supervisor?.name || '',
            closing_cash: values.closing_cash,
            special_notes: values.special_notes || '',
        };

        await fetchData('/v1/hlj/finance/shift/' + merchantId, () => {
            clearLocalDuty(dutyUserId(), merchantId);
            setStartReady(0);
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
        loadAssignees();
    }, [shiftOpen]);

    const handleSubmit = async (values: any) => {
        const next = people.find(person => person.id === values.next_cashier_id);
        const nextLabel = next ? ` @${next.name}` : '';
        modal.confirm({
            title: translate('pos.handover.confirm_title'),
            content: `${translate('pos.handover.confirm_body')}${nextLabel}`,
            okText: translate('pos.handover.confirm_ok'),
            cancelText: translate('pos.handover.confirm_check'),
            zIndex: 2000,
            onOk: async () => {
                setSubmitting(true);
                try {
                    await doHandover(values);
                } catch {
                    modal.error({title: translate('pos.handover.fail'), content: translate('pos.handover.retry'), zIndex: 2000});
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
                    width: '100%',
                    maxWidth: '100%',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    backgroundImage: 'none',
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
                    gap: 2,
                    px: sheetPx,
                    py: 1.5,
                    color: 'text.primary',
                    bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.12),
                    borderBottom: '3px solid',
                    borderColor: 'primary.main',
                }}
            >
                <Box sx={{minWidth: 0, flex: 1}}>
                    <Typography variant="h6" sx={{fontWeight: 700, lineHeight: 1.2}}>
                        {translate('pos.handover.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {translate('pos.handover.subtitle')}
                    </Typography>
                </Box>
                <IconButton onClick={closeDrawer} aria-label={translate('pos.handover.close')} disabled={submitting} sx={{flexShrink: 0}}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{px: sheetPx, pt: 2, pb: 2.5}}>
                <ShiftOvertimeBanner startMs={dutyStartMs} on={shiftOpen && ready} />
                <Card loading={loading} bordered={false} bodyStyle={{padding: 0, background: 'transparent'}} style={{marginTop: 0, background: 'transparent', boxShadow: 'none'}}>
                    {!currentShift && !loading && (
                        <Alert
                            type="warning"
                            message={translate('pos.handover.no_data')}
                            action={<Button size="small" onClick={loadCurrentShift}>{translate('pos.handover.reload')}</Button>}
                        />
                    )}

                    {currentShift && (
                        <>
                            <StatTiles
                                items={[
                                    {label: translate('pos.handover.cashier'), value: <CashierName name={currentShift.previous_cashier} people={people} />},
                                    {label: translate('pos.handover.start_time'), value: currentShift.start_time ? dayjs(currentShift.start_time).format('MM-DD HH:mm') : '-'},
                                    {label: translate('pos.handover.order_count'), value: translate('pos.handover.orders_unit', {count: currentShift.total_orders})},
                                    {label: translate('pos.handover.sales'), value: `¥${Number(currentShift.total_sales_amount || 0).toFixed(2)}`},
                                    {label: translate('pos.handover.paid'), value: `¥${Number(currentShift.total_paid_amount || 0).toFixed(2)}`},
                                    {label: translate('pos.handover.refund'), value: `¥${Number(currentShift.total_refund_amount || 0).toFixed(2)}`},
                                    {label: translate('pos.handover.expected_cash', {_: 'System cash'}), value: `¥${Number(currentShift.expected_cash || currentShift.closing_cash || 0).toFixed(2)}`},
                                    {label: translate('pos.handover.cancelled', {_: 'Cancel / refund'}), value: currentShift.cancelled_orders || 0},
                                ]}
                            />

                            {currentShift.payment_live && (
                                <PaymentSummary summary={currentShift.payment_summary} />
                            )}

                            {peopleError && (
                                <Alert
                                    type="warning"
                                    showIcon
                                    message={peopleError}
                                    style={{marginBottom: 16}}
                                    action={<Button size="small" onClick={loadAssignees}>{translate('pos.handover.reload')}</Button>}
                                />
                            )}

                            <Box sx={{mt: 2, '& .ant-form-item': {marginBottom: 12}}}>
                            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                <Row gutter={[16, 4]}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label={translate('pos.handover.next_cashier')}
                                            name="next_cashier_id"
                                            extra={translate('pos.handover.mention_hint', {_: 'Type @ and a name prefix. Free-text names are not accepted.'})}
                                            rules={[
                                                {required: true, message: translate('pos.handover.next_required')},
                                                {validator: async (_, id) => {
                                                    if (!id) {
                                                        return;
                                                    }
                                                    if (!people.some(person => person.id === id)) {
                                                        throw new Error(translate('pos.handover.next_invalid', {_: 'Pick an administrator from the list'}));
                                                    }
                                                }},
                                            ]}
                                        >
                                            <AdminMention
                                                people={people}
                                                excludeIds={supervisorId ? [supervisorId] : []}
                                                disabled={peopleLoading || people.length === 0}
                                                placeholder={peopleLoading
                                                    ? translate('pos.handover.mention_loading', {_: 'Loading administrators'})
                                                    : translate('pos.handover.next_placeholder')}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label={`${translate('pos.handover.supervisor')}（${translate('pos.handover.optional')}）`}
                                            name="supervisor_id"
                                            rules={[{validator: async (_, id) => {
                                                if (!id) {
                                                    return;
                                                }
                                                if (!people.some(person => person.id === id)) {
                                                    throw new Error(translate('pos.handover.next_invalid', {_: 'Pick an administrator from the list'}));
                                                }
                                                if (id === nextCashierId) {
                                                    throw new Error(translate('pos.handover.supervisor_same', {_: 'Supervisor must be a different administrator'}));
                                                }
                                            }}]}
                                        >
                                            <AdminMention
                                                people={people}
                                                excludeIds={nextCashierId ? [nextCashierId] : []}
                                                disabled={peopleLoading || people.length === 0}
                                                placeholder={translate('pos.handover.supervisor_placeholder', {_: '@ supervisor name'})}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 4]}>
                                    <Col xs={24} md={8}>
                                        <Form.Item label={translate('pos.handover.cash')} name="closing_cash" rules={[{required: true, message: translate('pos.handover.cash_required')}]}>
                                            <InputNumber style={{width: '100%'}} min={0} precision={2} prefix="¥" />
                                        </Form.Item>
                                        <CashDifference
                                            expected={Number(currentShift.expected_cash || currentShift.closing_cash || 0)}
                                            counted={countedCash}
                                        />
                                    </Col>
                                    <Col xs={24} md={16}>
                                        <Form.Item label={translate('pos.handover.notes')} name="special_notes">
                                            <Input.TextArea rows={2} placeholder={translate('pos.handover.notes_ph', {_: 'Keys, equipment, unfinished work'})} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {((currentShift.open_orders?.length || 0) > 0 || (currentShift.anomalies?.length || 0) > 0) && (
                                    <Form.Item
                                        name="ack_open"
                                        valuePropName="checked"
                                        rules={[{validator: async (_, checked) => {
                                            if (!checked) {
                                                throw new Error(translate('pos.handover.ack_required', {_: 'Review open orders and exceptions first'}));
                                            }
                                        }}]}
                                    >
                                        <Checkbox>
                                            {translate('pos.handover.ack_open', {
                                                orders: currentShift.open_orders?.length || 0,
                                                anomalies: currentShift.anomalies?.length || 0,
                                                _: 'Open orders %{orders}, exceptions %{anomalies}. I have checked them.',
                                            })}
                                        </Checkbox>
                                    </Form.Item>
                                )}

                                <Box sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, mt: 0.5}}>
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
                                    </Space>
                                    <Button type="primary" htmlType="submit" loading={submitting} size="large" disabled={peopleLoading || people.length === 0}>
                                        {translate('pos.handover.confirm_ok')}
                                    </Button>
                                </Box>
                            </Form>
                            </Box>

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

const HandoverPageDrawer: React.FC = () => {
    const muiTheme = useTheme();
    return (
        <ConfigProvider theme={handoverAntdTheme(muiTheme)}>
            <AntdApp>
                <HandoverSheet />
            </AntdApp>
        </ConfigProvider>
    );
};

export default HandoverPageDrawer;
