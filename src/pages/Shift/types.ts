import {Order} from "../home/Components/types";

export interface ShiftHandover {
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

    payment_summary: Record<string, number>;   // 如 { "cash": 450, "wechat": 1200 }
    open_orders: Order[];
    low_stock_items?: string[];
    special_notes: string;
    anomalies: string[];
    cancelled_orders: number;
    refunded_amount: number;
}