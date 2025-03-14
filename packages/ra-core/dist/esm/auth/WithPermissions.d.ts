import { ReactElement, ComponentType } from 'react';
import { Location } from 'react-router-dom';
export interface WithPermissionsChildrenParams {
    permissions: any;
}
declare type WithPermissionsChildren = (params: WithPermissionsChildrenParams) => ReactElement;
export interface WithPermissionsProps {
    authParams?: object;
    children?: WithPermissionsChildren;
    component?: ComponentType<any>;
    location?: Location;
    render?: WithPermissionsChildren;
    staticContext?: object;
    [key: string]: any;
}
declare const _default: ComponentType<WithPermissionsProps>;
export default _default;
//# sourceMappingURL=WithPermissions.d.ts.map