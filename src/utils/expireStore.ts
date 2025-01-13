// 存储当前时间戳
export function storeOrderTimestamp(orderId: string): void {
    const currentTimestamp = Date.now(); // 获取当前时间戳
    localStorage.setItem(orderId, currentTimestamp.toString()); // 存储为字符串
    console.log(`Stored timestamp for order ${orderId}: ${currentTimestamp}`);
}

// 获取存储的时间戳
export function getOrderTimestamp(orderId: string): number | null {
    const timestamp = localStorage.getItem(orderId);
    return timestamp ? parseInt(timestamp, 10) : null; // 转换为数字或返回 null
}

// 检查是否过期并自动移除
export function isOrderExpired(orderId: string, ttl: number): boolean {
    const timestamp = getOrderTimestamp(orderId);
    if (timestamp === null) {
        return true; // 如果不存在，则认为已过期
    }

    const isExpired = Date.now() > timestamp + ttl; // 判断是否超出有效期

    if (isExpired) {
        localStorage.removeItem(orderId); // 自动移除过期的键值
        console.log(`Order ${orderId} has expired and has been removed from localStorage.`);
    }

    return isExpired;
}