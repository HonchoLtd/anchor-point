class Canvas {
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
    protected resizeHandleSize: number = 40;
    protected rotateHandleSize: number = 80;
    protected handleColor: string = 'blue';
    protected selectedHandle: string | null = null;
    protected rotateIcon: HTMLImageElement[] = [];
    protected resizeIcon: HTMLImageElement[] = [];
    protected cursor: Record<string, string> = {
        pointer: "./cursor/Hand.cur",
        default: "./cursor/Arrow.cur",
        neSize: "./cursor/SizeNESW.cur",
        nwSize: "./cursor/SizeNWSE.cur",
        rotate: "./cursor/Rotate.cur",
        move: "./cursor/Cross.cur",
    };

    protected constructor() {
        this.canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
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
        this.handleColor = 'blue';
        this.selectedHandle = null;
        this.rotateIcon = [];
        this.resizeIcon = [];
        this.setCursor('default');
        this.setRotateIcon();

        // Set the canvas dimensions based on the parent container size
        this.initializeCanvasSize();
        window.addEventListener('resize', () => this.handleResizeScreen());
    }

    private setRotateIcon() {
        const rotateIcon = [
            "./cursor/png/top-left-rotate.png",
            "./cursor/png/top-right-rotate.png",
            "./cursor/png/bottom-left-rotate.png",
            "./cursor/png/bottom-right-rotate.png",
        ];
        const resizeIcon = [
            "./cursor/png/ne-resize.png",
            "./cursor/png/nw-resize.png",
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

    protected setCursor(condition: string) {
        this.canvas.style.cursor = `url(${this.cursor[condition]}), auto`;
    }

    private initializeCanvasSize() {
        this.canvas.width = this.canvas.parentElement!.clientWidth;
        this.canvas.height = this.canvas.parentElement!.clientHeight;
    }

    private handleResizeScreen() {
        // When the window is resized, update the canvas size and redraw the image
        this.initializeCanvasSize();
        this.drawImage();
    }

    private setSticker(sticker: HTMLImageElement, width: number, height: number) {
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

        // Center the sticker on the canvas
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
        this.drawImage();
    }

    public setImage(path: string) {
        // Load the image
        const img = new Image();
        img.src = path;

        img.onload = () => {
            this.image = img;
            this.image.width = img.width;
            this.image.height = img.height;
            this.setSticker(img, img.width, img.height);
        };
    }

    protected drawImage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.ctx.rotate(this.angle);
        this.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        this.ctx.restore();
    }
}
export default Canvas;
