import Button from '@mui/material/Button';
import ReadMoreIcon from '@mui/icons-material/ReadMore';

const RightBarButton = () => {
    const handleClick = () => {
        // setOpen(true);
        console.log("open ...")
    };
    return (
        <Button
            startIcon={<ReadMoreIcon fontSize={"small"}/>}
            color={"inherit"}
            onClick={handleClick}
            // sx={{
            //     maxHeight: "50px",
            //     fontSize: "5",
            //
            // }}
        >
        </Button>
    );
}

export default RightBarButton;