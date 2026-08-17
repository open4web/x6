import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';
import {extraUi} from './extraUi';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.ko,
        ...extraUi.ko,
        cart: {...posExtra.ko.cart, ...extraUi.ko.cart},
        handover: {...posExtra.ko.handover, ...extraUi.ko.handover},
        search: '검색',
        configuration: '설정',
        language: '언어',
        theme: {name: '테마', light: '밝게', dark: '어둡게'},
    },
};

export default messages;
