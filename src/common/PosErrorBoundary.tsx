import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {invalidateCatalog} from '../utils/catalogCache';

type State = {error: Error | null};

/** Keeps a render crash from blanking the whole POS screen. */
export class PosErrorBoundary extends React.Component<{children: React.ReactNode}, State> {
    state: State = {error: null};

    static getDerivedStateFromError(error: Error): State {
        return {error};
    }

    private reloadCatalog = () => {
        try {
            const storeId = localStorage.getItem('current_store_id') || undefined;
            invalidateCatalog(storeId);
        } catch {
            /* ignore */
        }
        this.setState({error: null});
    };

    private hardReload = () => {
        window.location.reload();
    };

    render() {
        if (!this.state.error) {
            return this.props.children;
        }
        return (
            <Box sx={{p: 4, textAlign: 'center'}}>
                <Typography variant="h6" gutterBottom>点餐页出了点问题</Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                    {this.state.error.message || '未知错误'}
                </Typography>
                <Button variant="contained" onClick={this.reloadCatalog} sx={{mr: 1}}>重新加载菜谱</Button>
                <Button variant="outlined" onClick={this.hardReload}>刷新页面</Button>
            </Box>
        );
    }
}
