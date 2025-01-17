import {Box, Card, CardActions, CardContent} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import React from "react";

export function MyOrderSkeleton(index: number) {
    return <Box key={index} sx={{flexShrink: 0, width: 300}}>
        <Card
            variant="outlined"
            sx={{
                boxShadow: 3,
                padding: 0,
                borderRadius: 1,
            }}
        >
            <CardContent>
                <Skeleton variant="text" width="80%" height={24}/>
                <Skeleton variant="rectangular" width="100%" height={100}/>
            </CardContent>
            <CardActions>
                <Skeleton variant="rectangular" width="30%" height={40}/>
                <Skeleton variant="rectangular" width="30%" height={40}/>
            </CardActions>
        </Card>
    </Box>;
}