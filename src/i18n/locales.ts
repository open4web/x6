export const supportedLocales = [
    {locale: 'zh', name: '简体中文'},
    {locale: 'zh-TW', name: '繁體中文'},
    {locale: 'en', name: 'English'},
    {locale: 'fr', name: 'Français'},
    {locale: 'ja', name: '日本語'},
    {locale: 'ko', name: '한국어'},
    {locale: 'th', name: 'ไทย'},
    {locale: 'vi', name: 'Tiếng Việt'},
    {locale: 'id', name: 'Bahasa Indonesia'},
    {locale: 'es', name: 'Español'},
] as const;

export type AppLocale = typeof supportedLocales[number]['locale'];
