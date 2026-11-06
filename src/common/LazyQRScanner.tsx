import React from 'react';
import {Box, CircularProgress} from '@mui/material';

const QRScanner = React.lazy(() => import('./ScanCode'));

type Props = {
    onScanSuccess: (code: string) => void;
    onScanLimitReached?: () => void;
};

/** Camera scanner stays out of the order screen until a scan tab renders. */
export default function LazyQRScanner(props: Props) {
    return (
        <React.Suspense
            fallback={(
                <Box sx={{display: 'flex', justifyContent: 'center', py: 6}}>
                    <CircularProgress />
                </Box>
            )}
        >
            <QRScanner {...props} />
        </React.Suspense>
    );
}
