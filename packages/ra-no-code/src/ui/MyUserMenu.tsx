import * as React from 'react';
import { UserMenu as RaUserMenu } from 'react-admin';
import { ExitApplicationMenu } from './ExitApplicationMenu';

// @ts-ignore
export const MyUserMenu = (props) => {
    return (
        <RaUserMenu {...props}>
            <ExitApplicationMenu />
        </RaUserMenu>
    );
};
