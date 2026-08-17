import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import {posExtra} from './posCatalog';
import {extraUi} from './extraUi';

const messages: TranslationMessages = {
    ...englishMessages,
    pos: {
        ...posExtra.es,
        ...extraUi.es,
        cart: {...posExtra.es.cart, ...extraUi.es.cart},
        handover: {...posExtra.es.handover, ...extraUi.es.handover},
        search: 'Buscar',
        configuration: 'Configuración',
        language: 'Idioma',
        theme: {name: 'Tema', light: 'Claro', dark: 'Oscuro'},
    },
};

export default messages;
