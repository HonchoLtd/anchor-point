export interface Background{
    img:HTMLImageElement;
    width:number;
    height:number;
}
export interface Size{
    size:"Custom"|"Fit"|"Fill";
}
export interface Anchor{
    anchor:"top-left"|"top-center"|"top-right"|"middle-left"|"middle-center"|"middle-right"|"bottom-left"|"bottom-center"|"bottom-right";
}
export interface Sticker{
    link?:string;
    width:number;
    height:number;
    x:number;
    y:number;
    anchor:"top-left"|"top-center"|"top-right"|"middle-left"|"middle-center"|"middle-right"|"bottom-left"|"bottom-center"|"bottom-right";
    size:"Custom"|"Fit"|"Fill";
    rotation:number;
}
export interface Content {
    key:string;
    path:string;
    width:number;
    height:number
}

export interface WatermarkConfig {
    id?:string
    event_id?:string
    name:string
    index:number;
    stikcers:Sticker[]
}

export interface EventCustom {
    sticker:Sticker
    orientation:"portrait"|"landscape"|"square"
}
