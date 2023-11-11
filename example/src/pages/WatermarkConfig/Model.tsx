import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState, ChangeEvent } from "react"
import { modeAtom, stickerConfig, watermarkConfig } from "@src/stores";
import { useAtom, useSetAtom } from "jotai";
import Watermark from "@dist/index"
interface OnAction {
    backHandle: () => void
    saveHandle: () => void,
    handleOrientation: (e: "portrait" | "landscape" | "square") => void,
    modeHandle: () => void,
    sizeHandle: (e: "Custom" | 'Fit' | "Fill") => void,
    setAnchor: (e: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right") => void,
    openTooltip: () => void
    closeTooltip: () => void
    uploadHandler: () => void
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void,
    nameCallback: (e: ChangeEvent<HTMLInputElement>) => void
}
const Model = () => {
    const navigate = useNavigate()
    const ref = useRef<HTMLCanvasElement>(null)
    const inputRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLDivElement>(null)
    const [mode, setMode] = useAtom(modeAtom)
    const [sticker, setSticker] = useAtom(stickerConfig)
    const setArraySticker = useSetAtom(watermarkConfig)
    const [watermark, setWatermark] = useState<Watermark | undefined>(undefined)
    const [tooltip, setTooltip] = useState<boolean>(false)
    const [image, setImage] = useState<HTMLImageElement | null>(null)
    const [orientation, setOrientation] = useState<"portrait" | "landscape" | "square">("portrait")
    const [size, setSize] = useState<"Custom" | "Fit" | "Fill">("Custom")
    const [anchor, setAnchor] = useState<"top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right">("top-left")

    useEffect(() => {
        if (ref.current) {
            const w = new Watermark("myCanvas")
            setWatermark(w)
        }
    }, [ref])

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (watermark) {
            watermark.setName(e.target.value)
        }
    }

    const handleEvent = (e: CustomEvent) => {
        console.log(e.detail.sticker)
        setSticker(e.detail.sticker)
    }
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
        const data = watermark?.getStickerData()
        if (data) {
            setArraySticker(prev => [...prev, data])
            navigate('/')
        }
    }

    const openTooltip = () => {
        setTooltip(!tooltip)
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    const img = new Image();
                    img.src = e.target.result as string;
                    img.onload = () => {
                        setImage(img);
                        watermark?.setSticker(img.src)
                    };
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const closeTooltip = () => {
        setTooltip(false)
    }

    const handleOrientation = (val: "portrait" | "landscape" | "square") => {
        switch (val) {
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
        setOrientation(val)
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
        setSticker,
        inputRef,
        image,
        orientation,
        tooltip,
        anchor,
        mode,
        onAction,
    };
};

export default Model;