import { Sticker } from "types/type";
import TouchGesture from "./lib/TouchGesture";
class Watermark extends TouchGesture {
    constructor(canvasId:string){
        super(canvasId)
    }
    setCanvasSize(width:number,height:number){
        if(width > height){
            this.orientation = "landscape";
        }else if(width < height){
            this.orientation = "portrait";
        }else{
            this.orientation = "square";
        }
        this.canvas.width = width;
        this.canvas.height = height;
    }
    calculateFit(){
        let newWidth= 0;
        let newHeight= 0;
        if((this.sticker.width/this.canvas.width) > (this.sticker.height/this.canvas.height)){
            newWidth = this.canvas.width;
            newHeight = newWidth / this.aspectRatio;
        }else if((this.sticker.width/this.canvas.width) < (this.sticker.height/this.canvas.height)){
            newHeight = this.canvas.height;
            newWidth = newHeight * this.aspectRatio;
        }else{
            newWidth = this.canvas.width;
            newHeight = this.canvas.height;
            }
        this.sticker.width = newWidth;
        this.sticker.height = newHeight;
        this.x=0;
        this.y=0;
    }
    calculateFill(){
        const canvasAspectRatio = this.canvas.width / this.canvas.height;
            const stickerAspectRatio = this.sticker.width / this.sticker.height;
            let newWidth= 0;
        let newHeight= 0;
            if (canvasAspectRatio > stickerAspectRatio) {
                // Canvas is wider
                newWidth = this.canvas.width;
                newHeight = newWidth / stickerAspectRatio;
            } else if (canvasAspectRatio < stickerAspectRatio) {
                // Canvas is taller
                newHeight = this.canvas.height;
                newWidth = newHeight * stickerAspectRatio;
            } else {
                // Canvas and sticker have the same aspect ratio (both square)
                newWidth = this.canvas.width;
                newHeight = this.canvas.height;
            }
            this.sticker.width = newWidth;
            this.sticker.height = newHeight;
            this.x = (this.canvas.width/2) - (this.sticker.width/2);
            this.y = (this.canvas.height/2) - (this.sticker.height/2);
    }
    setSize(size:"Custom"|"Fit"|"Fill"){
        this.sticker.size = size
        if(this.sticker && this.sticker.link){
            if(size==="Fit"){
                this.calculateFit()
                super.calculateAnchor()
            }else if(size==="Fill"){
                this.calculateFill()
                super.calculateAnchor()
            }
            super.drawImage()
        }
        super.dispatchEvent()
    }
    private setStickerImage(sticker: HTMLImageElement, width: number, height: number) {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        // Calculate the scaled dimensions while maintaining the aspect ratio
        const aspectRatio = sticker.width / sticker.height;
        this.aspectRatio = aspectRatio;

        // Scale the sticker to fit within the canvas width and height
        if (width > canvasWidth) {
            width = canvasWidth;
            height = width / aspectRatio;
        }

        if (height > canvasHeight) {
            height = canvasHeight;
            width = height * aspectRatio;
        }

        // Ensure the sticker dimensions are at least 30x30 pixels
        width = Math.max(width, 100);
        height = Math.max(height, 100);
        if(this.sticker.size === "Custom"){
            this.sticker.width = width;
            this.sticker.height = height;
            this.x = 0;
            this.y = 0;
        }else if(this.sticker.size === "Fit"){
            this.calculateFit()
        }else if(this.sticker.size === "Fill"){
            this.calculateFill()
        }
        super.dispatchEvent()
        this.drawImage();
    }
    public setSticker(path: string) {
        // Load the image
        const img = new Image();
        img.src = path;
        
        img.onload = () => {
            this.image=img,
            this.image.width=img.width,
            this.image.height=img.height,
            this.sticker.link = path;
            this.sticker.width = img.width
            this.sticker.height = img.height
            this.setStickerImage(img, img.width, img.height);
        };
    }
    resizeOff(){
        window.removeEventListener('resize', this.onResizeScreen);
    }
    resizeOn(){
        window.addEventListener('resize', this.onResizeScreen);
    }
    listenerOff(){
        this.canvas.removeEventListener('mouseenter', this.boundOnMouseEnter);
        this.canvas.removeEventListener('mousedown', this.boundOnMouseDown);
        this.canvas.removeEventListener('mousemove', this.boundOnMouseMove);
        this.canvas.removeEventListener('mouseup', this.boundOnMouseUp);
        this.canvas.removeEventListener("touchstart", this.boundOnTouchDown);
        this.canvas.removeEventListener("touchmove", this.boundOnTouchMove);
        this.canvas.removeEventListener("touchend", this.boundOnTouchUp);
    }
    listenerOn(){
        this.canvas.addEventListener('mouseenter', this.boundOnMouseEnter);
        this.canvas.addEventListener('mousedown', this.boundOnMouseDown);
        this.canvas.addEventListener('mousemove', this.boundOnMouseMove);
        this.canvas.addEventListener('mouseup', this.boundOnMouseUp);
        this.canvas.addEventListener("touchstart", this.boundOnTouchDown);
        this.canvas.addEventListener("touchmove", this.boundOnTouchMove);
        this.canvas.addEventListener("touchend", this.boundOnTouchUp);
    }
    setStickerConfig(data:Sticker){
        this.sticker.anchor = data.anchor
        this.sticker.height = data.height
        this.sticker.width = data.height
        this.sticker.rotation = data.rotation
        this.sticker.size = data.size
        this.sticker.x = data.x
        this.sticker.y = data.y
        if (data.link && data.link !== this.sticker.link) {
            this.sticker.link = data.link;
            const img = new Image();
            img.src = data.link;
            img.onload = () => {
                this.image = img;
                this.image.width = img.width;
                this.image.height = img.height;
                const aspectRatio = img.width / img.height;
                this.aspectRatio = aspectRatio;
                super.drawImage();
            };
        }
        this.initialSticker = {...this.sticker}
        
        super.calculateRelativeXY(data.anchor);
        super.drawImage();
        
    }
    save(){
        this.selectedImage = false
        super.drawImage()
        const dataURL = this.canvas.toDataURL();
        return dataURL
    }
    getStickerData(){
        return this.sticker
    }
    getOrientation(){
        return this.orientation
    }

    public addSticker(path: string) {
        const img = new Image();
        img.src = path;

        img.onload = () => {
            const newSticker: Sticker = {
                link: path,
                width: img.width,
                height: img.height,
                x: this.imageMultiple.length * 60 || 20,
                y: this.imageMultiple.length * 50 || 20,
                anchor: "top-left",
                size: "Custom",
                rotation: 0,
            };
            this.imageMultiple.push(img)

            newSticker.width = img.width;
            newSticker.height = img.height;
            this.stickerMultiple.push(newSticker);
            this.drawStickers();
        };
    }

    private drawStickers() {
        this.clearCanvas(); // Clear the canvas before re-drawing
        this.stickerMultiple.forEach((sticker, index) => {
            this.setStickerImagemultiple(sticker);
        });
    }

    private setStickerImagemultiple(sticker: Sticker) {
        const img = new Image();
        img.src = sticker.link || "";
        img.onload = () => {
            this.ctx.save();
            this.ctx.translate(sticker.x + sticker.width / 2, sticker.y + sticker.height / 2);
            this.ctx.rotate(sticker.rotation);
            this.ctx.drawImage(img, -sticker.width / 2, -sticker.height / 2, sticker.width, sticker.height);
            this.ctx.restore();
        };
    }

    private clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
export default Watermark;