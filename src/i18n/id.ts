import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';
import {extraUi} from './extraUi';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.id,
        ...extraUi.id,
        cart: {...posExtra.id.cart, ...extraUi.id.cart},
        handover: {...posExtra.id.handover, ...extraUi.id.handover},
        search: 'Cari',
        configuration: 'Pengaturan',
        language: 'Bahasa',
        theme: {name: 'Tema', light: 'Terang', dark: 'Gelap'},
    },
};

export default messages;
