import { Background, EventCustom, Sticker } from "types/type";

class Canvas {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected clicked: boolean = false;
    protected image: HTMLImageElement|undefined;
    protected sticker: Sticker;
    protected initialSticker: Sticker;
    protected imageMultiple: HTMLImageElement[];
    protected stickerMultiple: Sticker[];
    protected border: {width: number, color: string}[];
    protected background:Background|null=null;
    protected aspectRatio: number;
    protected x: number;
    protected y: number;
    protected resizeHandleSize: number = 40;
    protected rotateHandleSize: number = 80;
    protected handleColor: string = 'blue';
    protected selectedHandle: string | null = null;
    protected rotateIcon: HTMLImageElement[] = [];
    protected resizeIcon: HTMLImageElement[] = [];
    protected orientation: "landscape"|"portrait"|"square"="portrait"
    protected cursor: Record<string, string> = {
        pointer: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/Hand.cur",
        default: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/Arrow.cur",
        neSize: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/SizeNESW.cur",
        nwSize: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/SizeNWSE.cur",
        rotate: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/Rotate.cur",
        move: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/Cross.cur",
    };
    protected onResizeScreen:EventListener;
    protected constructor(canvasId:string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.image = new Image();
        this.aspectRatio = 0;
        this.x = 0;
        this.y = 0;
        this.resizeHandleSize = 40;
        this.rotateHandleSize = 80;
        this.handleColor = 'blue';
        this.selectedHandle = null;
        this.rotateIcon = [];
        this.resizeIcon = [];
    this.clicked = false;
        this.setCursor('default');
        this.setIcon();
        this.sticker = {
            link:"",
            width:0,
            height:0,
            x:0,
            y:0,
            anchor:"top-left",
            size:"Custom",
            rotation:0,
        };
        this.initialSticker = {
            link:"",
            width:0,
            height:0,
            x:0,
            y:0,
            anchor:"top-left",
            size:"Custom",
            rotation:0,
        }
        this.stickerMultiple = []
        this.imageMultiple = [];
        this.border = [
            {
                width: 4,
                color: "#ff0000"
            },
            {
                width: 4,
                color: "#00ff00"
            },
            {
                width: 4,
                color: "#0000ff"
            },
        ]

        // Set the canvas dimensions based on the parent container size
        this.initializeCanvasSize();
        this.onResizeScreen = this.handleResizeScreen.bind(this);
    }
    protected calculateAnchor(anchor?:"top-left"|"top-center"|"top-right"|"middle-left"|"middle-center"|"middle-right"|"bottom-left"|"bottom-center"|"bottom-right"){
        const data = anchor || this.sticker.anchor
        switch(data){
            case "top-left":
                this.sticker.x = this.x;
                this.sticker.y = this.y;
                break;
            case "top-center":
                this.sticker.x = this.x - this.canvas.width/2;
                this.sticker.y = this.y;
                break;
            case "top-right":
                this.sticker.x = this.canvas.width - this.x;
                this.sticker.y = this.y;
                break;
            case "middle-left":
                this.sticker.x = this.x;
                this.sticker.y = this.y - this.canvas.height/2;
                break;
            case "middle-center":
                this.sticker.x = this.x - this.canvas.width/2;
                this.sticker.y = this.y - this.canvas.height/2;
                break;
            case "middle-right":
                this.sticker.x = this.canvas.width - this.x;
                this.sticker.y = this.y - this.canvas.height/2;
                break;
            case "bottom-left":
                this.sticker.x = this.x;
                this.sticker.y = this.canvas.height - this.y;
                break;
            case "bottom-center":
                this.sticker.x = this.x - this.canvas.width / 2;
                this.sticker.y = this.canvas.height - this.y;
                break;
            case "bottom-right":
                this.sticker.x = this.canvas.width - this.x;
                this.sticker.y = this.canvas.height - this.y;
                break;
            default:
                console.log("Wrong data input")
                break;
        }
    }
    protected calculateRelativeXY(anchor?:"top-left"|"top-center"|"top-right"|"middle-left"|"middle-center"|"middle-right"|"bottom-left"|"bottom-center"|"bottom-right"){
        const data = anchor || this.sticker.anchor
        let x = 0;
        let y = 0;
        switch(data){
            case "top-left":
                x = this.sticker.x;
                y = this.sticker.y;
                break;
            case "top-center":
                x = this.sticker.x + this.canvas.width/2;
                y = this.sticker.y;
                break;
            case "top-right":
                x = this.canvas.width - this.sticker.x;
                y = this.sticker.y
                break;
            case "middle-left":
                x = this.sticker.x
                y = this.sticker.y + this.canvas.height/2;
                break;
            case "middle-center":
                x=this.sticker.x + this.canvas.width/2;
                y=this.sticker.y + this.canvas.height/2;
                break;
            case "middle-right":
                x = this.canvas.width - this.sticker.x;
                y = this.sticker.y + this.canvas.height/2;
                break;
            case "bottom-left":
                x = this.sticker.x
                y = this.canvas.height - this.sticker.y;
                break;
            case "bottom-center":
                x = this.sticker.x + this.canvas.width / 2;
                y = this.canvas.height - this.sticker.y;
                break;
            case "bottom-right":
                x = this.canvas.width - this.sticker.x;
                y = this.canvas.height - this.sticker.y;
                break;
            default:
                console.log("Wrong data input")
                break;
        }
        this.x=x;
        this.y=y;
    }
    public setAnchorPoint(anchor:"top-left"|"top-center"|"top-right"|"middle-left"|"middle-center"|"middle-right"|"bottom-left"|"bottom-center"|"bottom-right"){
        this.sticker.anchor = anchor;
        if(this.sticker && this.sticker.link){
            this.calculateAnchor(anchor)
            this.drawImage()
        }
        this.dispatchEvent()
    }

