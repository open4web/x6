/// <reference types="react" />
import { Application } from './ApplicationsDashboard';
export declare type ApplicationContextValue = {
    application: Application;
    onExit: () => void;
};
export declare const ApplicationContext: import("react").Context<ApplicationContextValue>;
export declare const useApplication: () => ApplicationContextValue;
//# sourceMappingURL=ApplicationContext.d.ts.map