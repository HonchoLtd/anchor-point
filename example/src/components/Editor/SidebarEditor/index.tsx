import { Box } from '@mui/material';
import React from 'react';

interface Props {
    width?: number;
    children?: React.ReactNode
}

const SidebarEditor = (props: Props) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: "8px",
                height: "100%",
                width: `${props.width || 0}px`,
            }}
        >
            {props.children}
        </Box>
    );
};

export default SidebarEditor;