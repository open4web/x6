import {maxLength, minLength, number, required, TextInput, useTranslate,} from 'react-admin'
import LockIcon from '@mui/icons-material/Lock';

import {Avatar, Box, Button, Card, CardActions, CircularProgress,} from '@mui/material';
import * as React from "react";

// 参考文档 https://marmelab.com/react-admin/Validation.html#per-input-validation-built-in-field-validators
const validatePhone = [required(), number(), minLength(11), maxLength(11)];
const validatePassword = [required(), minLength(6), maxLength(18)];

interface LoginCardProps {
    loading: boolean;
    color: string;
}


const LoginCard: React.FC<LoginCardProps> = ({ loading, color }) => {

    const translate = useTranslate();

    return (
        <Card sx={{minWidth: 300, borderRadius: 3}}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Avatar sx={{bgcolor: color}}>
                    <LockIcon/>
                </Avatar>
            </Box>
            <Box
                sx={{
                    marginTop: "1em",
                    display: "flex",
                    justifyContent: "center",
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                {"CHANGE ME: put your title here"}
            </Box>
            <Box sx={{padding: "0 1em 1em 1em"}}>
                <Box sx={{marginTop: "1em"}}>
                    <TextInput
                        autoFocus
                        size={"medium"}
                        source="phone"
                        label={translate("pos.auth.phone")}
                        disabled={loading}
                        validate={validatePhone}
                        fullWidth
                        name={"phone"}
                    />
                </Box>
                <Box sx={{marginTop: "1em"}}>
                    <TextInput
                        source="password"
                        label={translate("ra.auth.password")}
                        type="password"
                        disabled={loading}
                        validate={validatePassword}
                        fullWidth
                        name={"password"}
                    />
                </Box>
            </Box>
            <CardActions sx={{padding: "0 1em 1em 1em"}}>
                <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={loading}
                    fullWidth
                >
                    {loading && <CircularProgress size={25} thickness={2}/>}
                    {translate("ra.auth.sign_in")}
                </Button>
            </CardActions>
        </Card>
    )
}

export default LoginCard;