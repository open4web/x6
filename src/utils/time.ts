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