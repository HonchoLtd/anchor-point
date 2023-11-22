import Modal from '@src/components/Modal';
import { Box, IconButton, Switch, Typography } from '@mui/material';
import Model from "./Model";
import add from "@src/assets/add.svg"
import custom from "@src/assets/custom.svg"
import fit from "@src/assets/fit.svg"
import fill from "@src/assets/fill.svg"
import FooterButton from '@src/components/Editor/FooterButton';
interface Anchor {
    anchor: "top-left" |
    "top-center" |
    "top-right" |
    "middle-left" |
    "middle-center" |
    "middle-right" |
    "bottom-left" |
    "bottom-center" |
    "bottom-right"
}
const anchorData: Anchor[] = [
    { anchor: "top-left" },
    { anchor: "top-center" },
    { anchor: "top-right" },
    { anchor: "middle-left" },
    { anchor: "middle-center" },
    { anchor: "middle-right" },
    { anchor: "bottom-left" },
    { anchor: "bottom-center" },
    { anchor: "bottom-right" }
]

const WatermarkConfig = () => {
    const { ref, onAction, orientation, mode, size, anchor, tooltip, inputRef, textRef, sticker } = Model()
    return (
        <Modal nameRef={textRef} nameCallback={onAction.nameCallback} backHandler={onAction.backHandle} saveHandler={onAction.saveHandle} name={sticker.name || "Untitled"}>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Box sx={{ display: "flex", width: "300px", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                        <IconButton onClick={() => onAction.handleOrientation("portrait")}>
                            <Box sx={{
                                width: "13px",
                                height: "18px",
                                border: `2px solid ${orientation === "portrait" ? !mode ? "#FFFFFF" : "#000000" : "#8D8D8D"}`
                            }}></Box>
                        </IconButton>
                        <IconButton onClick={() => onAction.handleOrientation("landscape")}>
                            <Box sx={{
                                height: "13px",
                                width: "22px",
                                border: `2px solid ${orientation === "landscape" ? !mode ? "#FFFFFF" : "#000000" : "#8D8D8D"}`
                            }}></Box>
                        </IconButton>
                        <IconButton onClick={() => onAction.handleOrientation("square")}>
                            <Box sx={{
                                height: "16px",
                                width: "16px",
                                border: `2px solid ${orientation === "square" ? !mode ? "#FFFFFF" : "#000000" : "#8D8D8D"}`
                            }}></Box>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", gap: "8px" }}>
                        <Switch onClick={onAction.modeHandle} checked={!mode}
                            sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "white",
                                },
                            }}
                        />
                    </Box>
                </Box>
                <canvas ref={ref} id="myCanvas" style={{ border: `1px solid #8D8D8D` }} />
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "300px" }}>
                    <FooterButton onClick={onAction.uploadHandler} icon={add} text="Upload" />
                    <input
                        ref={inputRef}
                        style={{ display: "none" }}
                        type="file"
                        accept="image/*"
                        onChange={onAction.handleFileChange}
                    />
                    <Box sx={{ height: "100%", border: "1px solid #8D8D8D" }}></Box>
                    <FooterButton onClick={() => onAction.sizeHandle("Custom")} value={size} icon={custom} text="Custom" />
                    <FooterButton onClick={() => onAction.sizeHandle("Fit")} value={size} icon={fit} text="Fit" />
                    <FooterButton onClick={() => onAction.sizeHandle("Fill")} value={size} icon={fill} text="Fill" />
                    <Box sx={{ height: "100%", border: "1px solid #8D8D8D" }}></Box>
                    <Box sx={{ width: "50px", height: "50px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", mt: "5px" }}>
                        {tooltip && (
                            <Box sx={{ position: "absolute", width: "50px", height: "50px", border: "1px solid #8D8D8D", mt: "-60px", borderRadius: "10px", backgroundColor: !mode ? "black" : "white", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "5px", padding: "5px" }}>
                                {anchorData.map((data, index) => (
                                    <Box onClick={() => onAction.setAnchor(data.anchor)} key={index} sx={{ width: "8px", height: "8px", backgroundColor: anchor === data.anchor ? (!mode ? "white" : "black") : (!mode ? "black" : "white"), border: "1px solid #8D8D8D", borderRadius: "50px", cursor: "pointer" }}></Box>
                                ))}
                            </Box>
                        )}
                        <Box onClick={onAction.openTooltip} sx={{ width: "20px", height: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "1px", cursor: "pointer" }}>
                            {anchorData.map((data, index) => (
                                <Box key={index} sx={{ width: "3px", height: "3px", backgroundColor: anchor === data.anchor ? (!mode ? "white" : "black") : (!mode ? "black" : "white"), border: "1px solid #8D8D8D", borderRadius: "50px" }}></Box>
                            ))}
                        </Box>
                        <Typography color="#8D8D8D" variant="bodyMedium">Anchor</Typography>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default WatermarkConfig;