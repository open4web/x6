//  FormatTimestampAsDatetime 将时间戳转换为可读的时间日期
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