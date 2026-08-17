import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.th,
        search: 'ค้นหา',
        configuration: 'ตั้งค่า',
        language: 'ภาษา',
        theme: {name: 'ธีม', light: 'สว่าง', dark: 'มืด'},
    },
};

export default messages;
