import { createContext, useContext } from 'react';
export var ApplicationContext = createContext(undefined);
export var useApplication = function () { return useContext(ApplicationContext); };
//# sourceMappingURL=ApplicationContext.js.map