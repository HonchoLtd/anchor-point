import Click from "@lib/Click";
class TouchGesture extends Click {
    private lastTouches: Touch[] = [];
    private animationFrame: number | null = null;
    private isAnimating: boolean = false;

    constructor() {
        super();

        this.canvas.addEventListener("touchstart", this.onTouchStart.bind(this));
        this.canvas.addEventListener("touchmove", this.onTouchMove.bind(this));
        this.canvas.addEventListener("touchend", this.onTouchEnd.bind(this));
    }

    calculateScale(e:TouchEvent): number {
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

    calculateRotation(e: TouchEvent): number {
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

    private animate(): void {
        if (!this.isAnimating) return;
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
        this.touchDrawImage();
    }

    private stopAnimate(): void {
        if(this.animationFrame)
            cancelAnimationFrame(this.animationFrame);
        this.isAnimating = false;
    }

    private touchDrawImage(): void {
        super.drawImage();
    }

    private onTouchStart(e: TouchEvent): void {
        e.preventDefault();

        if (e.touches.length >= 2) {
            this.isAnimating = true;
            this.selectedImage = false;
            this.lastTouches = Array.from(e.touches);;
            this.animate();
            this.angle = this.calculateRotation(e);
            this.scale = this.calculateScale(e);
        } else if (e.touches.length === 1) {
            super.onMouseDown(e);
        }
    }

    private onTouchMove(e: TouchEvent): void {
        e.preventDefault();
        if (e.touches.length >= 2) {
            this.angle = this.calculateRotation(e);
            this.scale = this.calculateScale(e);
            this.lastTouches = Array.from(e.touches);
        } else if (e.touches.length === 1) {
            super.onMouseMove(e);
        }
    }

    private onTouchEnd(): void {
        super.handleCursor(-1, -1);
        this.lastTouches = [];
        super.reset();
        this.clicked = false;
        this.selectedHandle = null;
        this.stopAnimate();
    }
}

export default TouchGesture;