    deepEqual(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) {
          return true;
        }
      
        if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
          return false;
        }
      
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
      
        if (keys1.length !== keys2.length) {
          return false;
        }
      
        for (const key of keys1) {
          if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
            return false;
          }
        }
      
        return true;
      }
      
      

    protected dispatchEvent(){
        const compare=this.deepEqual(this.initialSticker,this.sticker)
        if(!compare){
            const customEvent = new CustomEvent<EventCustom>('sticker',{
                detail:{
                    sticker:this.sticker,
                    orientation:this.orientation,
                }})
            document.dispatchEvent(customEvent);
            this.initialSticker = {...this.sticker}
        }
    }

    private setIcon() {
        const rotateIcon = [
            "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/top-left-rotate.png",
            "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/top-right-rotate.png",
            "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/bottom-left-rotate.png",
            "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/bottom-right-rotate.png",
        ];
        const resizeIcon = [
            "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/ne-resize.png",
            "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/nw-resize.png",
        ];
        rotateIcon.map((ico,index) => {
            const icon = new Image();
            icon.src = ico;
            icon.onload = () => {
                this.rotateIcon[index]=icon;
            };
        });
        resizeIcon.map((ico,index) => {
            const icon = new Image();
            icon.src = ico;
            icon.onload = () => {
                this.resizeIcon[index]=icon;
            };
        });
    }

    protected setCursor(condition: string) {
        this.canvas.style.cursor = `url(${this.cursor[condition]}), auto`;
    }

    private initializeCanvasSize() {
        if (this.background) {
            // Calculate aspect ratio of the uploaded image
            const aspectRatio = this.background.width / this.background.height;
            // Get the parent element's dimensions
            const parentElement = this.canvas.parentElement;
            if (parentElement) {
              const maxWidth = parentElement.clientWidth;
              const maxHeight = parentElement.clientHeight;
        
              if (maxWidth / aspectRatio < maxHeight) {
                this.canvas.width = maxWidth;
                this.canvas.height = maxWidth / aspectRatio;
              } else {
                this.canvas.width = maxHeight * aspectRatio;
                this.canvas.height = maxHeight;
              }
            }
        }else{
            this.canvas.width = this.canvas.parentElement!.clientWidth;
            this.canvas.height = this.canvas.parentElement!.clientHeight;
        }
    }

    private handleResizeScreen() {
        // When the window is resized, update the canvas size and redraw the image
        this.initializeCanvasSize();
        this.drawImage();
    }

    public setBackgroundImage(path:string){
        const img = new Image();
        img.src = path;
    
        img.onload = () => {
            this.background ={
                img:img,
                width:img.width,
                height:img.height,
            }
            this.handleResizeScreen()
        };
    }

    protected drawImage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.background){
            this.ctx.drawImage(this.background.img, 0, 0, this.canvas.width, this.canvas.height);
        }
        if(this.sticker && this.image){
            this.ctx.save();
            this.ctx.translate(this.x + this.sticker.width / 2, this.y + this.sticker.height / 2);
            this.ctx.rotate(this.sticker.rotation);
            this.ctx.drawImage(this.image, -this.sticker.width / 2, -this.sticker.height / 2, this.sticker.width, this.sticker.height);
            this.ctx.restore();
        }
    }
}
export default Canvas;