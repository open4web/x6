import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';
import {extraUi} from './extraUi';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.th,
        ...extraUi.th,
        cart: {...posExtra.th.cart, ...extraUi.th.cart},
        handover: {...posExtra.th.handover, ...extraUi.th.handover},
        search: 'ค้นหา',
        configuration: 'ตั้งค่า',
        language: 'ภาษา',
        theme: {name: 'ธีม', light: 'สว่าง', dark: 'มืด'},
    },
};

export default messages;
