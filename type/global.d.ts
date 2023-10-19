namespace Types{
    export interface WatermarkConfig{
        portrait?:AnchorPoint|undefined;
        landscape?:AnchorPoint|undefined;
        square?:AnchorPoint|undefined;
    }
    interface Position {
        position?:"top-left"|"top-center"|"top-right"|"middle-left"|"middle-center"|"middle-right"|"bottom-left"|"bottom-center"|"bottom-right";
    }

    interface Scale{
        scale?:"custom"|"fit"|"fill";
    }
    
    interface AnchorPoint {
        sticker?:Sticker;
        scale?:Scale;
        position?:Position;
        x?:number;
        y?:number;
    }

    interface WatermarkSticker{
        sticker:HTMLImageElement;
        width:number;
        height:number;
        x:number;
        y:number;
        rotation:number;
    }
    interface Sticker {
        sticker:Content;
        width:number;
        height:number;
        x:number;
        y:number;
        rotate:number;
    }
    interface Content {
        key:string;
        path:string;
        width:number;
        height:number;
    }
}