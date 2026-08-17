import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';
import {extraUi} from './extraUi';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.vi,
        ...extraUi.vi,
        cart: {...posExtra.vi.cart, ...extraUi.vi.cart},
        handover: {...posExtra.vi.handover, ...extraUi.vi.handover},
        search: 'Tìm kiếm',
        configuration: 'Cấu hình',
        language: 'Ngôn ngữ',
        theme: {name: 'Giao diện', light: 'Sáng', dark: 'Tối'},
    },
};

export default messages;
