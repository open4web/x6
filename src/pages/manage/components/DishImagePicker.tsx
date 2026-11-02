import * as React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {tPos} from '../../../i18n/t';
import {DISH_IMAGES, coverForCategory} from '../dishDefaults';

type Props = {
    category: string;
    picked: string;
    onPick: (src: string) => void;
};

export default function DishImagePicker({category, picked, onPick}: Props) {
    const fallback = coverForCategory(category);
    const current = picked || fallback;
    return (
        <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 1}}>
            {DISH_IMAGES.map((img) => {
                const selected = current === img.src;
                const isDefault = img.src === fallback;
                return (
                    <Button
                        key={img.id}
                        onClick={() => onPick(isDefault ? '' : img.src)}
                        aria-pressed={selected}
                        aria-label={img.category}
                        sx={{
                            minHeight: 96,
                            p: 0.75,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: selected ? 'primary.main' : 'divider',
                            color: 'text.primary',
                        }}
                    >
                        <Box
                            component="img"
                            src={img.src}
                            alt=""
                            sx={{width: 48, height: 48, borderRadius: 1.5}}
                        />
                        <Typography sx={{fontSize: 14, fontWeight: 800, mt: 0.5, lineHeight: 1.1}}>
                            {img.category}
                        </Typography>
                        {isDefault && (
                            <Typography sx={{fontSize: 11, fontWeight: 700, color: 'primary.main', lineHeight: 1.2}}>
                                {tPos('manage.dish_image_default_mark')}
                            </Typography>
                        )}
                    </Button>
                );
            })}
        </Box>
    );
}
