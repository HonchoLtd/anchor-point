declare class Canvas {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected image: HTMLImageElement;
    protected aspectRatio: number;
    protected angle: number;
    protected scale: number;
    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;
    protected resizeHandleSize: number;
    protected rotateHandleSize: number;
    protected handleColor: string;
    protected selectedHandle: string | null;
    protected rotateIcon: HTMLImageElement[];
    protected resizeIcon: HTMLImageElement[];
    protected cursor: Record<string, string>;
    protected constructor();
    private setRotateIcon;
    protected setCursor(condition: string): void;
    private initializeCanvasSize;
    private handleResizeScreen;
    private setSticker;
    setImage(path: string): void;
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
    private boundOnMouseEnter;
    constructor();
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
    clickDrawImage(): void;
    drawHandles(): void;
}

declare class TouchGesture extends Click {
    private lastTouches;
    private animationFrame;
    private isAnimating;
    constructor();
    calculateScale(e: TouchEvent): number;
    calculateRotation(e: TouchEvent): number;
    private animate;
    private stopAnimate;
    private touchDrawImage;
    private onTouchStart;
    private onTouchMove;
    private onTouchEnd;
}

declare class Watermark extends TouchGesture {
    constructor();
}

export { Watermark };
