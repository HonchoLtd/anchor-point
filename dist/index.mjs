var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/lib/Canvas.ts
var Canvas = class {
  constructor(canvasId) {
    this.background = null;
    this.resizeHandleSize = 40;
    this.rotateHandleSize = 80;
    this.handleColor = "blue";
    this.selectedHandle = null;
    this.rotateIcon = [];
    this.resizeIcon = [];
    this.orientation = "portrait";
    this.cursor = {
      pointer: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/Hand.cur",
      default: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/Arrow.cur",
      neSize: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/SizeNESW.cur",
      nwSize: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/SizeNWSE.cur",
      rotate: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/Rotate.cur",
      move: "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/Cross.cur"
    };
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.image = new Image();
    this.aspectRatio = 0;
    this.x = 0;
    this.y = 0;
    this.resizeHandleSize = 40;
    this.rotateHandleSize = 80;
    this.handleColor = "blue";
    this.selectedHandle = null;
    this.rotateIcon = [];
    this.resizeIcon = [];
    this.setCursor("default");
    this.setIcon();
    this.sticker = {
      link: "",
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      anchor: "top-left",
      size: "Custom",
      rotation: 0
    };
    this.initialSticker = {
      link: "",
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      anchor: "top-left",
      size: "Custom",
      rotation: 0
    };
    this.initializeCanvasSize();
    this.onResizeScreen = this.handleResizeScreen.bind(this);
  }
  calculateAnchor(anchor) {
    const data = anchor || this.sticker.anchor;
    switch (data) {
      case "top-left":
        this.sticker.x = this.x;
        this.sticker.y = this.y;
        break;
      case "top-center":
        this.sticker.x = this.x - this.canvas.width / 2;
        this.sticker.y = this.y;
        break;
      case "top-right":
        this.sticker.x = this.canvas.width - this.x;
        this.sticker.y = this.y;
        break;
      case "middle-left":
        this.sticker.x = this.x;
        this.sticker.y = this.y - this.canvas.height / 2;
        break;
      case "middle-center":
        this.sticker.x = this.x - this.canvas.width / 2;
        this.sticker.y = this.y - this.canvas.height / 2;
        break;
      case "middle-right":
        this.sticker.x = this.canvas.width - this.x;
        this.sticker.y = this.y - this.canvas.height / 2;
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
        console.log("Wrong data input");
        break;
    }
  }
  calculateRelativeXY(anchor) {
    const data = anchor || this.sticker.anchor;
    let x = 0;
    let y = 0;
    switch (data) {
      case "top-left":
        x = this.sticker.x;
        y = this.sticker.y;
        break;
      case "top-center":
        x = this.sticker.x + this.canvas.width / 2;
        y = this.sticker.y;
        break;
      case "top-right":
        x = this.canvas.width - this.sticker.x;
        y = this.sticker.y;
        break;
      case "middle-left":
        x = this.sticker.x;
        y = this.sticker.y + this.canvas.height / 2;
        break;
      case "middle-center":
        x = this.sticker.x + this.canvas.width / 2;
        y = this.sticker.y + this.canvas.height / 2;
        break;
      case "middle-right":
        x = this.canvas.width - this.sticker.x;
        y = this.sticker.y + this.canvas.height / 2;
        break;
      case "bottom-left":
        x = this.sticker.x;
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
        console.log("Wrong data input");
        break;
    }
    this.x = x;
    this.y = y;
  }
  setAnchorPoint(anchor) {
    if (this.sticker) {
      this.sticker.anchor = anchor;
      this.calculateAnchor(anchor);
      this.dispatchEvent();
      this.drawImage();
    }
  }
  deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }
    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
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
  dispatchEvent() {
    const compare = this.deepEqual(this.initialSticker, this.sticker);
    if (!compare) {
      const customEvent = new CustomEvent("sticker", {
        detail: {
          sticker: this.sticker,
          orientation: this.orientation
        }
      });
      document.dispatchEvent(customEvent);
      this.initialSticker = __spreadValues({}, this.sticker);
    }
  }
  setIcon() {
    const rotateIcon = [
      "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/top-left-rotate.png",
      "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/top-right-rotate.png",
      "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/bottom-left-rotate.png",
      "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/bottom-right-rotate.png"
    ];
    const resizeIcon = [
      "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/ne-resize.png",
      "https://raw.githubusercontent.com/ferdyUbersnap/cursor/main/cursor/png/nw-resize.png"
    ];
    rotateIcon.map((ico, index) => {
      const icon = new Image();
      icon.src = ico;
      icon.onload = () => {
        this.rotateIcon[index] = icon;
      };
    });
    resizeIcon.map((ico, index) => {
      const icon = new Image();
      icon.src = ico;
      icon.onload = () => {
        this.resizeIcon[index] = icon;
      };
    });
  }
  setCursor(condition) {
    this.canvas.style.cursor = `url(${this.cursor[condition]}), auto`;
  }
  initializeCanvasSize() {
    if (this.background) {
      const aspectRatio = this.background.width / this.background.height;
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
    } else {
      this.canvas.width = this.canvas.parentElement.clientWidth;
      this.canvas.height = this.canvas.parentElement.clientHeight;
    }
  }
  handleResizeScreen() {
    this.initializeCanvasSize();
    this.drawImage();
  }
  setBackgroundImage(path) {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      this.background = {
        img,
        width: img.width,
        height: img.height
      };
      this.handleResizeScreen();
    };
  }
  drawImage() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.background) {
      this.ctx.drawImage(this.background.img, 0, 0, this.canvas.width, this.canvas.height);
    }
    if (this.sticker && this.image) {
      this.ctx.save();
      this.ctx.translate(this.x + this.sticker.width / 2, this.y + this.sticker.height / 2);
      this.ctx.rotate(this.sticker.rotation);
      this.ctx.drawImage(this.image, -this.sticker.width / 2, -this.sticker.height / 2, this.sticker.width, this.sticker.height);
      this.ctx.restore();
    }
  }
};
var Canvas_default = Canvas;

