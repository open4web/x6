import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';
import {extraUi} from './extraUi';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.ja,
        ...extraUi.ja,
        cart: {...posExtra.ja.cart, ...extraUi.ja.cart},
        handover: {...posExtra.ja.handover, ...extraUi.ja.handover},
        search: '検索',
        configuration: '設定',
        language: '言語',
        theme: {name: 'テーマ', light: 'ライト', dark: 'ダーク'},
    },
};

export default messages;
