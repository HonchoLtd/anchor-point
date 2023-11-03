// src/lib/Canvas.ts
var Canvas = class {
  constructor() {
    this.resizeHandleSize = 40;
    this.rotateHandleSize = 80;
    this.handleColor = "blue";
    this.selectedHandle = null;
    this.rotateIcon = [];
    this.resizeIcon = [];
    this.cursor = {
      pointer: "./cursor/Hand.cur",
      default: "./cursor/Arrow.cur",
      neSize: "./cursor/SizeNESW.cur",
      nwSize: "./cursor/SizeNWSE.cur",
      rotate: "./cursor/Rotate.cur",
      move: "./cursor/Cross.cur"
    };
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.image = new Image();
    this.aspectRatio = 0;
    this.angle = 0;
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.resizeHandleSize = 40;
    this.rotateHandleSize = 80;
    this.handleColor = "blue";
    this.selectedHandle = null;
    this.rotateIcon = [];
    this.resizeIcon = [];
    this.setCursor("default");
    this.setRotateIcon();
    this.initializeCanvasSize();
    window.addEventListener("resize", () => this.handleResizeScreen());
  }
  setRotateIcon() {
    const rotateIcon = [
      "./cursor/png/top-left-rotate.png",
      "./cursor/png/top-right-rotate.png",
      "./cursor/png/bottom-left-rotate.png",
      "./cursor/png/bottom-right-rotate.png"
    ];
    const resizeIcon = [
      "./cursor/png/ne-resize.png",
      "./cursor/png/nw-resize.png"
    ];
    rotateIcon.map((ico) => {
      const icon = new Image();
      icon.src = ico;
      icon.onload = () => {
        this.rotateIcon.push(icon);
      };
    });
    resizeIcon.map((ico) => {
      const icon = new Image();
      icon.src = ico;
      icon.onload = () => {
        this.resizeIcon.push(icon);
      };
    });
  }
  setCursor(condition) {
    this.canvas.style.cursor = `url(${this.cursor[condition]}), auto`;
  }
  initializeCanvasSize() {
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight;
  }
  handleResizeScreen() {
    this.initializeCanvasSize();
    this.drawImage();
  }
  setSticker(sticker, width, height) {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const aspectRatio = sticker.width / sticker.height;
    this.aspectRatio = aspectRatio;
    if (width > canvasWidth) {
      width = canvasWidth;
      height = width / aspectRatio;
    }
    if (height > canvasHeight) {
      height = canvasHeight;
      width = height * aspectRatio;
    }
    width = Math.max(width, 100);
    height = Math.max(height, 100);
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.drawImage();
  }
  setImage(path) {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      this.image = img;
      this.image.width = img.width;
      this.image.height = img.height;
      this.setSticker(img, img.width, img.height);
    };
  }
  drawImage() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    this.ctx.rotate(this.angle);
    this.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    this.ctx.restore();
  }
};
var Canvas_default = Canvas;

// src/lib/Click.ts
var Click = class extends Canvas_default {
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
    this.initialDistance = 0;
    this.currentDistance = 0;
    this.endPoint = null;
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
    this.boundOnMouseEnter = this.onMouseEnter.bind(this);
    this.canvas.addEventListener("mouseenter", this.boundOnMouseEnter);
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }
  onMouseEnter(e) {
    this.onMouseMove(e);
  }
  onMouseDown(e) {
    this.clicked = true;
    let clientX = 0, clientY = 0;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e instanceof TouchEvent) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
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
  onMouseMove(e) {
    let clientX = 0, clientY = 0;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e instanceof TouchEvent) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
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
  handleDraging(mouseX, mouseY) {
    let newStickerX = mouseX - this.dragStartX;
    let newStickerY = mouseY - this.dragStartY;
    newStickerX = Math.max(0, newStickerX);
    newStickerY = Math.max(0, newStickerY);
    newStickerX = Math.min(this.canvas.width - this.width, newStickerX);
    newStickerY = Math.min(this.canvas.height - this.height, newStickerY);
    this.x = newStickerX;
    this.y = newStickerY;
  }
  getRotatedXY(x, y) {
    const cosAngle = Math.cos(-this.angle);
    const sinAngle = Math.sin(-this.angle);
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const rotatedX = (x - centerX) * cosAngle - (y - centerY) * sinAngle + centerX;
    const rotatedY = (x - centerX) * sinAngle + (y - centerY) * cosAngle + centerY;
    return { rotatedX, rotatedY, centerX, centerY, cosAngle, sinAngle };
  }
  handleAction(mouseX, mouseY) {
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
  handleCursor(mouseX, mouseY) {
    const isInsideImage = this.isPointerInsideImage(mouseX, mouseY);
    const indexRotate = this.getRotatePosition(mouseX, mouseY);
    const index = this.getResizePosition(mouseX, mouseY);
    const cursor = ["nwSize", "neSize", "neSize", "nwSize"];
    if (isInsideImage) {
      if (index !== null) {
        super.setCursor(cursor[index]);
      } else {
        super.setCursor("move");
      }
    } else if (!isInsideImage && indexRotate !== null) {
      super.setCursor("rotate");
    } else {
      this.canvas.style.cursor = `url(${this.cursor.default}), auto`;
    }
  }
  isPointerInsideImage(mouseX, mouseY) {
    const { rotatedX, rotatedY } = this.getRotatedXY(mouseX, mouseY);
    return rotatedX >= this.x && rotatedX <= this.x + this.width && rotatedY >= this.y && rotatedY <= this.y + this.height;
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
  getRotatePosition(x, y) {
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
      if (rotatedX >= handle.x - halfHandleSize && rotatedX <= handle.x + halfHandleSize && rotatedY >= handle.y - halfHandleSize && rotatedY <= handle.y + halfHandleSize && !this.isPointerInsideImage(x, y)) {
        return i;
      }
    }
    return null;
  }
  getResizePosition(x, y) {
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
      if (rotatedX >= handle.x - halfHandleSize && rotatedX <= handle.x + halfHandleSize && rotatedY >= handle.y - halfHandleSize && rotatedY <= handle.y + halfHandleSize) {
        return i;
      }
    }
    return null;
  }
  handleRotation(mouseX, mouseY) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    this.angle = angle;
  }
  handleResize(mouseX, mouseY) {
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
    const handleRotate = [
      { x: -this.width / 2 - this.rotateHandleSize + this.rotateHandleSize / 2, y: -this.height / 2 - this.rotateHandleSize + this.rotateHandleSize / 2 },
      { x: this.width / 2 - this.rotateHandleSize / 2, y: -this.height / 2 - this.rotateHandleSize / 2 },
      { x: -this.width / 2 - this.rotateHandleSize / 2, y: this.height / 2 - this.rotateHandleSize + this.rotateHandleSize / 2 },
      { x: this.width / 2 - this.rotateHandleSize / 2, y: this.height / 2 - this.rotateHandleSize / 2 }
    ];
    handleRotate.map((data, i) => {
      this.ctx.drawImage(this.rotateIcon[i], data.x, data.y, this.rotateHandleSize, this.rotateHandleSize);
    });
    this.ctx.fillStyle = this.handleColor;
    const handleResizeIcon = [
      { x: -this.width / 2, y: -this.height / 2 },
      { x: this.width / 2 - this.resizeHandleSize, y: -this.height / 2 },
      { x: -this.width / 2, y: this.height / 2 - this.resizeHandleSize },
      { x: this.width / 2 - this.resizeHandleSize, y: this.height / 2 - this.resizeHandleSize }
    ];
    handleResizeIcon.map((data, i) => {
      this.ctx.drawImage(i % 3 == 0 ? this.resizeIcon[0] : this.resizeIcon[1], data.x, data.y, this.resizeHandleSize, this.resizeHandleSize);
    });
  }
};
var Click_default = Click;

