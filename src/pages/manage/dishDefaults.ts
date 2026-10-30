export const DEFAULT_STOCK = 999;
export const DEFAULT_UNIT = '份';
export const DEFAULT_PACK = '0';
export const DEFAULT_MIN_BUY = 1;
export const DISH_UNITS = ['份', '碗', '杯', '个', '瓶', '盘'];
export const MIN_BUY_OPTIONS = ['1', '2', '3', '5'];

export type DishImage = {
    id: string;
    category: string;
    src: string;
};

export const DISH_IMAGES: DishImage[] = [
    {id: 'hot', category: '热菜', src: '/dish-presets/hot.svg'},
    {id: 'cold', category: '凉菜', src: '/dish-presets/cold.svg'},
    {id: 'staple', category: '主食', src: '/dish-presets/staple.svg'},
    {id: 'soup', category: '汤', src: '/dish-presets/soup.svg'},
    {id: 'drink', category: '饮品', src: '/dish-presets/drink.svg'},
    {id: 'snack', category: '小食', src: '/dish-presets/snack.svg'},
    {id: 'combo', category: '套餐', src: '/dish-presets/combo.svg'},
    {id: 'other', category: '其他', src: '/dish-presets/other.svg'},
];

export function coverForCategory(category: string): string {
    const found = DISH_IMAGES.find((img) => img.category === category.trim());
    return found?.src || '/dish-presets/other.svg';
}

/** 没点 AI 时的一句介绍。服务端缺省文案与这里保持同一句。 */
export function fallbackIntro(name: string, category: string): string {
    const dish = name.trim();
    if (!dish) return '';
    const kind = category.trim() || '招牌';
    const text = `${dish}，${kind}现做，欢迎品尝。`;
    return Array.from(text).slice(0, 80).join('');
}
