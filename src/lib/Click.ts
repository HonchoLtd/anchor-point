import Canvas from "@lib/Canvas";
class Click extends Canvas {
    protected selectedImage: boolean = false;
    protected clicked: boolean = false;
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
    private boundOnMouseEnter: EventListener;

    constructor() {
        super();
        this.selectedImage = false;
        this.clicked = false;
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
        this.canvas.addEventListener('mouseenter', this.boundOnMouseEnter);
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onMouseEnter(e: MouseEvent) {
        this.onMouseMove(e);
    }

    onMouseDown(e: MouseEvent|TouchEvent) {
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
        if (this.isResizing) {
            this.resizeStartX = rotatedX;
            this.resizeStartY = rotatedY;
            this.initialWidth = this.width;
            this.initialHeight = this.height;
        } else if (this.isDragging) {
            this.dragStartX = mouseX - this.x;
            this.dragStartY = mouseY - this.y;
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
    }

    handleDraging(mouseX: number, mouseY: number) {
        let newStickerX = mouseX - this.dragStartX;
        let newStickerY = mouseY - this.dragStartY;
        newStickerX = Math.max(0, newStickerX);
        newStickerY = Math.max(0, newStickerY);
        newStickerX = Math.min(this.canvas.width - this.width, newStickerX);
        newStickerY = Math.min(this.canvas.height - this.height, newStickerY);
        this.x = newStickerX;
        this.y = newStickerY;
    }

    getRotatedXY(x: number, y: number) {
        const cosAngle = Math.cos(-this.angle);
        const sinAngle = Math.sin(-this.angle);
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const rotatedX = (x - centerX) * cosAngle - (y - centerY) * sinAngle + centerX;
        const rotatedY = (x - centerX) * sinAngle + (y - centerY) * cosAngle + centerY;
        return { rotatedX: rotatedX, rotatedY: rotatedY, centerX: centerX, centerY: centerY, cosAngle: cosAngle, sinAngle: sinAngle };
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
        return (
            rotatedX >= this.x &&
            rotatedX <= this.x + this.width &&
            rotatedY >= this.y &&
            rotatedY <= this.y + this.height
        );
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
        const halfHandleSize = this.rotateHandleSize / 2;
        const { rotatedX, rotatedY, centerX, centerY } = this.getRotatedXY(x, y);
        const rotatedHandles = [
            { x: centerX - this.width / 2, y: centerY - this.height / 2 },
            { x: centerX + this.width / 2, y: centerY - this.height / 2 },
            { x: centerX - this.width / 2, y: centerY + this.height / 2 },
            { x: centerX + this.width / 2, y: centerY + this.height / 2 }
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
        const halfHandleSize = this.resizeHandleSize;
        const { rotatedX, rotatedY, centerX, centerY } = this.getRotatedXY(x, y);
        const rotatedHandles = [
            { x: centerX - this.width / 2, y: centerY - this.height / 2 },
            { x: centerX + this.width / 2, y: centerY - this.height / 2 },
            { x: centerX - this.width / 2, y: centerY + this.height / 2 },
            { x: centerX + this.width / 2, y: centerY + this.height / 2 }
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
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
        this.angle = angle;
    }

    handleResize(mouseX: number, mouseY: number) {
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
        const minSize = 100;
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
        this.width = newWidthFinal;
        this.height = newHeightFinal;
    }

    clickDrawImage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.ctx.rotate(this.angle);
        this.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        if (this.selectedImage) {
            this.drawHandles();
        }
        this.ctx.restore();
    }

    drawHandles() {
        
        // this.ctx.fillStyle = "red";
        const handleRotate = [
            {x:-this.width / 2 - this.rotateHandleSize + this.rotateHandleSize / 2,y:-this.height / 2 - this.rotateHandleSize + this.rotateHandleSize / 2},
            {x:this.width / 2 - this.rotateHandleSize / 2,y:-this.height / 2 - this.rotateHandleSize / 2},
            {x:-this.width / 2 - this.rotateHandleSize / 2,y:this.height / 2 - this.rotateHandleSize + this.rotateHandleSize / 2},
            {x:this.width / 2 - this.rotateHandleSize / 2,y:this.height / 2 - this.rotateHandleSize / 2}
        ]

        handleRotate.map((data,i)=>{
                this.ctx.drawImage(this.rotateIcon[i],data.x, data.y, this.rotateHandleSize, this.rotateHandleSize);
            })
            
            
            this.ctx.fillStyle = this.handleColor;
            const handleResizeIcon=[
                {x:-this.width / 2,y:-this.height / 2},
                {x:this.width / 2 - this.resizeHandleSize,y:-this.height / 2},
                {x:-this.width / 2,y:this.height / 2 - this.resizeHandleSize},
                {x:this.width / 2 - this.resizeHandleSize,y:this.height / 2 - this.resizeHandleSize}
            ]
            handleResizeIcon.map((data,i)=>{
            this.ctx.drawImage(i%3==0 ? this.resizeIcon[0] : this.resizeIcon[1],data.x, data.y, this.resizeHandleSize, this.resizeHandleSize);
            // this.ctx.fillRect(data.x, data.y, this.resizeHandleSize, this.resizeHandleSize);
        })
        
    }
}

export default Click;