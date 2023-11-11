import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
// import "@dist/index.js"
import Watermark from "@dist/index"
import { useAtomValue } from "jotai";
import { watermarkConfig } from "@src/stores";

interface OnAction {
    createWatermark: () => void
    undoHandler: () => void
    redoHandler: () => void
    backHandler: () => void
    saveHandler: () => void
}

const Model = () => {
    const navigate = useNavigate()
    const ref = useRef(null)
    const [watermark, setWatermark] = useState<Watermark | undefined>(undefined)
    const watermarkData = useAtomValue(watermarkConfig)

    useEffect(() => {
        if (ref.current) {
            const w = new Watermark("myCanvas")
            setWatermark(w)
        }
    }, [ref.current])

    useEffect(() => {
        if (watermark) {
            watermark.setBackgroundImage("https://s3.ap-southeast-1.amazonaws.com/dev.pronto.ubersnap/event/64644ae2c8174665b75423b4/media/2d6b929c-e34c-4749-8f32-177fa02b582d/download.jpeg")
            watermark.resizeOn()
            // watermark.setSticker(logo)
            // watermark.listenerOn()
            return () => {
                watermark.resizeOff()
            }
        }
    }, [watermark])

    const handleCreateWatermark = () => {
        navigate("/config")
    }

    const handleBack = () => {
        navigate("/")
    }

    const handleUndo = () => {

    }

    const handleRedo = () => {

    }

    const handleSave = () => {

    }
    const onAction: OnAction = {
        createWatermark: handleCreateWatermark,
        backHandler: handleBack,
        undoHandler: handleUndo,
        redoHandler: handleRedo,
        saveHandler: handleSave,
    }

    return {
        ref,
        watermark,
        watermarkData,
        onAction,
    };
};

export default Model;