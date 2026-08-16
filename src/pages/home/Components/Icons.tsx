export const MENU_ICONS = [
    { id: '0', name: '推荐1', url: '/icons/0.svg' },
    { id: '1', name: '推荐2', url: '/icons/1.svg' },
    { id: '2', name: '热门1', url: '/icons/2.svg' },
    { id: '3', name: '热门2', url: '/icons/3.svg' },
    { id: '4', name: '新的', url: '/icons/4.svg' },
    { id: '5', name: '面条', url: '/icons/5.svg' },
    { id: '6', name: '茶', url: '/icons/6.svg' },
    { id: '7', name: '餐具', url: '/icons/7.svg' },
    { id: '8', name: '饮料', url: '/icons/8.svg' },
    { id: '9', name: '螺蛳粉', url: '/icons/9.svg' },
    { id: '10', name: '果蔬', url: '/icons/10.svg' },
    { id: '11', name: '卤菜', url: '/icons/11.svg' },
    { id: '99', name: '其他', url: '/icons/99.svg' },
];

export const MENU_ICON_MAP = MENU_ICONS.reduce<Record<string, string>>((map, item) => {
    map[item.id] = item.url;
    return map;
}, {});

const isImageSrc = (value?: string) => {
    if (!value) return false;
    return (
        value.startsWith('http://') ||
        value.startsWith('https://') ||
        value.startsWith('//') ||
        value.startsWith('/') ||
        value.startsWith('data:')
    );
};

export const resolveMenuIconUrl = (icon?: string) => {
    if (!icon) return undefined;
    if (MENU_ICON_MAP[icon]) return MENU_ICON_MAP[icon];
    if (isImageSrc(icon)) return icon;
    return undefined;
};

export const getMenuIcon = (id?: string) => MENU_ICONS.find(item => item.id === id);
