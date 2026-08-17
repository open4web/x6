import {TranslationMessages} from 'react-admin';
import chineseMessages from './chinese';
import {posExtra} from './posCatalog';
import {extraUi} from './extraUi';

const messages: TranslationMessages = {
    ...chineseMessages,
    pos: {
        ...posExtra['zh-TW'],
        ...extraUi['zh-TW'],
        cart: {...posExtra['zh-TW'].cart, ...extraUi['zh-TW'].cart},
        handover: {...posExtra['zh-TW'].handover, ...extraUi['zh-TW'].handover},
        search: '搜尋',
        configuration: '設定',
        language: '語言',
        theme: {name: '主題', light: '亮', dark: '暗'},
    },
};

export default messages;
