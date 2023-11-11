import { Box, CardMedia, IconButton, Typography } from "@mui/material"
import { modeAtom } from "@src/stores";
import { useAtomValue } from "jotai";

interface Props {
    icon: string,
    onClick?: () => void,
    text: string,
    value?: "Custom" | "Fit" | "Fill"
}

const FooterButton = (props: Props) => {
    const mode = useAtomValue(modeAtom)
    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <IconButton onClick={props.onClick}>
                <CardMedia src={props.icon} component={"img"} />
            </IconButton>
            <Typography sx={{ color: props.value === props.text ? mode ? "#000000" : "#FFFFFF" : "#8D8D8D" }} variant="bodyMedium" >{props.text}</Typography>
        </Box>
    );
};

export default FooterButton;