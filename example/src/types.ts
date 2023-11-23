export interface Sticker{
    name?:string;
    link:string;
    width:number;
    height:number;
    x:number;
    y:number;
    anchor:"top-left"|"top-center"|"top-right"|"middle-left"|"middle-center"|"middle-right"|"bottom-left"|"bottom-center"|"bottom-right";
    size:"Custom"|"Fit"|"Fill";
    rotation:number;
}

export interface WatermarkData {
    index:number;
    stickers:Sticker[]
}

export interface WatermarkConfig {
    id?:string;
    event_id?:string;
    name:string;
    portrait:WatermarkData;
    landscape:WatermarkData;
    square:WatermarkData;
}

export interface EventCustom {
        sticker:Sticker
        orientation:"portrait"|"landscape"|"square"
}