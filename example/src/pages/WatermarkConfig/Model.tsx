import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState, ChangeEvent, useCallback } from "react"
import { modeAtom, watermarkData } from "@src/stores";
import { useAtom } from "jotai";
import Watermark from "@dist/index"
// import { EventCustom } from "@src/types";
import { UploadWatermark } from "@src/service/watermark";
import { Centrifuge, Subscription } from "centrifuge";
import { WatermarkConfig } from "@src/types";

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
    nameCallback: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Model = () => {
    const navigate = useNavigate()
    const ref = useRef<HTMLCanvasElement>(null)
    const inputRef = useRef<HTMLInputElement>(null);
    const [mode, setMode] = useAtom(modeAtom)
    const [watermark, setWatermark] = useState<Watermark | undefined>(undefined)
    const [tooltip, setTooltip] = useState<boolean>(false)
    const [sticker, setSticker] = useAtom(watermarkData)
    const [orientation, setOrientation] = useState<"portrait" | "landscape" | "square">("portrait")
    const [size, setSize] = useState<"Custom" | "Fit" | "Fill">("Custom")
    const [anchor, setAnchor] = useState<"top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right">("top-left")
    const [ws, setWs] = useState<Centrifuge | undefined>(undefined)
    const [channel, setChannel] = useState<Subscription | undefined>(undefined)

    useEffect(() => {
        if (ref.current) {
            const w = new Watermark("myCanvas")
            setWatermark(w)
            return () => {
                setWatermark(undefined)
            }
        }
    }, [ref])

    useEffect(() => {
        const BASE_URL = import.meta.env.VITE_PUBLIC_WS_URL || "ws://127.0.0.1:9090"
        // const BASE_URL = "ws://127.0.0.1:9090"
        const centrifuge = new Centrifuge(
            `${BASE_URL}/connection/editor/socket?firebase_uid=1234&event_id=1&id=`
        )
        const chan = centrifuge.newSubscription("watermark:1234")
        setWs(centrifuge)
        setChannel(chan)
        return () => {
            setWs(undefined)
            setChannel(undefined)
        }
    }, [])

    useEffect(() => {
        if (!ws || !watermark || !channel) return;
        channel.on("subscribed", async () => {
            await ws.rpc("watermark:get", {
                id: sticker?.id
            })
                .then(ctx => {
                    const tempOrientation: "portrait" | "landscape" | "square" = ctx.data.orientation
                    const temp: WatermarkConfig = { ...ctx.data }
                    setSticker(temp)
                    setOrientation(tempOrientation)
                    switch (tempOrientation) {
                        case "portrait":
                            watermark.setCanvasSize(300, 400)
                            break;
                        case "landscape":
                            watermark.setCanvasSize(600, 400)
                            break;
                        default:
                            watermark.setCanvasSize(400, 400)
                            break;
                    }
                    setAnchor(temp[tempOrientation].stickers[temp[tempOrientation].index].anchor)
                    setSize(temp[tempOrientation].stickers[temp[tempOrientation].index].size)
                    watermark.setStickerConfig(temp[tempOrientation].stickers[temp[tempOrientation].index])
                })
                .catch(e => {
                    console.log("error : ", e)
                })
        })
        channel.on("publication", async (ctx) => {
            const tempOrientation: "portrait" | "landscape" | "square" = ctx.data.orientation
            const temp: WatermarkConfig = ctx.data
            setSticker(temp)
            setOrientation(tempOrientation)
            switch (tempOrientation) {
                case "portrait":
                    watermark.setCanvasSize(300, 400)
                    break;
                case "landscape":
                    watermark.setCanvasSize(600, 400)
                    break;
                default:
                    watermark.setCanvasSize(400, 400)
                    break;
            }
            setAnchor(temp[tempOrientation].stickers[temp[tempOrientation].index].anchor)
            setSize(temp[tempOrientation].stickers[temp[tempOrientation].index].size)
            watermark.setStickerConfig(temp[tempOrientation].stickers[temp[tempOrientation].index])
        })
        ws.connect()
        channel.subscribe()
        return () => {
            ws.disconnect()
            channel.unsubscribe()
        }

    }, [ws, watermark, channel])

    const handleUndoRedo = useCallback((event: KeyboardEvent) => {
        // event.preventDefault();
        if (!ws) return;
        if (event.ctrlKey && event.key === 'z') {
            if (sticker && sticker[orientation]?.index > 0) {
                ws.rpc("watermark:undo", {})
            }
        } else if (event.ctrlKey && event.key === 'y') {
            if (sticker && sticker[orientation]?.index < sticker[orientation].stickers.length - 1) {
                ws.rpc("watermark:redo", {})
            }
        }
    }, [ws, orientation, sticker])

    useEffect(() => {
        document.addEventListener('keydown', handleUndoRedo);
        return () => {
            document.removeEventListener('keydown', handleUndoRedo);
        };
    }, [ws, sticker, orientation]);

    const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!ws || !sticker) return;
        // setSticker({ ...sticker, name: e.target.value })
        ws.rpc("watermark:name", {
            name: e.target.value
        })
    }, [ws, watermark, sticker])

    const handleEvent = (e: CustomEvent) => {
        if (!watermark || !ws || !sticker) return;
        const sendData = {
            id: sticker.id,
            event_id: "1",
            user_id: "1234",
            name: sticker.name,
            orientation: e.detail.orientation,
            config: e.detail.sticker
        }
        ws.rpc("watermark:save", sendData)
    };

    useEffect(() => {
        if (watermark) {
            watermark.listenerOn()
            document.addEventListener("sticker", handleEvent as EventListener)
            return () => {
                watermark.listenerOff()
                document.removeEventListener("sticker", handleEvent as EventListener)
            }
        }
    }, [watermark, sticker])



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
            ws?.rpc("watermark:orientation", {
                orientation: val
            })
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