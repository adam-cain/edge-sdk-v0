import { BoundingBox, Drawing, Point } from "../../types";
import { Shape } from ".";
export class Text implements Shape {
    private offscreenCanvas: HTMLCanvasElement | OffscreenCanvas;
    private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

    constructor() {
        // Create an offscreen canvas once and reuse it
        if (typeof OffscreenCanvas !== "undefined") {
            this.offscreenCanvas = new OffscreenCanvas(1, 1);
        } else {
            this.offscreenCanvas = document.createElement("canvas");
        }
        this.ctx = this.offscreenCanvas.getContext("2d")!;
    }
    getBoundingBox(drawing: Drawing): BoundingBox {
        if (drawing.properties.type !== "text") {
            throw Error("Expected Text Drawing");
        }

        const { position, text } = drawing.properties;

        // Set the font size based on strokeWidth
        const fontSize = drawing.strokeWidth * 4;
        this.ctx.font = `${fontSize}px Arial`;

        // Measure the text width
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize; // Approximate the text height using the font size

        // Calculate the bounding box
        const minX = position.x;
        const maxX = position.x + textWidth;
        const minY = position.y - textHeight;
        const maxY = position.y;

        // Construct and return the BoundingBox object
        return {
            min: {
                x: minX,
                y: minY
            },
            max: {
                x: maxX,
                y:maxY
            }
        }
    }

    collision(drawing: Drawing, coords: Point): boolean {
        if (drawing.properties.type !== "text") {
            throw Error("Expected Text Drawing");
        }

        const { position, text } = drawing.properties;

        // Set the font size based on strokeWidth
        const fontSize = drawing.strokeWidth * 4;
        this.ctx.font = `${fontSize}px Arial`;

        // Measure the text width
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize; // Approximate height using the font size

        // Calculate the bounding box of the text
        const minX = position.x;
        const maxX = position.x + textWidth;
        const minY = position.y - textHeight;
        const maxY = position.y;

        // Check if the point (coords) is within the bounding box
        const isInside =
            coords.x >= minX &&
            coords.x <= maxX &&
            coords.y >= minY &&
            coords.y <= maxY;

        return isInside;
    }

    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void {
        if (drawing.properties.type !== "text") {
            throw Error("Expected Text Drawing");
        }

        const { position, text } = drawing.properties;
        ctx.font = `${drawing.strokeWidth * 4}px Arial`;
        ctx.fillStyle = drawing.color;
        ctx.fillText(text, position.x, position.y);
    }
}
