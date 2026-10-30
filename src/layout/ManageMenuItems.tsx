import * as React from 'react';
import {useUserMenu} from 'react-admin';
import {ListItemIcon, ListItemText, MenuItem} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import {useNavigate} from 'react-router-dom';
import {tPos} from '../i18n/t';
import {canManageStoreAndDishes} from '../utils/posRole';

export const StoreManageMenuItem = React.forwardRef<HTMLLIElement, any>((props, ref) => {
    const navigate = useNavigate();
    const {onClose} = useUserMenu();
    if (!canManageStoreAndDishes()) return null;
    return (
        <MenuItem
            ref={ref}
            {...props}
            onClick={(event) => {
                props.onClick?.(event);
                onClose?.();
                navigate('/manage/store');
            }}
        >
            <ListItemIcon><StorefrontIcon fontSize="small" /></ListItemIcon>
            <ListItemText>{tPos('manage.menu_store')}</ListItemText>
        </MenuItem>
    );
});

export const DishManageMenuItem = React.forwardRef<HTMLLIElement, any>((props, ref) => {
    const navigate = useNavigate();
    const {onClose} = useUserMenu();
    if (!canManageStoreAndDishes()) return null;
    return (
        <MenuItem
            ref={ref}
            {...props}
            onClick={(event) => {
                props.onClick?.(event);
                onClose?.();
                navigate('/manage/dishes');
            }}
        >
            <ListItemIcon><RestaurantMenuIcon fontSize="small" /></ListItemIcon>
            <ListItemText>{tPos('manage.menu_dish')}</ListItemText>
        </MenuItem>
    );
});
