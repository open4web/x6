//  FormatTimestampAsDatetime 将时间戳转换为可读的时间日期
import {CartItem} from "../common/types";

export const FormatTimestampAsDatetime = (timestamp: string | number): string => {
    const numericTimestamp = typeof timestamp === 'string' ? Number(timestamp) : timestamp;

    if (isNaN(numericTimestamp)) {
        return 'Invalid timestamp';
    }

    const timestampInMillis = numericTimestamp < 1e12 ? numericTimestamp * 1000 : numericTimestamp;
    const date = new Date(timestampInMillis);

    return date.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
};


export const FormatTimestampAsTime = (timestamp: string | number): string => {
    const numericTimestamp = typeof timestamp === 'string' ? Number(timestamp) : timestamp;

    if (isNaN(numericTimestamp)) {
        return 'Invalid timestamp';
    }

    // 如果时间戳是秒级，将其转换为毫秒级
    const timestampInMillis = numericTimestamp < 1e12 ? numericTimestamp * 1000 : numericTimestamp;
    const date = new Date(timestampInMillis);

    // 格式化为仅包含时间部分
    return date.toLocaleTimeString('zh-CN', { hour12: false });
};

export function FormatCurrentTime() {
    const now = new Date();

    // Get weekday in Chinese
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];

    // Determine morning or evening
    const hours = now.getHours();
    const timeOfDay = hours < 12 ? '早上' : hours < 18 ? '下午' : '晚上';

    // Format date and time
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const date = String(now.getDate()).padStart(2, '0');
    const hour = String(hours).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    return `${year}年${month}月${date}日 ${hour}:${minute}:${second} ${timeOfDay} ${weekday}`;
}

/**
 * Convert nanoseconds to human-readable time string
 * @param nanoseconds Time duration in nanoseconds
 * @returns Formatted time string with appropriate unit
 */
export function FormatNanoseconds(nanoseconds: number): string {
    // Convert nanoseconds to seconds
    const seconds = nanoseconds / 1e9;

    if (seconds < 60) {
        // Less than 1 minute - show in seconds
        return `${seconds.toFixed(2)}秒`;
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
        // Less than 1 hour - show in minutes
        return `${minutes.toFixed(2)}分钟`;
    }

    const hours = minutes / 60;
    if (hours < 24) {
        // Less than 1 day - show in hours
        return `${hours.toFixed(2)}小时`;
    }

    // 1 day or more - show in days
    const days = hours / 24;
    return `${days.toFixed(2)}天`;
}


export function convertToOrderRequest(cartItems: CartItem[]) {
    return cartItems.map((item) => ({
        ID: item.id,
        Number: item.quantity,
        Price: item.price,
        Name: item.name,
        props_text: item.desc,
    }));
}