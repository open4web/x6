import {useEffect} from 'react';
import {useStore} from 'react-admin';

/** 小 / 中 / 大；中 = 当前默认字号（scale 1） */
export const FONT_SIZES = ['small', 'medium', 'large'] as const;
export type FontSize = typeof FONT_SIZES[number];

export const FONT_SCALE: Record<FontSize, number> = {
    small: 0.875,
    medium: 1,
    large: 1.125,
};

type FontRoot = {
    style: {setProperty: (name: string, value: string) => void; getPropertyValue?: (name: string) => string};
    dataset: DOMStringMap | Record<string, string>;
};

export function applyFontScale(size: FontSize, root?: FontRoot | null) {
    const scale = FONT_SCALE[size] ?? 1;
    const el =
        root ??
        (typeof document !== 'undefined' ? (document.documentElement as unknown as FontRoot) : null);
    if (!el) {
        return scale;
    }
    el.style.setProperty('--pos-font-scale', String(scale));
    (el.dataset as Record<string, string>).posFont = size;
    return scale;
}

export function useFontSize() {
    return useStore<FontSize>('posFontSize', 'medium');
}

/** 挂到 Appearance / Layout，刷新后恢复字号 */
export function useApplyFontSize() {
    const [fontSize] = useFontSize();
    useEffect(() => {
        applyFontScale(fontSize);
    }, [fontSize]);
    return fontSize;
}