// src/lib/Click.ts
var Click = class extends Canvas_default {
  constructor(canvasId) {
    super(canvasId);
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
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseUp = this.onMouseUp.bind(this);
  }
  onMouseEnter(e) {
    this.onMouseMove(e);
  }
  onMouseDown(e) {
    if (!this.sticker)
      return;
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
      this.initialWidth = this.sticker.width;
      this.initialHeight = this.sticker.height;
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
    super.calculateAnchor();
    super.dispatchEvent();
  }
  handleDraging(mouseX, mouseY) {
    if (!this.sticker)
      return;
    let newStickerX = mouseX - this.dragStartX;
    let newStickerY = mouseY - this.dragStartY;
    this.x = newStickerX;
    this.y = newStickerY;
  }
  getRotatedXY(x, y) {
    if (this.sticker) {
      const cosAngle = Math.cos(-this.sticker.rotation);
      const sinAngle = Math.sin(-this.sticker.rotation);
      const centerX = this.x + this.sticker.width / 2;
      const centerY = this.y + this.sticker.height / 2;
      const rotatedX = (x - centerX) * cosAngle - (y - centerY) * sinAngle + centerX;
      const rotatedY = (x - centerX) * sinAngle + (y - centerY) * cosAngle + centerY;
      return { rotatedX, rotatedY, centerX, centerY, cosAngle, sinAngle };
    }
    return { rotatedX: 0, rotatedY: 0, centerX: 0, centerY: 0, cosAngle: 0, sinAngle: 0 };
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
    return this.sticker && rotatedX >= this.x && rotatedX <= this.x + this.sticker.width && rotatedY >= this.y && rotatedY <= this.y + this.sticker.height;
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
    if (!this.sticker)
      return null;
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
      if (rotatedX >= handle.x - halfHandleSize && rotatedX <= handle.x + halfHandleSize && rotatedY >= handle.y - halfHandleSize && rotatedY <= handle.y + halfHandleSize && !this.isPointerInsideImage(x, y)) {
        return i;
      }
    }
    return null;
  }
  getResizePosition(x, y) {
    if (!this.sticker)
      return null;
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
      if (rotatedX >= handle.x - halfHandleSize && rotatedX <= handle.x + halfHandleSize && rotatedY >= handle.y - halfHandleSize && rotatedY <= handle.y + halfHandleSize) {
        return i;
      }
    }
    return null;
  }
  handleRotation(mouseX, mouseY) {
    if (this.sticker) {
      const centerX = this.x + this.sticker.width / 2;
      const centerY = this.y + this.sticker.height / 2;
      const rotation = Math.atan2(mouseY - centerY, mouseX - centerX);
      this.sticker.rotation = rotation;
    }
  }
  handleResize(mouseX, mouseY) {
    if (!this.sticker)
      return;
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
    this.sticker.width = newWidthFinal;
    this.sticker.height = newHeightFinal;
  }
  clickDrawImage() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.background) {
      this.ctx.drawImage(this.background.img, 0, 0, this.canvas.width, this.canvas.height);
    }
    if (this.sticker && this.image) {
      this.ctx.save();
      this.ctx.translate(this.x + this.sticker.width / 2, this.y + this.sticker.height / 2);
      this.ctx.rotate(this.sticker.rotation);
      this.ctx.drawImage(this.image, -this.sticker.width / 2, -this.sticker.height / 2, this.sticker.width, this.sticker.height);
      if (this.selectedImage) {
        this.drawHandles();
      }
      this.ctx.restore();
    }
  }
  drawHandles() {
    if (!this.sticker)
      return;
    const handleRotate = [
      { x: -this.sticker.width / 2 - this.rotateHandleSize + this.rotateHandleSize / 2, y: -this.sticker.height / 2 - this.rotateHandleSize + this.rotateHandleSize / 2 },
      { x: this.sticker.width / 2 - this.rotateHandleSize / 2, y: -this.sticker.height / 2 - this.rotateHandleSize / 2 },
      { x: -this.sticker.width / 2 - this.rotateHandleSize / 2, y: this.sticker.height / 2 - this.rotateHandleSize + this.rotateHandleSize / 2 },
      { x: this.sticker.width / 2 - this.rotateHandleSize / 2, y: this.sticker.height / 2 - this.rotateHandleSize / 2 }
    ];
    handleRotate.map((data, i) => {
      this.ctx.drawImage(this.rotateIcon[i], data.x, data.y, this.rotateHandleSize, this.rotateHandleSize);
    });
    this.ctx.fillStyle = this.handleColor;
    const handleResizeIcon = [
      { x: -this.sticker.width / 2, y: -this.sticker.height / 2 },
      { x: this.sticker.width / 2 - this.resizeHandleSize, y: -this.sticker.height / 2 },
      { x: -this.sticker.width / 2, y: this.sticker.height / 2 - this.resizeHandleSize },
      { x: this.sticker.width / 2 - this.resizeHandleSize, y: this.sticker.height / 2 - this.resizeHandleSize }
    ];
    handleResizeIcon.map((data, i) => {
      this.ctx.drawImage(i % 3 == 0 ? this.resizeIcon[0] : this.resizeIcon[1], data.x, data.y, this.resizeHandleSize, this.resizeHandleSize);
    });
  }
};
var Click_default = Click;

