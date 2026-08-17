import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.vi,
        search: 'Tìm kiếm',
        configuration: 'Cấu hình',
        language: 'Ngôn ngữ',
        theme: {name: 'Giao diện', light: 'Sáng', dark: 'Tối'},
    },
};

export default messages;