// src/lib/TouchGesture.ts
var TouchGesture = class extends Click_default {
  constructor() {
    super();
    this.lastTouches = [];
    this.animationFrame = null;
    this.isAnimating = false;
    this.canvas.addEventListener("touchstart", this.onTouchStart.bind(this));
    this.canvas.addEventListener("touchmove", this.onTouchMove.bind(this));
    this.canvas.addEventListener("touchend", this.onTouchEnd.bind(this));
  }
  calculateScale(e) {
    if (e.touches.length >= 2) {
      const initialDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const currentDistance = Math.hypot(
        this.lastTouches[0].clientX - this.lastTouches[1].clientX,
        this.lastTouches[0].clientY - this.lastTouches[1].clientY
      );
      const deltaDistance = currentDistance - initialDistance;
      const newHeight = this.height - deltaDistance;
      const newWidth = newHeight * this.aspectRatio;
      const deltaX = (this.width - newWidth) / 2;
      const deltaY = (this.height - newHeight) / 2;
      this.width = newWidth;
      this.height = newHeight;
      this.x += deltaX;
      this.y += deltaY;
      return deltaDistance;
    }
    return 1;
  }
  calculateRotation(e) {
    if (e.touches.length >= 2) {
      const initialAngle = Math.atan2(
        this.lastTouches[1].clientY - this.lastTouches[0].clientY,
        this.lastTouches[1].clientX - this.lastTouches[0].clientX
      );
      const currentAngle = Math.atan2(
        e.touches[1].clientY - e.touches[0].clientY,
        e.touches[1].clientX - e.touches[0].clientX
      );
      return this.angle + (currentAngle - initialAngle);
    }
    return this.angle;
  }
  animate() {
    if (!this.isAnimating)
      return;
    this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    this.touchDrawImage();
  }
  stopAnimate() {
    if (this.animationFrame)
      cancelAnimationFrame(this.animationFrame);
    this.isAnimating = false;
  }
  touchDrawImage() {
    super.drawImage();
  }
  onTouchStart(e) {
    e.preventDefault();
    if (e.touches.length >= 2) {
      this.isAnimating = true;
      this.selectedImage = false;
      this.lastTouches = Array.from(e.touches);
      ;
      this.animate();
      this.angle = this.calculateRotation(e);
      this.scale = this.calculateScale(e);
    } else if (e.touches.length === 1) {
      super.onMouseDown(e);
    }
  }
  onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length >= 2) {
      this.angle = this.calculateRotation(e);
      this.scale = this.calculateScale(e);
      this.lastTouches = Array.from(e.touches);
    } else if (e.touches.length === 1) {
      super.onMouseMove(e);
    }
  }
  onTouchEnd() {
    super.handleCursor(-1, -1);
    this.lastTouches = [];
    super.reset();
    this.clicked = false;
    this.selectedHandle = null;
    this.stopAnimate();
  }
};
var TouchGesture_default = TouchGesture;

// src/core/Watermark.ts
var Watermark = class extends TouchGesture_default {
  constructor() {
    super();
  }
};
var Watermark_default = Watermark;
export {
  Watermark_default as Watermark
};
