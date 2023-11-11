import { Box } from '@mui/material';
import React from 'react';
interface Props {
    children: React.ReactNode
}
const BodyEditor = (props: Props) => {
    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {props.children}
        </Box>
    );
};

export default BodyEditor;