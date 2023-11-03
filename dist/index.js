"use strict";
function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
    } else {
        _get = function get(target, property, receiver) {
            var base = _super_prop_base(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver || target);
            }
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _super_prop_base(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _get_prototype_of(object);
        if (object === null) break;
    }
    return object;
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _is_native_reflect_construct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _create_super(Derived) {
    var hasNativeReflectConstruct = _is_native_reflect_construct();
    return function _createSuperInternal() {
        var Super = _get_prototype_of(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _get_prototype_of(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possible_constructor_return(this, result);
    };
}
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = function(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = function(to, from, except, desc) {
    if (from && typeof from === "object" || typeof from === "function") {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var key = _step.value;
                if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                    get: function() {
                        return from[key];
                    },
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                });
            };
            for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return to;
};
var __toCommonJS = function(mod) {
    return __copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
};
// src/index.ts
var src_exports = {};
__export(src_exports, {
    Watermark: function() {
        return Watermark_default;
    }
});
module.exports = __toCommonJS(src_exports);
// src/lib/Canvas.ts
var Canvas = /*#__PURE__*/ function() {
    function Canvas() {
        var _this = this;
        _class_call_check(this, Canvas);
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
        window.addEventListener("resize", function() {
            return _this.handleResizeScreen();
        });
    }
    _create_class(Canvas, [
        {
            key: "setRotateIcon",
            value: function setRotateIcon() {
                var _this = this;
                var rotateIcon = [
                    "./cursor/png/top-left-rotate.png",
                    "./cursor/png/top-right-rotate.png",
                    "./cursor/png/bottom-left-rotate.png",
                    "./cursor/png/bottom-right-rotate.png"
                ];
                var resizeIcon = [
                    "./cursor/png/ne-resize.png",
                    "./cursor/png/nw-resize.png"
                ];
                rotateIcon.map(function(ico) {
                    var icon = new Image();
                    icon.src = ico;
                    icon.onload = function() {
                        _this.rotateIcon.push(icon);
                    };
                });
                resizeIcon.map(function(ico) {
                    var icon = new Image();
                    icon.src = ico;
                    icon.onload = function() {
                        _this.resizeIcon.push(icon);
                    };
                });
            }
        },
        {
            key: "setCursor",
            value: function setCursor(condition) {
                this.canvas.style.cursor = "url(".concat(this.cursor[condition], "), auto");
            }
        },
        {
            key: "initializeCanvasSize",
            value: function initializeCanvasSize() {
                this.canvas.width = this.canvas.parentElement.clientWidth;
                this.canvas.height = this.canvas.parentElement.clientHeight;
            }
        },
        {
            key: "handleResizeScreen",
            value: function handleResizeScreen() {
                this.initializeCanvasSize();
                this.drawImage();
            }
        },
        {
            key: "setSticker",
            value: function setSticker(sticker, width, height) {
                var canvasWidth = this.canvas.width;
                var canvasHeight = this.canvas.height;
                var aspectRatio = sticker.width / sticker.height;
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
        },
        {
            key: "setImage",
            value: function setImage(path) {
                var _this = this;
                var img = new Image();
                img.src = path;
                img.onload = function() {
                    _this.image = img;
                    _this.image.width = img.width;
                    _this.image.height = img.height;
                    _this.setSticker(img, img.width, img.height);
                };
            }
        },
        {
            key: "drawImage",
            value: function drawImage() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.save();
                this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                this.ctx.rotate(this.angle);
                this.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
                this.ctx.restore();
            }
        }
    ]);
    return Canvas;
}();
var Canvas_default = Canvas;
// src/lib/Click.ts
var Click = /*#__PURE__*/ function(Canvas_default) {
    _inherits(Click, Canvas_default);
    var _super = _create_super(Click);
    function Click() {
        _class_call_check(this, Click);
        var _this;
        _this = _super.call(this);
        _this.selectedImage = false;
        _this.clicked = false;
        _this.dragStartX = 0;
        _this.dragStartY = 0;
        _this.isDragging = false;
        _this.isResizing = false;
        _this.isRotating = false;
        _this.isResizingTopLeft = false;
        _this.isResizingTopRight = false;
        _this.isResizingBottomLeft = false;
        _this.isResizingBottomRight = false;
        _this.resizeStartX = 0;
        _this.resizeStartY = 0;
        _this.rotateStartX = 0;
        _this.rotateStartY = 0;
        _this.initialWidth = 0;
        _this.initialHeight = 0;
        _this.initialDistance = 0;
        _this.currentDistance = 0;
        _this.endPoint = null;
        _this.selectedImage = false;
        _this.clicked = false;
        _this.dragStartX = 0;
        _this.dragStartY = 0;
        _this.isDragging = false;
        _this.isResizing = false;
        _this.isRotating = false;
        _this.isResizingTopLeft = false;
        _this.isResizingTopRight = false;
        _this.isResizingBottomLeft = false;
        _this.isResizingBottomRight = false;
        _this.resizeStartX = 0;
        _this.resizeStartY = 0;
        _this.rotateStartX = 0;
        _this.rotateStartY = 0;
        _this.initialWidth = 0;
        _this.initialHeight = 0;
        _this.boundOnMouseEnter = _this.onMouseEnter.bind(_assert_this_initialized(_this));
        _this.canvas.addEventListener("mouseenter", _this.boundOnMouseEnter);
        _this.canvas.addEventListener("mousedown", _this.onMouseDown.bind(_assert_this_initialized(_this)));
        _this.canvas.addEventListener("mousemove", _this.onMouseMove.bind(_assert_this_initialized(_this)));
        _this.canvas.addEventListener("mouseup", _this.onMouseUp.bind(_assert_this_initialized(_this)));
        return _this;
    }
    _create_class(Click, [
        {
            key: "onMouseEnter",
            value: function onMouseEnter(e) {
                this.onMouseMove(e);
            }
        },
        {
            key: "onMouseDown",
            value: function onMouseDown(e) {
                this.clicked = true;
                var clientX = 0, clientY = 0;
                if (_instanceof(e, MouseEvent)) {
                    clientX = e.clientX;
                    clientY = e.clientY;
                } else if (_instanceof(e, TouchEvent)) {
                    if (e.touches.length > 0) {
                        clientX = e.touches[0].clientX;
                        clientY = e.touches[0].clientY;
                    } else {
                        return;
                    }
                }
                var _this_canvas_getBoundingClientRect = this.canvas.getBoundingClientRect(), left = _this_canvas_getBoundingClientRect.left, top = _this_canvas_getBoundingClientRect.top;
                var mouseX = clientX - left;
                var mouseY = clientY - top;
                this.handleAction(mouseX, mouseY);
                this.handleCursor(mouseX, mouseY);
                var _this_getRotatedXY = this.getRotatedXY(mouseX, mouseY), rotatedX = _this_getRotatedXY.rotatedX, rotatedY = _this_getRotatedXY.rotatedY;
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
        },
        {
            key: "onMouseMove",
            value: function onMouseMove(e) {
                var clientX = 0, clientY = 0;
                if (_instanceof(e, MouseEvent)) {
                    clientX = e.clientX;
                    clientY = e.clientY;
                } else if (_instanceof(e, TouchEvent)) {
                    if (e.touches.length > 0) {
                        clientX = e.touches[0].clientX;
                        clientY = e.touches[0].clientY;
                    } else {
                        return;
                    }
                }
                var _this_canvas_getBoundingClientRect = this.canvas.getBoundingClientRect(), left = _this_canvas_getBoundingClientRect.left, top = _this_canvas_getBoundingClientRect.top;
                var mouseX = clientX - left;
                var mouseY = clientY - top;
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
        },
        {
            key: "onMouseUp",
            value: function onMouseUp() {
                this.reset();
                this.selectedHandle = null;
            }
        },
        {
            key: "handleDraging",
            value: function handleDraging(mouseX, mouseY) {
                var newStickerX = mouseX - this.dragStartX;
                var newStickerY = mouseY - this.dragStartY;
                newStickerX = Math.max(0, newStickerX);
                newStickerY = Math.max(0, newStickerY);
                newStickerX = Math.min(this.canvas.width - this.width, newStickerX);
                newStickerY = Math.min(this.canvas.height - this.height, newStickerY);
                this.x = newStickerX;
                this.y = newStickerY;
            }
        },
        {
            key: "getRotatedXY",
            value: function getRotatedXY(x, y) {
                var cosAngle = Math.cos(-this.angle);
                var sinAngle = Math.sin(-this.angle);
                var centerX = this.x + this.width / 2;
                var centerY = this.y + this.height / 2;
                var rotatedX = (x - centerX) * cosAngle - (y - centerY) * sinAngle + centerX;
                var rotatedY = (x - centerX) * sinAngle + (y - centerY) * cosAngle + centerY;
                return {
                    rotatedX: rotatedX,
                    rotatedY: rotatedY,
                    centerX: centerX,
                    centerY: centerY,
                    cosAngle: cosAngle,
                    sinAngle: sinAngle
                };
            }
        },
        {
            key: "handleAction",
            value: function handleAction(mouseX, mouseY) {
                var isInsideImage = this.isPointerInsideImage(mouseX, mouseY);
                var indexRotate = this.getRotatePosition(mouseX, mouseY);
                var index = this.getResizePosition(mouseX, mouseY);
                if (isInsideImage) {
                    this.selectedImage = true;
                    this.clicked = true;
                    if (index !== null) {
                        this.isResizing = true;
                        switch(index){
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
        },
        {
            key: "handleCursor",
            value: function handleCursor(mouseX, mouseY) {
                var isInsideImage = this.isPointerInsideImage(mouseX, mouseY);
                var indexRotate = this.getRotatePosition(mouseX, mouseY);
                var index = this.getResizePosition(mouseX, mouseY);
                var cursor = [
                    "nwSize",
                    "neSize",
                    "neSize",
                    "nwSize"
                ];
                if (isInsideImage) {
                    if (index !== null) {
                        _get(_get_prototype_of(Click.prototype), "setCursor", this).call(this, cursor[index]);
                    } else {
                        _get(_get_prototype_of(Click.prototype), "setCursor", this).call(this, "move");
                    }
                } else if (!isInsideImage && indexRotate !== null) {
                    _get(_get_prototype_of(Click.prototype), "setCursor", this).call(this, "rotate");
                } else {
                    this.canvas.style.cursor = "url(".concat(this.cursor.default, "), auto");
                }
            }
        },
        {
            key: "isPointerInsideImage",
            value: function isPointerInsideImage(mouseX, mouseY) {
                var _this_getRotatedXY = this.getRotatedXY(mouseX, mouseY), rotatedX = _this_getRotatedXY.rotatedX, rotatedY = _this_getRotatedXY.rotatedY;
                return rotatedX >= this.x && rotatedX <= this.x + this.width && rotatedY >= this.y && rotatedY <= this.y + this.height;
            }
        },
        {
            key: "reset",
            value: function reset() {
                this.isDragging = false;
                this.isResizing = false;
                this.isRotating = false;
                this.isResizingTopLeft = false;
                this.isResizingTopRight = false;
                this.isResizingBottomLeft = false;
                this.isResizingBottomRight = false;
            }
        },
        {
            key: "getRotatePosition",
            value: function getRotatePosition(x, y) {
                var halfHandleSize = this.rotateHandleSize / 2;
                var _this_getRotatedXY = this.getRotatedXY(x, y), rotatedX = _this_getRotatedXY.rotatedX, rotatedY = _this_getRotatedXY.rotatedY, centerX = _this_getRotatedXY.centerX, centerY = _this_getRotatedXY.centerY;
                var rotatedHandles = [
                    {
                        x: centerX - this.width / 2,
                        y: centerY - this.height / 2
                    },
                    {
                        x: centerX + this.width / 2,
                        y: centerY - this.height / 2
                    },
                    {
                        x: centerX - this.width / 2,
                        y: centerY + this.height / 2
                    },
                    {
                        x: centerX + this.width / 2,
                        y: centerY + this.height / 2
                    }
                ];
                for(var i = 0; i < rotatedHandles.length; i++){
                    var handle = rotatedHandles[i];
                    if (rotatedX >= handle.x - halfHandleSize && rotatedX <= handle.x + halfHandleSize && rotatedY >= handle.y - halfHandleSize && rotatedY <= handle.y + halfHandleSize && !this.isPointerInsideImage(x, y)) {
                        return i;
                    }
                }
                return null;
            }
        },
        {
            key: "getResizePosition",
            value: function getResizePosition(x, y) {
                var halfHandleSize = this.resizeHandleSize;
                var _this_getRotatedXY = this.getRotatedXY(x, y), rotatedX = _this_getRotatedXY.rotatedX, rotatedY = _this_getRotatedXY.rotatedY, centerX = _this_getRotatedXY.centerX, centerY = _this_getRotatedXY.centerY;
                var rotatedHandles = [
                    {
                        x: centerX - this.width / 2,
                        y: centerY - this.height / 2
                    },
                    {
                        x: centerX + this.width / 2,
                        y: centerY - this.height / 2
                    },
                    {
                        x: centerX - this.width / 2,
                        y: centerY + this.height / 2
                    },
                    {
                        x: centerX + this.width / 2,
                        y: centerY + this.height / 2
                    }
                ];
                for(var i = 0; i < rotatedHandles.length; i++){
                    var handle = rotatedHandles[i];
                    if (rotatedX >= handle.x - halfHandleSize && rotatedX <= handle.x + halfHandleSize && rotatedY >= handle.y - halfHandleSize && rotatedY <= handle.y + halfHandleSize) {
                        return i;
                    }
                }
                return null;
            }
        },
        {
            key: "handleRotation",
            value: function handleRotation(mouseX, mouseY) {
                var centerX = this.x + this.width / 2;
                var centerY = this.y + this.height / 2;
                var angle = Math.atan2(mouseY - centerY, mouseX - centerX);
                this.angle = angle;
            }
        },
        {
            key: "handleResize",
            value: function handleResize(mouseX, mouseY) {
                var delta = this.getRotatedXY(mouseX, mouseY);
                var deltaX = delta.rotatedX - this.resizeStartX;
                var deltaY = delta.rotatedY - this.resizeStartY;
                var newWidth = 0;
                var newHeight = 0;
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
                var minSize = 100;
                var newWidthConstrained = Math.max(minSize, newWidth);
                var newHeightConstrained = Math.max(minSize, newHeight);
                var maxWidth = this.canvas.width - this.x;
                var maxHeight = this.canvas.height - this.y;
                var newWidthFinal = Math.min(newWidthConstrained, maxWidth);
                var newHeightFinal = Math.min(newHeightConstrained, maxHeight);
                if (newWidthFinal > newHeightFinal * this.aspectRatio) {
                    newWidthFinal = newHeightFinal * this.aspectRatio;
                } else if (newHeightFinal > newWidthFinal / this.aspectRatio) {
                    newHeightFinal = newWidthFinal / this.aspectRatio;
                }
                this.width = newWidthFinal;
                this.height = newHeightFinal;
            }
        },
        {
            key: "clickDrawImage",
            value: function clickDrawImage() {
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
        },
        {
            key: "drawHandles",
            value: function drawHandles() {
                var _this = this;
                var handleRotate = [
                    {
                        x: -this.width / 2 - this.rotateHandleSize + this.rotateHandleSize / 2,
                        y: -this.height / 2 - this.rotateHandleSize + this.rotateHandleSize / 2
                    },
                    {
                        x: this.width / 2 - this.rotateHandleSize / 2,
                        y: -this.height / 2 - this.rotateHandleSize / 2
                    },
                    {
                        x: -this.width / 2 - this.rotateHandleSize / 2,
                        y: this.height / 2 - this.rotateHandleSize + this.rotateHandleSize / 2
                    },
                    {
                        x: this.width / 2 - this.rotateHandleSize / 2,
                        y: this.height / 2 - this.rotateHandleSize / 2
                    }
                ];
                handleRotate.map(function(data, i) {
                    _this.ctx.drawImage(_this.rotateIcon[i], data.x, data.y, _this.rotateHandleSize, _this.rotateHandleSize);
                });
                this.ctx.fillStyle = this.handleColor;
                var handleResizeIcon = [
                    {
                        x: -this.width / 2,
                        y: -this.height / 2
                    },
                    {
                        x: this.width / 2 - this.resizeHandleSize,
                        y: -this.height / 2
                    },
                    {
                        x: -this.width / 2,
                        y: this.height / 2 - this.resizeHandleSize
                    },
                    {
                        x: this.width / 2 - this.resizeHandleSize,
                        y: this.height / 2 - this.resizeHandleSize
                    }
                ];
                handleResizeIcon.map(function(data, i) {
                    _this.ctx.drawImage(i % 3 == 0 ? _this.resizeIcon[0] : _this.resizeIcon[1], data.x, data.y, _this.resizeHandleSize, _this.resizeHandleSize);
                });
            }
        }
    ]);
    return Click;
}(Canvas_default);
var Click_default = Click;
// src/lib/TouchGesture.ts
var TouchGesture = /*#__PURE__*/ function(Click_default) {
    _inherits(TouchGesture, Click_default);
    var _super = _create_super(TouchGesture);
    function TouchGesture() {
        _class_call_check(this, TouchGesture);
        var _this;
        _this = _super.call(this);
        _this.lastTouches = [];
        _this.animationFrame = null;
        _this.isAnimating = false;
        _this.canvas.addEventListener("touchstart", _this.onTouchStart.bind(_assert_this_initialized(_this)));
        _this.canvas.addEventListener("touchmove", _this.onTouchMove.bind(_assert_this_initialized(_this)));
        _this.canvas.addEventListener("touchend", _this.onTouchEnd.bind(_assert_this_initialized(_this)));
        return _this;
    }
    _create_class(TouchGesture, [
        {
            key: "calculateScale",
            value: function calculateScale(e) {
                if (e.touches.length >= 2) {
                    var initialDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                    var currentDistance = Math.hypot(this.lastTouches[0].clientX - this.lastTouches[1].clientX, this.lastTouches[0].clientY - this.lastTouches[1].clientY);
                    var deltaDistance = currentDistance - initialDistance;
                    var newHeight = this.height - deltaDistance;
                    var newWidth = newHeight * this.aspectRatio;
                    var deltaX = (this.width - newWidth) / 2;
                    var deltaY = (this.height - newHeight) / 2;
                    this.width = newWidth;
                    this.height = newHeight;
                    this.x += deltaX;
                    this.y += deltaY;
                    return deltaDistance;
                }
                return 1;
            }
        },
        {
            key: "calculateRotation",
            value: function calculateRotation(e) {
                if (e.touches.length >= 2) {
                    var initialAngle = Math.atan2(this.lastTouches[1].clientY - this.lastTouches[0].clientY, this.lastTouches[1].clientX - this.lastTouches[0].clientX);
                    var currentAngle = Math.atan2(e.touches[1].clientY - e.touches[0].clientY, e.touches[1].clientX - e.touches[0].clientX);
                    return this.angle + (currentAngle - initialAngle);
                }
                return this.angle;
            }
        },
        {
            key: "animate",
            value: function animate() {
                if (!this.isAnimating) return;
                this.animationFrame = requestAnimationFrame(this.animate.bind(this));
                this.touchDrawImage();
            }
        },
        {
            key: "stopAnimate",
            value: function stopAnimate() {
                if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
                this.isAnimating = false;
            }
        },
        {
            key: "touchDrawImage",
            value: function touchDrawImage() {
                _get(_get_prototype_of(TouchGesture.prototype), "drawImage", this).call(this);
            }
        },
        {
            key: "onTouchStart",
            value: function onTouchStart(e) {
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
                    _get(_get_prototype_of(TouchGesture.prototype), "onMouseDown", this).call(this, e);
                }
            }
        },
        {
            key: "onTouchMove",
            value: function onTouchMove(e) {
                e.preventDefault();
                if (e.touches.length >= 2) {
                    this.angle = this.calculateRotation(e);
                    this.scale = this.calculateScale(e);
                    this.lastTouches = Array.from(e.touches);
                } else if (e.touches.length === 1) {
                    _get(_get_prototype_of(TouchGesture.prototype), "onMouseMove", this).call(this, e);
                }
            }
        },
        {
            key: "onTouchEnd",
            value: function onTouchEnd() {
                _get(_get_prototype_of(TouchGesture.prototype), "handleCursor", this).call(this, -1, -1);
                this.lastTouches = [];
                _get(_get_prototype_of(TouchGesture.prototype), "reset", this).call(this);
                this.clicked = false;
                this.selectedHandle = null;
                this.stopAnimate();
            }
        }
    ]);
    return TouchGesture;
}(Click_default);
var TouchGesture_default = TouchGesture;
// src/core/Watermark.ts
var Watermark = /*#__PURE__*/ function(TouchGesture_default) {
    _inherits(Watermark, TouchGesture_default);
    var _super = _create_super(Watermark);
    function Watermark() {
        _class_call_check(this, Watermark);
        return _super.call(this);
    }
    return Watermark;
}(TouchGesture_default);
var Watermark_default = Watermark;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    Watermark: Watermark
});
