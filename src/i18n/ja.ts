import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.ja,
        search: '検索',
        configuration: '設定',
        language: '言語',
        theme: {name: 'テーマ', light: 'ライト', dark: 'ダーク'},
    },
};

export default messages;
