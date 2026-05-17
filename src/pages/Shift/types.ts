// ==================== 所有类型定义（同一个文件） ====================
export interface MenuItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    order_id: string;
    table_id?: string;
    items: MenuItem[];
    status: string;
    total_amount: number;
    paid_amount: number;
    payment_method: string;
    create_time: string;
}

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
    total_refund_amount: number;

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
