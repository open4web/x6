import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {useTranslate, Title} from 'react-admin';
import {AppearancePanel} from '../layout/AppearanceMenu';

const Configuration = () => {
    const translate = useTranslate();
    return (
        <Card>
            <Title title={translate('pos.configuration')}/>
            <CardContent sx={{maxWidth: 400}}>
                <AppearancePanel />
            </CardContent>
        </Card>
    );
};

export default Configuration;