// src/lib/TouchGesture.ts
var TouchGesture = class extends Click_default {
  constructor(canvasId) {
    super(canvasId);
    this.lastTouches = [];
    this.animationFrame = null;
    this.isAnimating = false;
    this.boundOnTouchDown = this.onTouchStart.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchEnd.bind(this);
  }
  calculateScale(e) {
    if (!this.sticker)
      return;
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
      const newHeight = this.sticker.height - deltaDistance;
      const newWidth = newHeight * this.aspectRatio;
      const deltaX = (this.sticker.width - newWidth) / 2;
      const deltaY = (this.sticker.height - newHeight) / 2;
      this.sticker.width = newWidth;
      this.sticker.height = newHeight;
      this.x += deltaX;
      this.y += deltaY;
    }
  }
  calculateRotation(e) {
    if (this.sticker) {
      if (e.touches.length >= 2) {
        const initialAngle = Math.atan2(
          this.lastTouches[1].clientY - this.lastTouches[0].clientY,
          this.lastTouches[1].clientX - this.lastTouches[0].clientX
        );
        const currentAngle = Math.atan2(
          e.touches[1].clientY - e.touches[0].clientY,
          e.touches[1].clientX - e.touches[0].clientX
        );
        return this.sticker.rotation + (currentAngle - initialAngle);
      }
      return this.sticker.rotation;
    }
    return 0;
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
      if (this.sticker) {
        this.isAnimating = true;
        this.selectedImage = false;
        this.lastTouches = Array.from(e.touches);
        ;
        this.animate();
        this.sticker.rotation = this.calculateRotation(e);
        this.calculateScale(e);
      }
    } else if (e.touches.length === 1) {
      super.onMouseDown(e);
    }
  }
  onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length >= 2) {
      if (this.sticker) {
        this.sticker.rotation = this.calculateRotation(e);
        this.calculateScale(e);
        this.lastTouches = Array.from(e.touches);
      }
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
    super.calculateAnchor();
    super.dispatchEvent();
  }
};
var TouchGesture_default = TouchGesture;

