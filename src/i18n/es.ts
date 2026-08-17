import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.es,
        search: 'Buscar',
        configuration: 'Configuración',
        language: 'Idioma',
        theme: {name: 'Tema', light: 'Claro', dark: 'Oscuro'},
    },
};

export default messages;
