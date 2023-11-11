import Model from "./Model";
import Modal from "@src/components/Modal";
import { Box, Button, CardMedia, Divider, IconButton, Typography } from "@mui/material";
import SidebarEditor from "@src/components/Editor/SidebarEditor";
import watermarkIcon from "@src/svg/Watermark-White.svg"

const WatermarkEditor = () => {
    const { ref, onAction, watermarkData } = Model();

    return (
        <>
            <Modal undoHandler={onAction.undoHandler} redoHandler={onAction.redoHandler} backHandler={onAction.backHandler} saveHandler={onAction.saveHandler}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "500px",
                        gap: "8px"
                    }}
                >
                    <canvas ref={ref} id="myCanvas"></canvas>
                </Box>
                <SidebarEditor width={250} >
                    <Button onClick={onAction.createWatermark} startIcon={
                        <CardMedia src={watermarkIcon} component={"img"} />
                    }>
                        <Typography color={"#FFFFFF"} variant="buttonMedium" >Create watermark</Typography>
                    </Button>
                    <Divider color="#fff" />
                    {watermarkData.map((data, index) => (
                        <Box sx={{ cursor: "pointer" }} key={index}>
                            <Typography color="#fff">{data.name}</Typography>
                        </Box>
                    ))}
                </SidebarEditor>
                <SidebarEditor width={50} >
                    <IconButton>
                        <CardMedia sx={{ width: "24px", height: "24px" }} color="inherit" src={watermarkIcon} component={"img"} />
                    </IconButton>
                    <IconButton>
                        <CardMedia sx={{ width: "24px", height: "24px" }} color="inherit" src={watermarkIcon} component={"img"} />
                    </IconButton>
                    <IconButton>
                        <CardMedia sx={{ width: "24px", height: "24px" }} color="inherit" src={watermarkIcon} component={"img"} />
                    </IconButton>
                </SidebarEditor>
            </Modal>
        </>
    )
};

export default WatermarkEditor;
