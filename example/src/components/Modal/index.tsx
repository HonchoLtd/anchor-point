import { Box, Container } from "@mui/material";
import HeaderEditor from "@src/components/Editor/HeaderEditor";
import BodyEditor from "@src/components/Editor/BodyEditor";
import FooterEditor from "@src/components/Editor/FooterEditor";
import { useAtomValue } from "jotai";
import { modeAtom } from "@src/stores";
interface Props {
    backHandler?: () => void
    undoHandler?: () => void
    redoHandler?: () => void
    saveHandler?: () => void
    nameCallback?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    name?: string
    children?: React.ReactNode,
}
const Modal = (props: Props) => {
    const mode = useAtomValue(modeAtom)
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                border: "1px solid black",
                backgroundColor: !mode ? "#000000" : "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <Container maxWidth="xl" >
                <HeaderEditor nameCallback={props.nameCallback} name={props.name} back={props.backHandler} undo={props.undoHandler} redo={props.redoHandler} save={props.saveHandler} />
                <BodyEditor>
                    {props.children}
                </BodyEditor>
                <FooterEditor />
            </Container>
        </Box>
    );
};

export default Modal;