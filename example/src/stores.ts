import { atom } from "jotai";
import { Sticker } from "@src/types"
export const watermarkConfig = atom<Sticker[]|[]>([])
export const stickerConfig = atom<Sticker|null>(null)
export const modeAtom = atom<boolean>(false)