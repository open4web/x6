import {posExtra} from './posCatalog';
import {extraUi} from './extraUi';

const catalogs: Record<string, any> = {};
const localeKeys = Object.keys(posExtra) as Array<keyof typeof posExtra>;
function deepMerge(base: any, extra: any) {
    const out = {...base};
    Object.keys(extra || {}).forEach(key => {
        if (extra[key] && typeof extra[key] === 'object' && !Array.isArray(extra[key]) && base?.[key] && typeof base[key] === 'object') {
            out[key] = {...base[key], ...extra[key]};
        } else {
            out[key] = extra[key];
        }
    });
    return out;
}

localeKeys.forEach(locale => {
    catalogs[locale] = deepMerge(posExtra[locale], (extraUi as any)[locale]);
});

function readLocale(): string {
    const keys = ['RaStore.locale', 'locale'];
    for (const key of keys) {
        const raw = localStorage.getItem(key);
        if (!raw) {
            continue;
        }
        try {
            const parsed = JSON.parse(raw);
            if (typeof parsed === 'string' && parsed) {
                return parsed;
            }
        } catch {
            if (raw) {
                return raw;
            }
        }
    }
    return 'zh';
}

function lookup(source: any, path: string): string | undefined {
    return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), source);
}

function interpolate(text: string, vars?: Record<string, string | number>) {
    if (!vars) {
        return text;
    }
    return Object.entries(vars).reduce((acc, [key, value]) => acc.replace(new RegExp(`%\\{${key}\\}`, 'g'), String(value)), text);
}

export function tPos(key: string, vars?: Record<string, string | number>): string {
    const locale = readLocale();
    const path = key.startsWith('pos.') ? key.slice(4) : key;
    const text =
        lookup(catalogs[locale], path) ||
        lookup(catalogs.en, path) ||
        lookup(catalogs.zh, path) ||
        key;
    return interpolate(String(text), vars);
}
