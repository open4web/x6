import {Box} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExtensionIcon from "@mui/icons-material/Extension";
import CallIcon from "@mui/icons-material/Call";
import AlarmIcon from "@mui/icons-material/Alarm";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import CampaignIcon from "@mui/icons-material/Campaign";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import * as React from "react";

const MyAppBadge = (props: { srcUrl?: any }) => {
    return (<Box sx={{display: {xs: 'none', md: 'flex', alignItems: 'flex-end'}}}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
                <MailIcon/>
            </Badge>
        </IconButton>
        <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
        >
            <Badge badgeContent={5} color="error">
                <NotificationsIcon/>
            </Badge>
        </IconButton>
        <IconButton
            size="large"
            aria-label="show 17 new apps"
            color="inherit"
        >
            <Badge badgeContent={6} color="error">
                <ExtensionIcon/>
            </Badge>
        </IconButton>
        <IconButton
            size="large"
            aria-label="show 17 new apps"
            color="inherit"
        >
            <Badge badgeContent={3} color="error">
                <CallIcon/>
            </Badge>
        </IconButton>
        <IconButton
            size="large"
            aria-label="show 3 new apps"
            color="inherit"
        >
            <Badge badgeContent={5} color="info">
                <AlarmIcon/>
            </Badge>
        </IconButton>
        <IconButton
            size="large"
            aria-label="show 17 new apps"
            color="inherit"
        >
            <Badge badgeContent={5} color="info">
                <AddRoadIcon/>
            </Badge>
        </IconButton>
        <IconButton
            size="large"
            aria-label="show 17 new apps"
            color="inherit"
        >
            <Badge badgeContent={7} color="success">
                <CampaignIcon/>
            </Badge>
        </IconButton>

        <IconButton
            size="large"
            aria-label="show 17 new apps"
            color="inherit"
        >
            <Badge badgeContent={234} color="success">
                <SupervisedUserCircleIcon/>
            </Badge>
        </IconButton>
    </Box>)
}

export default MyAppBadge;
