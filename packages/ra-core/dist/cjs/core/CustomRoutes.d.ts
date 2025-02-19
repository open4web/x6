import { ReactNode } from 'react';
/**
 * This component allows you to provide custom routes to the Admin.
 * @param props The component props
 * @param props.children The custom routes.
 * @param props.noLayout A boolean indicating whether to render the routes outside the Layout. Defaults to false.
 * @returns Nothing. This is a configuration component.
 */
export declare const CustomRoutes: {
    (props: CustomRoutesProps): any;
    raName: string;
};
export declare type CustomRoutesProps = {
    children: ReactNode;
    noLayout?: boolean;
};
//# sourceMappingURL=CustomRoutes.d.ts.map