import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {useTranslate, useLocaleState, Title} from 'react-admin';

const Configuration = () => {
    const translate = useTranslate();
    const [locale, setLocale] = useLocaleState();
    // @ts-ignore
    return (
        <Card>
            <Title title={translate('pos.configuration')}/>
            <CardContent>
                <Box sx={{width: '10em', display: 'inline-block'}}>
                    {translate('pos.language')}
                </Box>
                <Button
                    variant="contained"
                    sx={{margin: '1em'}}
                    color={locale === 'en' ? 'primary' : 'secondary'}
                    onClick={() => setLocale('en')}
                >
                    en
                </Button>
                <Button
                    variant="contained"
                    sx={{margin: '1em'}}
                    color={locale === 'fr' ? 'primary' : 'secondary'}
                    onClick={() => setLocale('fr')}
                >
                    fr
                </Button>

                <Button
                    variant="contained"
                    sx={{margin: '1em'}}
                    color={locale === 'zh' ? 'primary' : 'secondary'}
                    onClick={() => setLocale('zh')}
                >
                    zh
                </Button>
            </CardContent>
        </Card>
    );
};

export default Configuration;
