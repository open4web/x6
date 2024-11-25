import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PropsChoose from "./Components/PropsChoose";
import Box from "@mui/material/Box";
import {ProductItem} from "./Components/Type";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

interface Props {
    item: ProductItem;
    handleClick: (item: any) => void;
}

const MyCard = (props: Props) => {
    const { item, handleClick } = props;
    const [expanded, setExpanded] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleAddToCart = () => {
        // Perform the "Add to Cart" action
        handleClick(item);
        // Close the Collapse and restore CardContent
        setExpanded(false);
    };

    return (
        <Card sx={{ maxWidth: 445, margin: 1 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        X
                    </Avatar>
                }
                title={item?.name}
                subheader={item?.price}
            />
            <CardMedia
                component="img"
                height="194"
                image={item?.img}
                alt="暂无图片"
            />
            {/* Conditional rendering for CardContent */}
            {!expanded && (
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {item?.desc}
                    </Typography>
                </CardContent>
            )}
            <CardActions disableSpacing>
                {/* Hide "Add to Cart" when expanded */}
                {!expanded && (
                    <IconButton
                        aria-label="add to cart"
                        onClick={handleAddToCart}
                        sx={{
                            color: 'success', // 显著的颜色，可以替换为其他颜色
                            '&:hover': {
                                color: 'darkorange', // 悬停时的颜色
                            },
                        }}
                    >
                        <AddShoppingCartIcon
                            sx={{
                                fontSize: 40, // 增大图标尺寸，默认是 24
                            }}
                        />
                    </IconButton>
                )}
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <PropsChoose items={item.spiceOptions} />
                    {/* Add "Add to Cart" button to the bottom when expanded */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>

                        <IconButton
                            aria-label="add to cart"
                            onClick={handleAddToCart}
                            sx={{
                                color: 'primary', // 显著的颜色，可以替换为其他颜色
                                '&:hover': {
                                    color: 'darkorange', // 悬停时的颜色
                                },
                            }}
                        >
                            <AddShoppingCartIcon
                                sx={{
                                    fontSize: 40, // 增大图标尺寸，默认是 24
                                }}
                            />
                        </IconButton>
                    </Box>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default MyCard;