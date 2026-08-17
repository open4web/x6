import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.id,
        search: 'Cari',
        configuration: 'Pengaturan',
        language: 'Bahasa',
        theme: {name: 'Tema', light: 'Terang', dark: 'Gelap'},
    },
};

export default messages;
