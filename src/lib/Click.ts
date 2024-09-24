import Canvas from "./Canvas";

class Click extends Canvas {
    protected selectedImage: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private isDragging: boolean = false;
    private isResizing: boolean = false;
    private isRotating: boolean = false;
    private isResizingTopLeft: boolean = false;
    private isResizingTopRight: boolean = false;
    private isResizingBottomLeft: boolean = false;
    private isResizingBottomRight: boolean = false;
    private resizeStartX: number = 0;
    private resizeStartY: number = 0;
    private rotateStartX: number = 0;
    private rotateStartY: number = 0;
    private initialWidth: number = 0;
    private initialHeight: number = 0;
    private initialDistance: number = 0;
    private currentDistance: number = 0;
    private endPoint: null | HTMLElement = null;
    protected boundOnMouseEnter: EventListener;
    protected boundOnMouseDown: EventListener;
    protected boundOnMouseMove: EventListener;
    protected boundOnMouseUp: EventListener;

    constructor(canvasId: string) {
        super(canvasId);
        this.selectedImage = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.isDragging = false;
        this.isResizing = false;
        this.isRotating = false;
        this.isResizingTopLeft = false;
        this.isResizingTopRight = false;
        this.isResizingBottomLeft = false;
        this.isResizingBottomRight = false;
        this.resizeStartX = 0;
        this.resizeStartY = 0;
        this.rotateStartX = 0;
        this.rotateStartY = 0;
        this.initialWidth = 0;
        this.initialHeight = 0;
        this.boundOnMouseEnter = this.onMouseEnter.bind(this) as EventListener;
        this.boundOnMouseDown = this.onMouseDown.bind(this) as EventListener;
        this.boundOnMouseMove = this.onMouseMove.bind(this) as EventListener;
        this.boundOnMouseUp = this.onMouseUp.bind(this) as EventListener;
    }

    onMouseEnter(e: MouseEvent) {
        this.onMouseMove(e);
    }

