import * as React from 'react';
import { AppBar as RaAppBar, AppBarProps } from 'react-admin';
import { MyUserMenu } from './MyUserMenu';

export const AppBar = (props: AppBarProps) => (
    <RaAppBar {...props} userMenu={<MyUserMenu />} />
);
