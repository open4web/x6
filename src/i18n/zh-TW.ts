import {TranslationMessages} from 'react-admin';
import chineseMessages from './chinese';
import {posExtra} from './posCatalog';

const messages: TranslationMessages = {
    ...chineseMessages,
    pos: {
        ...posExtra['zh-TW'],
        search: '搜尋',
        configuration: '設定',
        language: '語言',
        theme: {name: '主題', light: '亮', dark: '暗'},
    },
};

export default messages;
