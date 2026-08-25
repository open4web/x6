import * as React from 'react';
import {useTranslate, useUserMenu} from 'react-admin';
import {ListItemIcon, ListItemText, MenuItem} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {toast} from 'react-toastify';
import {useCartContext} from '../dataProvider/MyCartProvider';
import {invalidateCatalog} from '../utils/catalogCache';

const RefreshCatalogMenuItem = React.forwardRef<HTMLLIElement, any>((props, ref) => {
    const translate = useTranslate();
    const {onClose} = useUserMenu();
    const {merchantId} = useCartContext();

    const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
        invalidateCatalog(merchantId);
        toast.success(translate('pos.catalog.refreshed'), {position: 'top-center', autoClose: 1600});
        onClose?.();
        props.onClick?.(event);
    };

    return (
        <MenuItem ref={ref} {...props} onClick={handleClick}>
            <ListItemIcon>
                <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{translate('pos.catalog.refresh')}</ListItemText>
        </MenuItem>
    );
});

export default RefreshCatalogMenuItem;
