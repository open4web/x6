
// 模拟订单数据（包含 `buckets` 字段）
import dayjs from "dayjs";
import {Order} from "./types";

export const ordersData: Order[] = [
    {
        id: '1',
        identity: {order_no: 'ORD001', table_no: 'T01', pay_price: 100},
        status: 0,
        date: dayjs().format('YYYY-MM-DD'),
        buckets: [
            {
                id: '1',
                name: 'Apple iPhone 14',
                number: 1,
                price: 100,
                origin_amount: '1000',
                unit: 'pcs',
                props_id: [1, 2],
                props_text: 'Color: Red'
            }
        ]
    },
    {
        id: '2',
        identity: {order_no: 'ORD002', table_no: 'T02', pay_price: 150},
        status: 1,
        date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        buckets: [
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            }
        ]
    },
    {
        id: '3',
        identity: {order_no: 'ORD001', table_no: 'T01', pay_price: 100},
        status: 0,
        date: dayjs().format('YYYY-MM-DD'),
        buckets: [
            {
                id: '1',
                name: 'Apple iPhone 14',
                number: 1,
                price: 100,
                origin_amount: '1000',
                unit: 'pcs',
                props_id: [1, 2],
                props_text: 'Color: Red'
            }
        ]
    },
    {
        id: '4',
        identity: {order_no: 'ORD002', table_no: 'T02', pay_price: 150},
        status: 1,
        date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        buckets: [
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            },
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            },
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            },
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            },
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            },
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            }
        ]
    },
    {
        id: '6',
        identity: {order_no: 'ORD001', table_no: 'T01', pay_price: 100},
        status: 0,
        date: dayjs().format('YYYY-MM-DD'),
        buckets: [
            {
                id: '1',
                name: 'Apple iPhone 14',
                number: 1,
                price: 100,
                origin_amount: '1000',
                unit: 'pcs',
                props_id: [1, 2],
                props_text: 'Color: Red'
            }
        ]
    },
    {
        id: '7',
        identity: {order_no: 'ORD002', table_no: 'T02', pay_price: 150},
        status: 1,
        date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        buckets: [
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            },
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            },
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            },
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            },
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            },
            {
                id: '2',
                name: 'Samsung Galaxy S22',
                number: 1,
                price: 150,
                origin_amount: '1500',
                unit: 'pcs',
                props_id: [3, 4],
                props_text: 'Color: Blue'
            }
        ]
    },
    // 更多订单数据...
];