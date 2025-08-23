// 保证定义与 https://github.com/open4go/req5rsp/blob/main/cst/order.go 一致性
// 	// OrderInit 订单初始化(未完成支付）
// 	OrderInit OrderStatus = iota
// 	// OrderPaid 订单已付款
// 	OrderPaid
// 	// OrderMaking 订单制作中
// 	OrderMaking
// 	// OrderProduceCompleted 订单制作完成
// 	OrderProduceCompleted
// 	// OrderCompleted 订单完成 （已经自提/堂食配送完成）
// 	OrderCompleted
// 	// 	OrderCancelRejected  拒绝取消
// 	OrderCancelRejected
// 	// OrderCancel 订单取消
// 	OrderCancel
// 	// OrderCancelApproved 订单取消 （商家同意）
// 	OrderCancelApproved
// 	// OrderCancelCompleted 订单取消（完成）已经退款
export const orderStatus = [
    {id: 0, name: '待支付'},
    {id: 1, name: '已支付'},
    {id: 2, name: '制作中'},
    {id: 3, name: '待取餐'},
    {id: 4, name: '订单完成'},
    { id: 5, name: '拒绝取消' },
    {id: 6, name: '申请取消'},
    {id: 7, name: '同意取消'},
    { id: 8, name: '已经退款' },
    { id: 9, name: '外卖待接单' },
    { id: 10, name: '外卖接单' },
    { id: 11, name: '外卖放弃接单' },
    { id: 12, name: '外卖取货' },
    { id: 13, name: '已经送达' },
    { id: 14, name: '已经评论' },
    {id: 15, name: '订单关闭'}
];

// 状态映射表
export const orderStatusMap = [
    { id: 0, name: '待支付', color: 'orange' },
    { id: 1, name: '已支付', color: 'blue' },
    { id: 2, name: '制作中', color: 'purple' },
    { id: 3, name: '待取餐', color: 'teal' },
    { id: 4, name: '订单完成', color: 'green' },
    { id: 6, name: '申请取消', color: 'red' },
    { id: 7, name: '同意取消', color: 'red' },
    { id: 8, name: '已经退款', color: 'lightGreen' },
    { id: 9, name: '外卖待接单', color: 'amber' },
    { id: 10, name: '外卖接单', color: 'deepOrange' },
    { id: 11, name: '外卖放弃接单', color: 'brown' },
    { id: 12, name: '外卖取货', color: 'cyan' },
    { id: 13, name: '已经送达', color: 'lime' },
    { id: 14, name: '已经评论', color: 'blueGrey' },
    { id: 15, name: '订单关闭', color: 'gray' },
    { id: 16, name: '申请退款', color: 'pink' },
    { id: 17, name: '退款完成', color: 'lightBlue' }
];

// 获取状态的名称和颜色
export const getOrderStatus = (statusId: number) => {
    const status = orderStatusMap.find((item) => item.id === statusId);
    return status
        ? { name: status.name, color: status.color }
        : { name: '未知状态', color: 'black' }; // 默认状态
};