// src/index.ts
var Watermark = class extends TouchGesture_default {
  constructor(canvasId) {
    super(canvasId);
  }
  setCanvasSize(width, height) {
    if (width > height) {
      this.orientation = "landscape";
    } else if (width < height) {
      this.orientation = "portrait";
    } else {
      this.orientation = "square";
    }
    this.canvas.width = width;
    this.canvas.height = height;
  }
  calculateFit() {
    let newWidth = 0;
    let newHeight = 0;
    if (this.sticker.width / this.canvas.width > this.sticker.height / this.canvas.height) {
      newWidth = this.canvas.width;
      newHeight = newWidth / this.aspectRatio;
    } else if (this.sticker.width / this.canvas.width < this.sticker.height / this.canvas.height) {
      newHeight = this.canvas.height;
      newWidth = newHeight * this.aspectRatio;
    } else {
      newWidth = this.canvas.width;
      newHeight = this.canvas.height;
    }
    this.sticker.width = newWidth;
    this.sticker.height = newHeight;
    this.x = 0;
    this.y = 0;
  }
  calculateFill() {
    const canvasAspectRatio = this.canvas.width / this.canvas.height;
    const stickerAspectRatio = this.sticker.width / this.sticker.height;
    let newWidth = 0;
    let newHeight = 0;
    if (canvasAspectRatio > stickerAspectRatio) {
      newWidth = this.canvas.width;
      newHeight = newWidth / stickerAspectRatio;
    } else if (canvasAspectRatio < stickerAspectRatio) {
      newHeight = this.canvas.height;
      newWidth = newHeight * stickerAspectRatio;
    } else {
      newWidth = this.canvas.width;
      newHeight = this.canvas.height;
    }
    this.sticker.width = newWidth;
    this.sticker.height = newHeight;
    this.x = this.canvas.width / 2 - this.sticker.width / 2;
    this.y = this.canvas.height / 2 - this.sticker.height / 2;
  }
  setSize(size) {
    if (this.sticker) {
      this.sticker.size = size;
      if (size === "Fit") {
        this.calculateFit();
        super.calculateAnchor();
      } else if (size === "Fill") {
        this.calculateFill();
        super.calculateAnchor();
      }
      super.dispatchEvent();
      super.drawImage();
    }
  }
  setStickerImage(sticker, width, height) {
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
    if (this.sticker.size === "Custom") {
      this.sticker.width = width;
      this.sticker.height = height;
      this.x = 0;
      this.y = 0;
    } else if (this.sticker.size === "Fit") {
      this.calculateFit();
    } else if (this.sticker.size === "Fill") {
      this.calculateFill();
    }
    super.dispatchEvent();
    this.drawImage();
  }
  setSticker(path) {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      this.image = img, this.image.width = img.width, this.image.height = img.height, this.sticker.link = path;
      this.sticker.width = img.width;
      this.sticker.height = img.height;
      this.setStickerImage(img, img.width, img.height);
    };
  }
  resizeOff() {
    window.removeEventListener("resize", this.onResizeScreen);
  }
  resizeOn() {
    window.addEventListener("resize", this.onResizeScreen);
  }
  listenerOff() {
    this.canvas.removeEventListener("mouseenter", this.boundOnMouseEnter);
    this.canvas.removeEventListener("mousedown", this.boundOnMouseDown);
    this.canvas.removeEventListener("mousemove", this.boundOnMouseMove);
    this.canvas.removeEventListener("mouseup", this.boundOnMouseUp);
    this.canvas.removeEventListener("touchstart", this.boundOnTouchDown);
    this.canvas.removeEventListener("touchmove", this.boundOnTouchMove);
    this.canvas.removeEventListener("touchend", this.boundOnTouchUp);
  }
  listenerOn() {
    this.canvas.addEventListener("mouseenter", this.boundOnMouseEnter);
    this.canvas.addEventListener("mousedown", this.boundOnMouseDown);
    this.canvas.addEventListener("mousemove", this.boundOnMouseMove);
    this.canvas.addEventListener("mouseup", this.boundOnMouseUp);
    this.canvas.addEventListener("touchstart", this.boundOnTouchDown);
    this.canvas.addEventListener("touchmove", this.boundOnTouchMove);
    this.canvas.addEventListener("touchend", this.boundOnTouchUp);
  }
  setStickerConfig(data) {
    this.sticker.anchor = data.anchor;
    this.sticker.height = data.height;
    this.sticker.width = data.height;
    this.sticker.rotation = data.rotation;
    this.sticker.size = data.size;
    this.sticker.x = data.x;
    this.sticker.y = data.y;
    if (data.link && data.link !== this.sticker.link) {
      this.sticker.link = data.link;
      const img = new Image();
      img.src = data.link;
      img.onload = () => {
        this.image = img;
        this.image.width = img.width;
        this.image.height = img.height;
        super.drawImage();
      };
    }
    super.calculateRelativeXY(data.anchor);
    super.drawImage();
  }
  save() {
    this.selectedImage = false;
    super.drawImage();
    const dataURL = this.canvas.toDataURL();
    return dataURL;
  }
  getStickerData() {
    return this.sticker;
  }
  getOrientation() {
    return this.orientation;
  }
};
var src_default = Watermark;
export {
  src_default as default
};
