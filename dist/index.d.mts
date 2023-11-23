interface Background {
    img: HTMLImageElement;
    width: number;
    height: number;
}
interface Sticker {
    link?: string;
    width: number;
    height: number;
    x: number;
    y: number;
    anchor: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right";
    size: "Custom" | "Fit" | "Fill";
    rotation: number;
}

declare class Canvas {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected image: HTMLImageElement | undefined;
    protected sticker: Sticker;
    protected initialSticker: Sticker;
    protected background: Background | null;
    protected aspectRatio: number;
    protected x: number;
    protected y: number;
    protected resizeHandleSize: number;
    protected rotateHandleSize: number;
    protected handleColor: string;
    protected selectedHandle: string | null;
    protected rotateIcon: HTMLImageElement[];
    protected resizeIcon: HTMLImageElement[];
    protected orientation: "landscape" | "portrait" | "square";
    protected cursor: Record<string, string>;
    protected onResizeScreen: EventListener;
    protected constructor(canvasId: string);
    protected calculateAnchor(anchor?: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right"): void;
    protected calculateRelativeXY(anchor?: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right"): void;
    setAnchorPoint(anchor: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right"): void;
    deepEqual(obj1: any, obj2: any): boolean;
    protected dispatchEvent(): void;
    private setIcon;
    protected setCursor(condition: string): void;
    private initializeCanvasSize;
    private handleResizeScreen;
    setBackgroundImage(path: string): void;
    protected drawImage(): void;
}

declare class Click extends Canvas {
    protected selectedImage: boolean;
    protected clicked: boolean;
    private dragStartX;
    private dragStartY;
    private isDragging;
    private isResizing;
    private isRotating;
    private isResizingTopLeft;
    private isResizingTopRight;
    private isResizingBottomLeft;
    private isResizingBottomRight;
    private resizeStartX;
    private resizeStartY;
    private rotateStartX;
    private rotateStartY;
    private initialWidth;
    private initialHeight;
    private initialDistance;
    private currentDistance;
    private endPoint;
    protected boundOnMouseEnter: EventListener;
    protected boundOnMouseDown: EventListener;
    protected boundOnMouseMove: EventListener;
    protected boundOnMouseUp: EventListener;
    constructor(canvasId: string);
    onMouseEnter(e: MouseEvent): void;
    onMouseDown(e: MouseEvent | TouchEvent): void;
    onMouseMove(e: MouseEvent | TouchEvent): void;
    onMouseUp(): void;
    handleDraging(mouseX: number, mouseY: number): void;
    getRotatedXY(x: number, y: number): {
        rotatedX: number;
        rotatedY: number;
        centerX: number;
        centerY: number;
        cosAngle: number;
        sinAngle: number;
    };
    handleAction(mouseX: number, mouseY: number): void;
    handleCursor(mouseX: number, mouseY: number): void;
    isPointerInsideImage(mouseX: number, mouseY: number): boolean;
    reset(): void;
    getRotatePosition(x: number, y: number): number | null;
    getResizePosition(x: number, y: number): number | null;
    handleRotation(mouseX: number, mouseY: number): void;
    handleResize(mouseX: number, mouseY: number): void;
    private clickDrawImage;
    private drawHandles;
}

declare class TouchGesture extends Click {
    private lastTouches;
    private animationFrame;
    private isAnimating;
    protected boundOnTouchDown: EventListener;
    protected boundOnTouchMove: EventListener;
    protected boundOnTouchUp: EventListener;
    constructor(canvasId: string);
    calculateScale(e: TouchEvent): void;
    calculateRotation(e: TouchEvent): number;
    private animate;
    private stopAnimate;
    private touchDrawImage;
    private onTouchStart;
    private onTouchMove;
    private onTouchEnd;
}

declare class Watermark extends TouchGesture {
    constructor(canvasId: string);
    setCanvasSize(width: number, height: number): void;
    calculateFit(): void;
    calculateFill(): void;
    setSize(size: "Custom" | "Fit" | "Fill"): void;
    private setStickerImage;
    setSticker(path: string): void;
    resizeOff(): void;
    resizeOn(): void;
    listenerOff(): void;
    listenerOn(): void;
    setStickerConfig(data: Sticker): void;
    save(): string;
    getStickerData(): Sticker;
    getOrientation(): "landscape" | "portrait" | "square";
}

export { Watermark as default };
