import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState, ChangeEvent, useCallback } from "react"
import { modeAtom, watermarkData } from "@src/stores";
import { useAtom } from "jotai";
import Watermark from "@dist/index"
// import { EventCustom } from "@src/types";
import { UploadWatermark } from "@src/service/watermark";
import { Centrifuge } from "centrifuge";
import { Sticker, WatermarkConfig } from "@src/types";

interface OnAction {
    backHandle: () => void;
    saveHandle: () => void;
    handleOrientation: (e: "portrait" | "landscape" | "square") => void;
    modeHandle: () => void;
    sizeHandle: (e: "Custom" | 'Fit' | "Fill") => void;
    setAnchor: (e: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right") => void;
    openTooltip: () => void;
    closeTooltip: () => void;
    uploadHandler: () => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    nameCallback: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Model = () => {
    const navigate = useNavigate()
    const ref = useRef<HTMLCanvasElement>(null)
    const inputRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLDivElement>(null)
    const [mode, setMode] = useAtom(modeAtom)
    // const [sticker, setSticker] = useAtom(stickerConfig)
    const [watermark, setWatermark] = useState<Watermark | undefined>(undefined)
    const [tooltip, setTooltip] = useState<boolean>(false)
    const [sticker, setSticker] = useAtom(watermarkData)
    const [orientation, setOrientation] = useState<"portrait" | "landscape" | "square">("portrait")
    const [size, setSize] = useState<"Custom" | "Fit" | "Fill">("Custom")
    const [anchor, setAnchor] = useState<"top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right">("top-left")
    const [ws, setWs] = useState<Centrifuge | undefined>(undefined)

    useEffect(() => {
        if (ref.current) {
            const w = new Watermark("myCanvas")
            setWatermark(w)
        }
    }, [ref])

    useEffect(() => {
        const centrifuge = new Centrifuge("ws://127.0.0.1:9090/connection/editor/socket?firebase_uid=1234&event_id=1")
        setWs(centrifuge)
    }, [])

    useEffect(() => {
        if (ws) {
            const channel = ws.newSubscription("watermark:1234")
            const channelOrientation = ws.newSubscription("watermark:1234:orientation")
            const channelName = ws.newSubscription("watermark:1234:name")
            channel.on("subscribed", async () => {
                await ws.rpc("get", {})
                    .then(ctx => {
                        console.log("get data from backend", ctx.data)
                        const tempOrientation: "portrait" | "landscape" | "square" = ctx.data.orientation
                        const temp: WatermarkConfig = { ...ctx.data }
                        setSticker(temp)
                        if (temp[tempOrientation].index >= 0) {
                            setAnchor(temp[tempOrientation].stickers[temp[tempOrientation].index].anchor)
                            setSize(temp[tempOrientation].stickers[temp[tempOrientation].index].size)
                            watermark?.setStickerConfig(temp[tempOrientation].stickers[temp[tempOrientation].index])
                        }
                    })
                    .catch(e => {
                        console.log("error : ", e)
                    })
            })
            channel.on("publication", async (ctx) => {
                console.log("data publish from backend : ", ctx.data)
                const tempOrientation: "portrait" | "landscape" | "square" = ctx.data.orientation
                const temp: WatermarkConfig = ctx.data
                setSticker(temp)
                if (temp[tempOrientation].index >= 0) {
                    setAnchor(temp[tempOrientation].stickers[temp[tempOrientation].index].anchor)
                    setSize(temp[tempOrientation].stickers[temp[tempOrientation].index].size)
                    watermark?.setStickerConfig(temp[tempOrientation].stickers[temp[tempOrientation].index])
                }
            })
            channelOrientation.on("publication", async (ctx) => {
                if (ctx.data) {
                    switch (ctx.data) {
                        case "portrait":
                            watermark?.setCanvasSize(300, 400);
                            break;
                        case "landscape":
                            watermark?.setCanvasSize(600, 400);
                            break;
                        default:
                            watermark?.setCanvasSize(400, 400);
                            break;
                    }
                    setOrientation(ctx.data)
                }
            })
            channelName.on("publication", async (ctx) => {
                setSticker({ ...sticker, name: ctx.data })
            })
            ws.connect()
            channel.subscribe()
            channelOrientation.subscribe()
            channelName.subscribe()
            return () => {
                ws.disconnect()
                channel.unsubscribe()
                channelOrientation.unsubscribe()
                channelName.unsubscribe()
            }
        }
    }, [ws])

    useEffect(() => {
        const temp = { ...sticker }
        const watermarkData: Sticker = temp[orientation].stickers[temp[orientation].index];
        if (watermarkData) {
            watermark?.setStickerConfig(watermarkData)
        } else {
            watermark?.setStickerConfig({
                link: "",
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                anchor: "top-left",
                size: "Custom",
                rotation: 0,
            })
        }
    }, [orientation, sticker])

    const handleUndoRedo = useCallback((event: KeyboardEvent) => {
        if (!ws) return;
        if (event.ctrlKey && event.key === 'z') {
            ws.rpc("undo", {})
                .then((ctx) => {
                    console.log(ctx.data)
                })
                .catch((e) => {
                    console.log(e)
                })
        } else if (event.ctrlKey && event.key === 'y') {
            ws.rpc("redo", {})
                .then((ctx) => {
                    console.log(ctx.data)
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [sticker])

    useEffect(() => {
        document.addEventListener('keydown', handleUndoRedo);
        return () => {
            document.removeEventListener('keydown', handleUndoRedo);
        };
    }, [ws, handleUndoRedo]);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!ws) return;
        ws.publish(`watermark:1234:name`, e.target.value)
        // if (watermark) {
        //     setSticker({ ...sticker, name: e.target.value })
        // }
    }

    const handleEvent = (e: CustomEvent) => {
        if (!ws) return;
        const sendData = {
            id: "",
            event_id: "1",
            user_id: "1234",
            orientation: e.detail.orientation,
            config: e.detail.sticker
        }
        console.log("data send to backend : ", sendData)
        ws.rpc("save", sendData)
    };


    useEffect(() => {
        if (watermark) {
            watermark.setCanvasSize(300, 400)
            watermark.listenerOn()
            document.addEventListener("sticker", handleEvent as EventListener)
            return () => {
                watermark.listenerOff()
                document.removeEventListener("sticker", handleEvent as EventListener)
            }
        }
    }, [watermark])

    const handleBack = () => {
        navigate("/")
    }

    const handleSave = () => {
        if (sticker) {
            console.log(sticker)
            // navigate('/')
        }
    }

    const openTooltip = () => {
        setTooltip(!tooltip)
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            try {
                const stickerPath = await UploadWatermark(file);
                if (stickerPath) {
                    watermark?.setSticker(stickerPath)
                }
            } catch (e) {
                console.error(e)
            }
            event.target.value = ""
        }
    };

    const closeTooltip = () => {
        setTooltip(false)
    }

    const handleOrientation = (val: "portrait" | "landscape" | "square") => {
        if (watermark) {
            ws?.publish("watermark:1234:orientation", val)
        }
    }

    const handleSize = (val: "Custom" | "Fit" | "Fill") => {
        setSize(val)
        watermark?.setSize(val)
    }

    const handleAnchor = (val: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right") => {
        setAnchor(val)
        watermark?.setAnchorPoint(val)
    }

    const handleMode = () => {
        setMode(!mode)
    }
    const handleUpload = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }
    const onAction: OnAction = {
        backHandle: handleBack,
        saveHandle: handleSave,
        handleOrientation: handleOrientation,
        modeHandle: handleMode,
        sizeHandle: handleSize,
        setAnchor: handleAnchor,
        openTooltip: openTooltip,
        closeTooltip: closeTooltip,
        uploadHandler: handleUpload,
        handleFileChange: handleFileChange,
        nameCallback: handleTextChange
    }

    return {
        ref,
        sticker,
        textRef,
        size,
        inputRef,
        orientation,
        tooltip,
        anchor,
        mode,
        onAction,
    };
};

export default Model;