    onMouseDown(e: MouseEvent|TouchEvent) {
        if(!this.sticker)return;
        this.clicked = true;
        let clientX=0, clientY=0;
        if (e instanceof MouseEvent) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                return; // No touches to handle
            }
        }
        const { left, top } = this.canvas.getBoundingClientRect();
        const mouseX = clientX - left;
        const mouseY = clientY - top;
        this.handleAction(mouseX, mouseY);
        this.handleCursor(mouseX, mouseY);
        const { rotatedX, rotatedY } = this.getRotatedXY(mouseX, mouseY);

        const activeSticker = this.stickerMultiple.find(image =>
            mouseX >= image.x &&
            mouseX <= image.x + image.width &&
            mouseY >= image.y &&
            mouseY <= image.y + image.height
        ) || null;

        if(activeSticker) {
            const img = new Image();
            img.src = activeSticker.link || "";
            this.image=img,
            
            this.x = activeSticker.x
            this.y = activeSticker.y
            
            this.sticker = activeSticker
        }

        if (this.isResizing) {
            this.resizeStartX = rotatedX;
            this.resizeStartY = rotatedY;
            this.initialWidth = this.sticker.width;
            this.initialHeight = this.sticker.height;
        } else if (this.isDragging) {
            this.dragStartX = mouseX - this.sticker.x;
            this.dragStartY = mouseY - this.sticker.y;
        } else if (this.isRotating) {
            this.rotateStartX = rotatedX;
            this.rotateStartY = rotatedY;
        }
        this.handleAction(mouseX, mouseY);
        this.clickDrawImage();
    }

    onMouseMove(e: MouseEvent|TouchEvent) {
        let clientX=0, clientY=0;
        if (e instanceof MouseEvent) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                return; // No touches to handle
            }
        }
        const { left, top } = this.canvas.getBoundingClientRect();
        const mouseX = clientX - left;
        const mouseY = clientY - top;
        if (this.selectedImage && this.clicked) {
            this.handleCursor(mouseX, mouseY);
            if (this.isDragging) {
                this.handleDraging(mouseX, mouseY);
            } else if (this.isResizing) {
                this.handleResize(mouseX, mouseY);
            } else if (this.isRotating) {
                this.handleRotation(mouseX, mouseY);
            }
        }
        this.clickDrawImage();
    }

    onMouseUp() {
        this.reset();
        this.selectedHandle = null;
        super.calculateAnchor()
        super.dispatchEvent()
    }

    handleDraging(mouseX: number, mouseY: number) {
        if(!this.sticker)return;
        let newStickerX = mouseX - this.dragStartX;
        let newStickerY = mouseY - this.dragStartY;
        // newStickerX = Math.max(0, newStickerX);
        // newStickerY = Math.max(0, newStickerY);
        // newStickerX = Math.min(this.canvas.width - this.sticker.width, newStickerX);
        // newStickerY = Math.min(this.canvas.height - this.sticker.height, newStickerY);
        this.x = newStickerX;
        this.y = newStickerY;
    }

    getRotatedXY(x: number, y: number) {
        if(this.sticker){
            const cosAngle = Math.cos(-this.sticker.rotation);
            const sinAngle = Math.sin(-this.sticker.rotation);
            const centerX = this.x + this.sticker.width / 2;
            const centerY = this.y + this.sticker.height / 2;
            const rotatedX = (x - centerX) * cosAngle - (y - centerY) * sinAngle + centerX;
            const rotatedY = (x - centerX) * sinAngle + (y - centerY) * cosAngle + centerY;
            return { rotatedX: rotatedX, rotatedY: rotatedY, centerX: centerX, centerY: centerY, cosAngle: cosAngle, sinAngle: sinAngle };
        }
        return { rotatedX: 0, rotatedY: 0, centerX: 0, centerY: 0, cosAngle: 0, sinAngle: 0 };
    }

    handleAction(mouseX: number, mouseY: number) {
        const isInsideImage = this.isPointerInsideImage(mouseX, mouseY);
        const indexRotate = this.getRotatePosition(mouseX, mouseY);
        const index = this.getResizePosition(mouseX, mouseY);
        if (isInsideImage) {
            this.selectedImage = true;
            this.clicked = true;
            if (index !== null) {
                this.isResizing = true;
                switch (index) {
                    case 0:
                        this.isResizingTopLeft = true;
                        break;
                    case 1:
                        this.isResizingTopRight = true;
                        break;
                    case 2:
                        this.isResizingBottomLeft = true;
                        break;
                    case 3:
                        this.isResizingBottomRight = true;
                        break;
                    default:
                        this.reset();
                        break;
                }
            } else {
                this.isDragging = true;
            }
        } else if (!isInsideImage && indexRotate !== null) {
            this.isRotating = true;
        } else {
            this.selectedImage = false;
            this.clicked = false;
        }
    }

    handleCursor(mouseX: number, mouseY: number) {
        const isInsideImage = this.isPointerInsideImage(mouseX, mouseY);
        const indexRotate = this.getRotatePosition(mouseX, mouseY);
        const index = this.getResizePosition(mouseX, mouseY);
        const cursor = ["nwSize", "neSize", "neSize", "nwSize"];
        if (isInsideImage) {
            if (index !== null) {
                super.setCursor(cursor[index]);
            } else {
                super.setCursor('move');
            }
        } else if (!isInsideImage && indexRotate !== null) {
            super.setCursor('rotate');
        } else {
            this.canvas.style.cursor = `url(${this.cursor.default}), auto`;
        }
    }

    isPointerInsideImage(mouseX: number, mouseY: number) {
        const { rotatedX, rotatedY } = this.getRotatedXY(mouseX, mouseY);
        // return (
        //     this.sticker &&
        //     rotatedX >= this.x &&
        //     rotatedX <= this.x + this.sticker.width &&
        //     rotatedY >= this.y &&
        //     rotatedY <= this.y + this.sticker.height
        // );
        const checkInsideImage = !!this.stickerMultiple.find(image =>
            rotatedX >= image.x &&
            rotatedX <= image.x + image.width &&
            rotatedY >= image.y &&
            rotatedY <= image.y + image.height
        );
        return checkInsideImage
    }

    reset() {
        this.isDragging = false;
        this.isResizing = false;
        this.isRotating = false;
        this.isResizingTopLeft = false;
        this.isResizingTopRight = false;
        this.isResizingBottomLeft = false;
        this.isResizingBottomRight = false;
    }

    getRotatePosition(x: number, y: number) {
        if (!this.sticker)return null;
        const halfHandleSize = this.rotateHandleSize / 2;
        const { rotatedX, rotatedY, centerX, centerY } = this.getRotatedXY(x, y);
        const rotatedHandles = [
            { x: centerX - this.sticker.width / 2, y: centerY - this.sticker.height / 2 },
            { x: centerX + this.sticker.width / 2, y: centerY - this.sticker.height / 2 },
            { x: centerX - this.sticker.width / 2, y: centerY + this.sticker.height / 2 },
            { x: centerX + this.sticker.width / 2, y: centerY + this.sticker.height / 2 }
        ];
        for (let i = 0; i < rotatedHandles.length; i++) {
            const handle = rotatedHandles[i];
            if (
                rotatedX >= handle.x - halfHandleSize &&
                rotatedX <= handle.x + halfHandleSize &&
                rotatedY >= handle.y - halfHandleSize &&
                rotatedY <= handle.y + halfHandleSize &&
                !this.isPointerInsideImage(x, y)
            ) {
                return i;
            }
        }
        return null;
    }

    getResizePosition(x: number, y: number) {
        if(!this.sticker)return null;
        const halfHandleSize = this.resizeHandleSize;
        const { rotatedX, rotatedY, centerX, centerY } = this.getRotatedXY(x, y);
        const rotatedHandles = [
            { x: centerX - this.sticker.width / 2, y: centerY - this.sticker.height / 2 },
            { x: centerX + this.sticker.width / 2, y: centerY - this.sticker.height / 2 },
            { x: centerX - this.sticker.width / 2, y: centerY + this.sticker.height / 2 },
            { x: centerX + this.sticker.width / 2, y: centerY + this.sticker.height / 2 }
        ];
        for (let i = 0; i < rotatedHandles.length; i++) {
            const handle = rotatedHandles[i];
            if (
                rotatedX >= handle.x - halfHandleSize &&
                rotatedX <= handle.x + halfHandleSize &&
                rotatedY >= handle.y - halfHandleSize &&
                rotatedY <= handle.y + halfHandleSize
            ) {
                return i;
            }
        }
        return null;
    }

    handleRotation(mouseX: number, mouseY: number) {
        if(this.sticker){
            const centerX = this.x + this.sticker.width / 2;
            const centerY = this.y + this.sticker.height / 2;
            const rotation = Math.atan2(mouseY - centerY, mouseX - centerX);
            this.sticker.rotation = rotation;
        }
    }

    handleResize(mouseX: number, mouseY: number) {
        if (!this.sticker)return;
        const delta = this.getRotatedXY(mouseX, mouseY);
        const deltaX = delta.rotatedX - this.resizeStartX;
        const deltaY = delta.rotatedY - this.resizeStartY;
        let newWidth = 0;
        let newHeight = 0;
        if (this.isResizingTopLeft) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                newWidth = this.initialWidth - deltaX;
                newHeight = newWidth / this.aspectRatio;
            } else {
                newHeight = this.initialHeight - deltaY;
                newWidth = newHeight * this.aspectRatio;
            }
            this.x = this.resizeStartX - (newWidth - this.initialWidth);
            this.y = this.resizeStartY - (newHeight - this.initialHeight);
        } else if (this.isResizingTopRight) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                newWidth = this.initialWidth + deltaX;
                newHeight = newWidth / this.aspectRatio;
            } else {
                newHeight = this.initialHeight - deltaY;
                newWidth = newHeight * this.aspectRatio;
            }
            this.y = this.resizeStartY - (newHeight - this.initialHeight);
        } else if (this.isResizingBottomLeft) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                newWidth = this.initialWidth - deltaX;
                newHeight = newWidth / this.aspectRatio;
            } else {
                newHeight = this.initialHeight + deltaY;
                newWidth = newHeight * this.aspectRatio;
            }
            this.x = this.resizeStartX - (newWidth - this.initialWidth);
        } else if (this.isResizingBottomRight) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                newWidth = this.initialWidth + deltaX;
                newHeight = newWidth / this.aspectRatio;
            } else {
                newHeight = this.initialHeight + deltaY;
                newWidth = newHeight * this.aspectRatio;
            }
        }
        const minSize = 50;
        let newWidthConstrained = Math.max(minSize, newWidth);
        let newHeightConstrained = Math.max(minSize, newHeight);
        let maxWidth = this.canvas.width - this.x;
        let maxHeight = this.canvas.height - this.y;
        let newWidthFinal = Math.min(newWidthConstrained, maxWidth);
        let newHeightFinal = Math.min(newHeightConstrained, maxHeight);
        if (newWidthFinal > newHeightFinal * this.aspectRatio) {
            newWidthFinal = newHeightFinal * this.aspectRatio;
        } else if (newHeightFinal > newWidthFinal / this.aspectRatio) {
            newHeightFinal = newWidthFinal / this.aspectRatio;
        }
        this.sticker.width = newWidthFinal;
        this.sticker.height = newHeightFinal;
    }

    private clickDrawImage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.background){
            this.ctx.drawImage(this.background.img, 0, 0, this.canvas.width, this.canvas.height);
        }
        if(this.sticker && this.image){
            // this.ctx.save();
            // this.ctx.translate(this.x + this.sticker.width / 2, this.y + this.sticker.height / 2);
            // this.ctx.rotate(this.sticker.rotation);
            // this.ctx.drawImage(this.image, -this.sticker.width / 2, -this.sticker.height / 2, this.sticker.width, this.sticker.height);
            if (this.selectedImage) {
                const border = this.border
                this.stickerMultiple.forEach((sticker, index) => {
                    const imgMulti = this.imageMultiple[index];

                    // border
                    /* this.ctx.save();
                    this.ctx.strokeStyle = border[index].color;
                    this.ctx.lineWidth  = border[index].width;
                    this.ctx.strokeRect(
                        sticker.x - border[index].width / 2,
                        sticker.y - border[index].width / 2,
                        sticker.width + border[index].width,   
                        sticker.height + border[index].width    
                    );
                    this.ctx.restore(); */

                    if(sticker.link !== this.sticker.link) {
                        this.ctx.save();
                        this.ctx.translate(sticker.x + sticker.width / 2, sticker.y + sticker.height / 2);
                        this.ctx.rotate(sticker.rotation);
                        this.ctx.drawImage(imgMulti, -sticker.width / 2, -sticker.height / 2, sticker.width, sticker.height);
                        this.ctx.restore();
                    } else {
                        if(this.image) {
                            this.ctx.save();
                            this.ctx.translate(this.x + this.sticker.width / 2, this.y + this.sticker.height / 2);
                            this.ctx.rotate(this.sticker.rotation);
                            this.ctx.drawImage(this.image, -this.sticker.width / 2, -this.sticker.height / 2, this.sticker.width, this.sticker.height);
                            
                            // draw indicator selected
                            this.drawHandles();
                            this.ctx.restore();
                        }
                    }
                });
            } else {   
                this.imageMultiple.forEach((image, index) => {
                    const sticker = this.stickerMultiple[index]
                    this.ctx.save();
                    this.ctx.translate(sticker.x + sticker.width / 2, sticker.y + sticker.height / 2);
                    this.ctx.rotate(sticker.rotation);
                    this.ctx.drawImage(image, -sticker.width / 2, -sticker.height / 2, sticker.width, sticker.height);
                    this.ctx.restore();
                })
            }
        }
    }

    private drawHandles() {
        if(!this.sticker)return;
        // this.ctx.fillStyle = "red";
        const handleRotate = [
            {x:-this.sticker.width / 2 - this.rotateHandleSize + this.rotateHandleSize / 2,y:-this.sticker.height / 2 - this.rotateHandleSize + this.rotateHandleSize / 2},
            {x:this.sticker.width / 2 - this.rotateHandleSize / 2,y:-this.sticker.height / 2 - this.rotateHandleSize / 2},
            {x:-this.sticker.width / 2 - this.rotateHandleSize / 2,y:this.sticker.height / 2 - this.rotateHandleSize + this.rotateHandleSize / 2},
            {x:this.sticker.width / 2 - this.rotateHandleSize / 2,y:this.sticker.height / 2 - this.rotateHandleSize / 2}
        ]

        handleRotate.map((data,i)=>{
                this.ctx.drawImage(this.rotateIcon[i],data.x, data.y, this.rotateHandleSize, this.rotateHandleSize);
            })
            
            
            this.ctx.fillStyle = this.handleColor;
            const handleResizeIcon=[
                {x:-this.sticker.width / 2,y:-this.sticker.height / 2},
                {x:this.sticker.width / 2 - this.resizeHandleSize,y:-this.sticker.height / 2},
                {x:-this.sticker.width / 2,y:this.sticker.height / 2 - this.resizeHandleSize},
                {x:this.sticker.width / 2 - this.resizeHandleSize,y:this.sticker.height / 2 - this.resizeHandleSize}
            ]
            handleResizeIcon.map((data,i)=>{
            this.ctx.drawImage(i%3==0 ? this.resizeIcon[0] : this.resizeIcon[1],data.x, data.y, this.resizeHandleSize, this.resizeHandleSize);
            // this.ctx.fillRect(data.x, data.y, this.resizeHandleSize, this.resizeHandleSize);
        })
        
    }
}

export default Click;