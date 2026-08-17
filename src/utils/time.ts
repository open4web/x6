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

const clockLocales: Record<string, string> = {
    zh: 'zh-CN',
    'zh-TW': 'zh-TW',
    en: 'en-US',
    fr: 'fr-FR',
    ja: 'ja-JP',
    ko: 'ko-KR',
    th: 'th-TH',
    vi: 'vi-VN',
    id: 'id-ID',
    es: 'es-ES',
};

export function FormatCurrentTime(locale = 'zh') {
    const intlLocale = clockLocales[locale] || locale || 'zh-CN';
    const now = new Date();
    const parts = new Intl.DateTimeFormat(intlLocale, {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        hourCycle: 'h23',
    }).formatToParts(now);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value || '';

    const year = get('year');
    const month = get('month');
    const day = get('day');
    const time = `${get('hour')}:${get('minute')}:${get('second')}`;
    const weekday = get('weekday');

    if (intlLocale.startsWith('zh') || intlLocale.startsWith('ja')) {
        return `${year}年${month}月${day}日 ${time} ${weekday}`;
    }
    if (intlLocale.startsWith('ko')) {
        return `${year}년 ${month}월 ${day}일 ${time} ${weekday}`;
    }
    return `${weekday} ${year}-${month}-${day} ${time}`;
}

/**
 * Convert nanoseconds to human-readable time string
 * @param nanoseconds Time duration in nanoseconds
 * @returns Formatted time string with appropriate unit
 */
export function FormatNanoseconds(
    nanoseconds: number,
    units: {sec?: string; min?: string; hour?: string; day?: string} = {},
): string {
    const sec = units.sec ?? 's';
    const min = units.min ?? 'min';
    const hour = units.hour ?? 'h';
    const day = units.day ?? 'd';
    const seconds = nanoseconds / 1e9;

    if (seconds < 60) {
        return `${seconds.toFixed(2)}${sec}`;
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
        return `${minutes.toFixed(2)}${min}`;
    }

    const hours = minutes / 60;
    if (hours < 24) {
        return `${hours.toFixed(2)}${hour}`;
    }

    const days = hours / 24;
    return `${days.toFixed(2)}${day}`;
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