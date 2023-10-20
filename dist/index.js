"use strict";
// src/index.ts
class Watermark {
    constructor() {
        this.orientation = "portrait";
        this.watermarkConfig = {};
        this.portrait = null;
        this.landscape = null;
        this.square = null;
        this.scale = { scale: "custom" };
        this.position = { position: "top-left" };
        this.canvas = document.getElementById('ubersnap-watermark');
        this.context = this.canvas.getContext('2d');
        if (!this.context) {
            throw new Error("Canvas context not supported.");
        }
        if (this.orientation === "portrait") {
            this.setSizeCanvas(300, 450);
        }
        this.canvas.style.border = "1px solid #8D8D8D";
    }
    saveWatermark() {
        return this.watermarkConfig;
    }
    setSizeCanvas(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    setOrientation(orientation) {
        this.orientation = orientation;
        if (orientation === "portrait") {
            this.setSizeCanvas(300, 450);
        }
        if (orientation === "landscape") {
            this.setSizeCanvas(450, 800);
        }
        if (orientation === "square") {
            this.setSizeCanvas(450, 450);
        }
    }
    setScale(value) {
        this.scale = value;
    }
    setPosition(value) {
        this.position = value;
    }
    getScale() {
        return this.scale;
    }
    getPosition() {
        return this.position;
    }
    setBorderColor(color) {
        this.canvas.style.borderColor = color;
    }
    setBackgroundColor(color) {
        this.canvas.style.backgroundColor = color;
    }
}
class WatermarkSticker extends Watermark {
    constructor() {
        super();
        this.stickers = null;
        this.isDragging = false;
        this.isResizing = false;
        this.isResizingTopLeft = false;
        this.isResizingTopRight = false;
        this.isResizingBottomLeft = false;
        this.isResizingBottomRight = false;
        this.isRotating = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.resizeStartX = 0;
        this.resizeStartY = 0;
        this.initialWidth = 0;
        this.initialHeight = 0;
        this.cornerSize = 25;
        this.rotationHandleRadius = 15;
        this.isSelected = true;
        this.aspectRatio = 0;
        this.isDragging = false;
        this.isResizing = false;
        this.isRotating = false;
        this.cornerSize = 25;
        this.rotationHandleRadius = 15;
        this.pinchStartDistance = 0;
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    setCanvasSize(width, height) {
        this.setSizeCanvas(width, height);
        if (this.stickers) {
            const position = super.getPosition().position;
            const scale = super.getScale().scale;
            this.UpdateSticker(this.stickers, scale, position);
        }
    }
    setScaleSticker(val) {
        super.setScale(val);
        if (this.stickers) {
            this.UpdateSticker(this.stickers, val.scale, super.getPosition().position);
        }
    }
    setPositionSticker(val) {
        const position = val.position;
        const customEvent = new CustomEvent("anchor-point", { detail: { position } });
        document.dispatchEvent(customEvent);
        if (this.stickers) {
            this.UpdateSticker(this.stickers, super.getScale().scale, position);
        }
        super.setPosition(val);
    }
    setStickerData(sticker, width, height) {
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
        width = Math.max(width, 30);
        height = Math.max(height, 30);
        // Center the sticker on the canvas
        const x = (canvasWidth - width) / 2;
        const y = (canvasHeight - height) / 2;
        this.addSticker(sticker, x, y, width, height);
    }
    UpdateSticker(sticker, scaleData, positionData) {
        if (scaleData === "custom") {
            this.isSelected = true;
        }
        else {
            this.changeSelectedStickerOnClick(-1, -1);
        }
        let newX = 0;
        let newY = 0;
        let newWidth = sticker.width;
        let newHeight = sticker.height;
        switch (positionData) {
            case 'top-left':
                newX = 0;
                newY = 0;
                break;
            case 'top-center':
                newX = (this.canvas.width / 2) - (sticker.width / 2);
                newY = 0;
                break;
            case 'top-right':
                newX = this.canvas.width - sticker.width;
                newY = 0;
                break;
            case 'middle-left':
                newX = 0;
                newY = (this.canvas.height / 2) - (sticker.height / 2);
                break;
            case 'middle-center':
                newX = (this.canvas.width / 2) - (sticker.width / 2);
                newY = (this.canvas.height / 2) - (sticker.height / 2);
                break;
            case 'middle-right':
                newX = (this.canvas.width) - (sticker.width);
                newY = (this.canvas.height / 2) - (sticker.height / 2);
                break;
            case 'bottom-left':
                newX = 0;
                newY = (this.canvas.height) - (sticker.height);
                break;
            case 'bottom-center':
                newX = (this.canvas.width / 2) - (sticker.width / 2);
                newY = (this.canvas.height) - (sticker.height);
                break;
            case 'bottom-right':
                newX = (this.canvas.width) - (sticker.width);
                newY = (this.canvas.height) - (sticker.height);
                break;
            default:
                newX = 0;
                newY = 0;
        }
        if (scaleData === "fit") {
            if ((sticker.width / this.canvas.width) > (sticker.height / this.canvas.height)) {
                newWidth = this.canvas.width;
                newHeight = newWidth / this.aspectRatio;
                if (positionData === null || positionData === void 0 ? void 0 : positionData.includes('top')) {
                    newX = 0;
                    newY = 0;
                }
                if (positionData === null || positionData === void 0 ? void 0 : positionData.includes('middle')) {
                    newX = 0;
                    newY = (this.canvas.height / 2) - (sticker.height / 2);
                }
                if (positionData === null || positionData === void 0 ? void 0 : positionData.includes('bottom')) {
                    newX = 0;
                    newY = (this.canvas.height) - (sticker.height);
                }
            }
            else if ((sticker.width / this.canvas.width) < (sticker.height / this.canvas.height)) {
                newHeight = this.canvas.height;
                newWidth = newHeight * this.aspectRatio;
                if (positionData === null || positionData === void 0 ? void 0 : positionData.includes('left')) {
                    newX = 0;
                    newY = 0;
                }
                if (positionData === null || positionData === void 0 ? void 0 : positionData.includes('center')) {
                    newX = (this.canvas.width / 2) - (sticker.width / 2);
                    newY = (this.canvas.height / 2) - (sticker.height / 2);
                }
                if (positionData === null || positionData === void 0 ? void 0 : positionData.includes('right')) {
                    newX = (this.canvas.width) - (sticker.width);
                    newY = (this.canvas.height) - (sticker.height);
                }
            }
            else {
                newWidth = this.canvas.width;
                newHeight = this.canvas.height;
            }
        }
        if (scaleData === "fill") {
            // Calculate the aspect ratios of the canvas and the sticker
            const canvasAspectRatio = this.canvas.width / this.canvas.height;
            const stickerAspectRatio = sticker.width / sticker.height;
            if (canvasAspectRatio > stickerAspectRatio) {
                // Canvas is wider
                newWidth = this.canvas.width;
                newHeight = newWidth / stickerAspectRatio;
            }
            else if (canvasAspectRatio < stickerAspectRatio) {
                // Canvas is taller
                newHeight = this.canvas.height;
                newWidth = newHeight * stickerAspectRatio;
            }
            else {
                // Canvas and sticker have the same aspect ratio (both square)
                newWidth = this.canvas.width;
                newHeight = this.canvas.height;
            }
            // The newWidth and newHeight now represent the dimensions to make the sticker fill the canvas without leaving empty space.
            newX = (this.canvas.width / 2) - (sticker.width / 2);
            newY = (this.canvas.height / 2) - (sticker.height / 2);
        }
        this.stickers = { sticker: sticker.sticker, x: newX, y: newY, width: newWidth, height: newHeight, rotation: sticker.rotation };
        // this.stickers={ sticker:sticker , x:x, y:y, width:width, height:height,rotation:0 };
        this.redraw();
    }
    addSticker(sticker, x, y, width, height) {
        const position = super.getPosition();
        const scale = super.getScale();
        this.stickers = { sticker: sticker, x: x, y: y, width: width, height: height, rotation: 0 };
        this.UpdateSticker({ sticker: sticker, x: x, y: y, width: width, height: height, rotation: 0 }, scale.scale, position.position);
        // this.stickers={ sticker:sticker , x:x, y:y, width:width, height:height,rotation:0 };
        // this.redraw();
    }
    removeSticker() {
        this.stickers = null;
    }
    isMouseInsideSelectedStickerStroke(mouseX, mouseY) {
        const selectedSticker = this.getSelectedSticker();
        if (selectedSticker) {
            const halfStrokeWidth = 5;
            return (mouseX >= selectedSticker.x - halfStrokeWidth &&
                mouseX <= selectedSticker.x + selectedSticker.width + halfStrokeWidth &&
                mouseY >= selectedSticker.y - halfStrokeWidth &&
                mouseY <= selectedSticker.y + selectedSticker.height + halfStrokeWidth);
        }
        return false;
    }
    getSelectedSticker() {
        return this.stickers;
    }
    doneEditing() {
        this.redraw(); // Redraw the canvas to remove the stroke
    }
    trackAnchorPoint(newStickerY, newStickerX) {
        // Update the sticker's position
        const anchorX = this.canvas.width / 3;
        const anchorY = this.canvas.height / 3;
        let position = "";
        if (newStickerY < anchorY) {
            position = "top";
        }
        else if (newStickerY >= anchorY && newStickerY < (anchorY * 2)) {
            position = "middle";
        }
        else if (newStickerY >= (anchorY * 2)) {
            position = "bottom";
        }
        if (newStickerX < anchorX) {
            position += "-left";
        }
        else if (newStickerX >= anchorX && newStickerX < (anchorX * 2)) {
            position += "-center";
        }
        else if (newStickerX >= (anchorX * 2)) {
            position += "-right";
        }
        super.setPosition({ position: position });
        const customEvent = new CustomEvent("anchor-point", { detail: { position } });
        document.dispatchEvent(customEvent);
    }
    handleMouseDown(event) {
        let clientX = 0, clientY = 0;
        if (super.getScale().scale !== "custom")
            return;
        if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        else if (event instanceof TouchEvent) {
            if (event.touches.length > 0) {
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            }
            else {
                return; // No touches to handle
            }
        }
        const mouseX = clientX - this.canvas.getBoundingClientRect().left;
        const mouseY = clientY - this.canvas.getBoundingClientRect().top;
        const selectedSticker = this.stickers;
        if (selectedSticker && this.isSelected) {
            const cornerX = [selectedSticker.x, selectedSticker.x + selectedSticker.width];
            const cornerY = [selectedSticker.y, selectedSticker.y + selectedSticker.height];
            if (mouseX >= selectedSticker.x &&
                mouseX <= selectedSticker.x + selectedSticker.width &&
                mouseY >= selectedSticker.y &&
                mouseY <= selectedSticker.y + selectedSticker.height &&
                !((Math.abs(mouseX - cornerX[0]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[0]) <= this.cornerSize / 2) ||
                    (Math.abs(mouseX - cornerX[1]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[0]) <= this.cornerSize / 2) ||
                    (Math.abs(mouseX - cornerX[0]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[1]) <= this.cornerSize / 2) ||
                    (Math.abs(mouseX - cornerX[1]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[1]) <= this.cornerSize / 2))) {
                this.isDragging = true;
                this.dragOffsetX = mouseX - selectedSticker.x;
                this.dragOffsetY = mouseY - selectedSticker.y;
            }
            else if (mouseX >= selectedSticker.x + selectedSticker.width / 2 - this.rotationHandleRadius &&
                mouseX <= selectedSticker.x + selectedSticker.width / 2 + this.rotationHandleRadius &&
                mouseY >= selectedSticker.y + selectedSticker.height + 20 - this.rotationHandleRadius &&
                mouseY <= selectedSticker.y + selectedSticker.height + 20 + this.rotationHandleRadius) {
                this.isRotating = true;
            }
            else if (!this.isDragging && (Math.abs(mouseX - cornerX[0]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[0]) <= this.cornerSize / 2) ||
                (Math.abs(mouseX - cornerX[1]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[0]) <= this.cornerSize / 2) ||
                (Math.abs(mouseX - cornerX[0]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[1]) <= this.cornerSize / 2) ||
                (Math.abs(mouseX - cornerX[1]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[1]) <= this.cornerSize / 2)) {
                if (Math.abs(mouseX - cornerX[0]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[0]) <= this.cornerSize / 2) {
                    this.isResizing = true;
                    this.isResizingTopLeft = true;
                }
                else if (Math.abs(mouseX - cornerX[1]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[0]) <= this.cornerSize / 2) {
                    this.isResizing = true;
                    this.isResizingTopRight = true;
                }
                else if (Math.abs(mouseX - cornerX[0]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[1]) <= this.cornerSize / 2) {
                    this.isResizing = true;
                    this.isResizingBottomLeft = true;
                }
                else if (Math.abs(mouseX - cornerX[1]) <= this.cornerSize / 2 && Math.abs(mouseY - cornerY[1]) <= this.cornerSize / 2) {
                    this.isResizing = true;
                    this.isResizingBottomRight = true;
                }
                if (this.isResizing) {
                    this.resizeStartX = mouseX;
                    this.resizeStartY = mouseY;
                    this.initialWidth = selectedSticker.width;
                    this.initialHeight = selectedSticker.height;
                }
            }
            else {
                this.changeSelectedStickerOnClick(mouseX, mouseY);
            }
        }
        else {
            this.changeSelectedStickerOnClick(mouseX, mouseY);
        }
    }
    handleMouseMove(event) {
        let clientX = 0, clientY = 0;
        if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        else if (event instanceof TouchEvent) {
            if (event.touches.length > 0) {
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            }
            else {
                return; // No touches to handle
            }
        }
        const mouseX = clientX - this.canvas.getBoundingClientRect().left;
        const mouseY = clientY - this.canvas.getBoundingClientRect().top;
        if (this.isDragging) {
            const selectedSticker = this.getSelectedSticker();
            if (selectedSticker) {
                // Calculate the new position of the sticker
                let newStickerX = mouseX - this.dragOffsetX;
                let newStickerY = mouseY - this.dragOffsetY;
                // Limit the sticker's position to stay within the canvas boundaries
                const stickerWidth = selectedSticker.width;
                const stickerHeight = selectedSticker.height;
                // Ensure the sticker doesn't go outside the left boundary
                newStickerX = Math.max(0, newStickerX);
                // Ensure the sticker doesn't go outside the top boundary
                newStickerY = Math.max(0, newStickerY);
                // Ensure the sticker doesn't go outside the right boundary
                newStickerX = Math.min(this.canvas.width - stickerWidth, newStickerX);
                // Ensure the sticker doesn't go outside the bottom boundary
                newStickerY = Math.min(this.canvas.height - stickerHeight, newStickerY);
                this.trackAnchorPoint(newStickerY, newStickerX);
                selectedSticker.x = newStickerX;
                selectedSticker.y = newStickerY;
                this.redraw();
            }
        }
        else if (this.isResizing) {
            const selectedSticker = this.stickers;
            if (selectedSticker && this.isSelected) {
                let newWidth = 0;
                let newHeight = 0;
                const deltaX = mouseX - this.resizeStartX;
                const deltaY = mouseY - this.resizeStartY;
                if (this.isResizingTopLeft) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        newWidth = this.initialWidth - deltaX;
                        newHeight = newWidth / this.aspectRatio; // Maintain aspect ratio
                    }
                    else {
                        newHeight = this.initialHeight - deltaY;
                        newWidth = newHeight * this.aspectRatio; // Maintain aspect ratio
                    }
                    selectedSticker.x = this.resizeStartX - (newWidth - this.initialWidth);
                    selectedSticker.y = this.resizeStartY - (newHeight - this.initialHeight);
                }
                else if (this.isResizingTopRight) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        newWidth = this.initialWidth + deltaX;
                        newHeight = newWidth / this.aspectRatio; // Maintain aspect ratio
                    }
                    else {
                        newHeight = this.initialHeight - deltaY;
                        newWidth = newHeight * this.aspectRatio; // Maintain aspect ratio
                    }
                    selectedSticker.y = this.resizeStartY - (newHeight - this.initialHeight);
                }
                else if (this.isResizingBottomLeft) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        newWidth = this.initialWidth - deltaX;
                        newHeight = newWidth / this.aspectRatio; // Maintain aspect ratio
                    }
                    else {
                        newHeight = this.initialHeight + deltaY;
                        newWidth = newHeight * this.aspectRatio; // Maintain aspect ratio
                    }
                    selectedSticker.x = this.resizeStartX - (newWidth - this.initialWidth);
                }
                else if (this.isResizingBottomRight) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        newWidth = this.initialWidth + deltaX;
                        newHeight = newWidth / this.aspectRatio; // Maintain aspect ratio
                    }
                    else {
                        newHeight = this.initialHeight + deltaY;
                        newWidth = newHeight * this.aspectRatio; // Maintain aspect ratio
                    }
                }
                this.trackAnchorPoint(selectedSticker.y, selectedSticker.x);
                // Limit the sticker's size to a minimum of 30x30 pixels
                newWidth = Math.max(30, newWidth);
                newHeight = Math.max(30, newHeight);
                // Limit the sticker's size to stay within the canvas boundaries
                const maxWidth = this.canvas.width - selectedSticker.x;
                const maxHeight = this.canvas.height - selectedSticker.y;
                newWidth = Math.min(newWidth, maxWidth);
                newHeight = Math.min(newHeight, maxHeight);
                // Update the sticker's width and height
                selectedSticker.width = newWidth;
                selectedSticker.height = newHeight;
                this.redraw();
            }
        }
        else if (this.isRotating) {
            const selectedSticker = this.getSelectedSticker();
            if (selectedSticker) {
                const centerX = selectedSticker.x + selectedSticker.width / 2;
                const centerY = selectedSticker.y + selectedSticker.height / 2;
                const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
                selectedSticker.rotation = angle;
                this.redraw();
            }
        }
    }
    handleMouseUp() {
        this.isDragging = false;
        this.isResizing = false;
        this.isResizingTopLeft = false;
        this.isResizingTopRight = false;
        this.isResizingBottomLeft = false;
        this.isResizingBottomRight = false;
        this.isRotating = false;
    }
    handleTouchStart(event) {
        event.preventDefault(); // Prevent default touch behavior (e.g., scrolling or zooming)
        const touch = event.touches;
        if (touch.length === 2) {
            const touch1 = touch[0];
            const touch2 = touch[1];
            // Calculate the initial distance between the two touches
            this.pinchStartDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
        }
        else {
            this.handleMouseDown(event);
        }
    }
    handleTouchMove(event) {
        event.preventDefault(); // Prevent default touch behavior (e.g., scrolling or zooming)
        const touch = event.touches;
        if (touch.length === 2) {
            const touch1 = touch[0];
            const touch2 = touch[1];
            // Calculate the current distance between the two touches
            const currentDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            const selectedSticker = this.getSelectedSticker();
            if (selectedSticker && this.isSelected) {
                const canvasWidth = this.canvas.width;
                const canvasHeight = this.canvas.height;
                // Calculate the scaling factor based on the change in distance
                const scaleFactor = currentDistance / this.pinchStartDistance;
                // Define a threshold for scaling to prevent small, rapid changes
                const scalingThreshold = 1.01; // Adjust as needed
                if (scaleFactor > scalingThreshold) {
                    // Increase sticker size, but ensure it doesn't exceed canvas dimensions
                    const newWidth = selectedSticker.width * scaleFactor;
                    const newHeight = selectedSticker.height * scaleFactor;
                    if (newWidth <= canvasWidth && newHeight <= canvasHeight) {
                        selectedSticker.width = newWidth;
                        selectedSticker.height = newHeight;
                    }
                }
                else if (scaleFactor < 1 / scalingThreshold) {
                    // Decrease sticker size, but ensure it doesn't go too small
                    if (selectedSticker.width > 30 && selectedSticker.height > 30) {
                        const newWidth = selectedSticker.width * scaleFactor;
                        const newHeight = selectedSticker.height * scaleFactor;
                        selectedSticker.width = Math.max(newWidth, 30);
                        selectedSticker.height = Math.max(newHeight, 30);
                    }
                }
                // Update the pinch start distance for the next move event
                this.pinchStartDistance = currentDistance;
                // Redraw the canvas to update the sticker's size
                this.redraw();
            }
        }
        else {
            this.handleMouseMove(event);
        }
    }
    handleTouchEnd(event) {
        event.preventDefault(); // Prevent default touch behavior (e.g., scrolling or zooming)
        this.handleMouseUp();
    }
    changeSelectedStickerOnClick(mouseX, mouseY) {
        if (this.stickers) {
            const isInsideSticker = (mouseX >= this.stickers.x &&
                mouseX <= this.stickers.x + this.stickers.width &&
                mouseY >= this.stickers.y &&
                mouseY <= this.stickers.y + this.stickers.height);
            if (isInsideSticker) {
                this.isSelected = true;
            }
            else {
                this.isSelected = false;
            }
            this.redraw();
        }
    }
    rotatePoint(x, y, pivotX, pivotY, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const newX = (x - pivotX) * cos - (y - pivotY) * sin + pivotX;
        const newY = (x - pivotX) * sin + (y - pivotY) * cos + pivotY;
        return { x: newX, y: newY };
    }
    redraw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save(); // Save the current canvas state
        const sticker = this.stickers;
        // Draw a red stroke around the selected sticker
        if (sticker) {
            // Translate and rotate the canvas to position and rotate the sticker
            this.context.translate(sticker.x + sticker.width / 2, sticker.y + sticker.height / 2);
            this.context.rotate(sticker.rotation);
            // Draw the sticker centered at (0, 0)
            this.context.drawImage(sticker.sticker, -sticker.width / 2, -sticker.height / 2, sticker.width, sticker.height);
            // Restore the canvas state
            this.context.restore();
            // Calculate the rotated coordinates of the sticker's corners
            const topLeft = this.rotatePoint(sticker.x, sticker.y, sticker.x + sticker.width / 2, sticker.y + sticker.height / 2, sticker.rotation);
            const topRight = this.rotatePoint(sticker.x + sticker.width, sticker.y, sticker.x + sticker.width / 2, sticker.y + sticker.height / 2, sticker.rotation);
            const bottomLeft = this.rotatePoint(sticker.x, sticker.y + sticker.height, sticker.x + sticker.width / 2, sticker.y + sticker.height / 2, sticker.rotation);
            const bottomRight = this.rotatePoint(sticker.x + sticker.width, sticker.y + sticker.height, sticker.x + sticker.width / 2, sticker.y + sticker.height / 2, sticker.rotation);
            if (this.isSelected) {
                // Calculate the bounding box of the rotated sticker
                const minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
                const minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
                const maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
                const maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
                this.context.strokeStyle = 'blue';
                this.context.lineWidth = 5;
                this.context.strokeRect(sticker.x, sticker.y, sticker.width, sticker.height);
                const strokeSize = 25;
                const cornerColor = 'white';
                const strokeColor = 'blue';
                this.context.fillStyle = cornerColor;
                this.context.strokeStyle = strokeColor;
                this.context.lineWidth = 2;
                this.context.fillRect(sticker.x - this.cornerSize / 2, sticker.y - this.cornerSize / 2, this.cornerSize, this.cornerSize);
                this.context.strokeRect(sticker.x - strokeSize / 2, sticker.y - strokeSize / 2, strokeSize, strokeSize);
                this.context.fillRect(sticker.x + sticker.width - this.cornerSize / 2, sticker.y - this.cornerSize / 2, this.cornerSize, this.cornerSize);
                this.context.strokeRect(sticker.x + sticker.width - strokeSize / 2, sticker.y - strokeSize / 2, strokeSize, strokeSize);
                this.context.fillRect(sticker.x - this.cornerSize / 2, sticker.y + sticker.height - this.cornerSize / 2, this.cornerSize, this.cornerSize);
                this.context.strokeRect(sticker.x - strokeSize / 2, sticker.y + sticker.height - strokeSize / 2, strokeSize, strokeSize);
                this.context.fillRect(sticker.x + sticker.width - this.cornerSize / 2, sticker.y + sticker.height - this.cornerSize / 2, this.cornerSize, this.cornerSize);
                this.context.strokeRect(sticker.x + sticker.width - strokeSize / 2, sticker.y + sticker.height - strokeSize / 2, strokeSize, strokeSize);
                const centerX = sticker.x + sticker.width / 2;
                const centerY = sticker.y + sticker.height;
                this.context.beginPath();
                this.context.moveTo(centerX, centerY);
                this.context.lineTo(centerX, centerY + 30);
                this.context.lineWidth = 5;
                this.context.strokeStyle = 'blue';
                this.context.stroke();
                this.context.beginPath();
                this.context.arc(centerX, centerY + 30, this.rotationHandleRadius, 0, 2 * Math.PI);
                this.context.fillStyle = 'blue';
                this.context.fill();
                this.context.beginPath();
                this.context.arc(centerX, centerY + 30, 10, 0, 2 * Math.PI);
                this.context.fillStyle = 'yellow';
                this.context.fill();
            }
        }
    }
}
class Sticker {
    constructor(url, x, y, width, height) {
        this.url = url;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = url;
    }
}
