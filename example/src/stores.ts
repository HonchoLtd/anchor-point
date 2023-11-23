import { atom } from "jotai";
import { Sticker, WatermarkConfig } from "@src/types"

export const watermarkConfigDefault:WatermarkConfig={
    id:"",
    event_id:"",
    name:"Untitled",
    portrait:{
        index:-1,
        stickers:[],
    },
    landscape:{
        index:-1,
        stickers:[],
    },
    square:{
        index:-1,
        stickers:[],
    }
}

export const watermarkConfig = atom<Sticker[]>([])
export const stickerConfig = atom<Sticker|null>(null)
export const modeAtom = atom<boolean>(false)
export const watermarkData = atom<WatermarkConfig|null>(null)