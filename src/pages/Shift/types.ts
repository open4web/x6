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
    status: number;
    total_amount: number;
    paid_amount: number;
    payment_method: string;
    create_time: string;
}

export interface Assignee {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    titles?: string[];
    category?: string;
    phone_suffix?: string;
    online?: boolean;
}

export function filterAssignees(people: Assignee[], raw: string, exclude: string[] = []): Assignee[] {
    const blocked = new Set(exclude.filter(Boolean));
    const query = raw.trim().replace(/^@+/g, '').toLowerCase();
    return people.filter(person => {
        if (blocked.has(person.id)) {
            return false;
        }
        if (!query) {
            return true;
        }
        const name = (person.name || '').toLowerCase();
        const phone = (person.phone_suffix || '').toLowerCase();
        return name.startsWith(query) || (phone !== '' && phone.startsWith(query));
    });
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
    payment_live?: boolean;
    open_orders: Order[];
    low_stock_items: string[];
    special_notes: string;
    anomalies: string[];
    cancelled_orders: number;
    refunded_amount: number;
}
