import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.ko,
        search: '검색',
        configuration: '설정',
        language: '언어',
        theme: {name: '테마', light: '밝게', dark: '어둡게'},
    },
};

export default messages;
