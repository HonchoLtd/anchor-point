import { Box, Button, CardMedia, IconButton, Typography, TextField } from '@mui/material';
import back from "@src/svg/Back.svg"
import undo from "@src/svg/Undo.svg"
import redo from "@src/svg/Redo.svg"
import dot from "@src/svg/Dot.svg"
import { useAtomValue } from 'jotai';
import { modeAtom } from '@src/stores';

interface Props {
    back?: () => void
    undo?: () => void
    redo?: () => void
    save?: () => void
    nameCallback?: (e: React.ChangeEvent<HTMLInputElement>) => void
    dots?: boolean
    name?: string
}

const HeaderEditor = (props: Props) => {
    const mode = useAtomValue(modeAtom)
    return (
        <Box sx={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "80px",
            width: "100%",
        }}>
            {props.back && (
                <IconButton onClick={props.back}>
                    <CardMedia sx={{ fill: `${mode ? "#000" : "#fff"}` }} src={back} component={"img"} />
                </IconButton>
            )}
            {props.name && (
                <Box sx={{ marginLeft: "30px" }}>
                    <TextField
                        sx={{
                            width: { xs: "200px", sm: "350px" },
                            borderBottomColor: '#8D8D8D !important',
                            '& .MuiInputBase-input': {
                                textAlign: "center",
                                color: mode ? 'black' : 'white',
                                borderBottom: '2px solid #8D8D8D',
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: '#8D8D8D',
                            },
                        }}
                        defaultValue={props.name} id="standard-basic" variant="standard" onChange={props.nameCallback} />
                </Box>
            )}
            <Box sx={{
                display: "flex",
                gap: "8px"
            }}>
                {props.undo && (
                    <IconButton onClick={props.undo}>
                        <CardMedia sx={{ fill: "#fff" }} src={undo} component={"img"} />
                    </IconButton>
                )}
                {props.redo && (
                    <IconButton onClick={props.redo}>
                        <CardMedia src={redo} component={"img"} />
                    </IconButton>
                )}
                {props.save && (
                    <Button variant='text' onClick={props.save}>
                        <Typography color={mode ? "#000000" : "#FFFFFF"} variant='body1'>Save</Typography>
                    </Button>
                )}
                {props.dots && (
                    <IconButton>
                        <CardMedia src={dot} component={"img"} />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};

export default HeaderEditor;