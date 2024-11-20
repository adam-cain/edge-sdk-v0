import { BoundingBox, Drawing, Point } from "../../types";
import {directionVectors, ResizeDirection}from "../../types/enums"
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
    resize(drawing: Drawing, direction: ResizeDirection, delta: Point): Drawing {
        if (drawing.properties.type !== "text") {
            throw Error("Expected Text Drawing");
        }
    
        const { position, text } = drawing.properties;
    
        // Clone position to avoid mutating the original drawing
        const newPosition: Point = { ...position };
    
        // Get the current font size
        let fontSize = drawing.strokeWidth * 4;
    
        // Measure the current text dimensions
        this.ctx.font = `${fontSize}px Arial`;
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize; // Approximate the text height using the font size
    
        // Calculate the original bounding box
        let minX = position.x;
        let maxX = position.x + textWidth;
        let minY = position.y - textHeight;
        let maxY = position.y;
    
        const vector = directionVectors[direction];
        if (!vector) {
            throw new Error("Invalid resize direction");
        }
    
        // Adjust the bounding box based on the direction vector and delta
        if (vector.x < 0) {
            minX += delta.x;
        }
        if (vector.x > 0) {
            maxX += delta.x;
        }
        if (vector.y < 0) {
            minY += delta.y;
        }
        if (vector.y > 0) {
            maxY += delta.y;
        }
    
        // Enforce minimum width and height
        const minWidth = 20; // Minimum allowed width
        const minHeight = 10; // Minimum allowed height
    
        // Ensure the width is not less than minWidth
        if (maxX - minX < minWidth) {
            if (vector.x < 0) {
                minX = maxX - minWidth;
            } else if (vector.x > 0) {
                maxX = minX + minWidth;
            }
        }
    
        // Ensure the height is not less than minHeight
        if (maxY - minY < minHeight) {
            if (vector.y < 0) {
                minY = maxY - minHeight;
            } else if (vector.y > 0) {
                maxY = minY + minHeight;
            }
        }
    
        // Compute scaling factors
        const originalWidth = textWidth;
        const originalHeight = textHeight;
        const newWidth = maxX - minX;
        const newHeight = maxY - minY;
    
        // Use the smaller scaling factor to maintain aspect ratio
        const scaleX = newWidth / originalWidth;
        const scaleY = newHeight / originalHeight;
        let scale = Math.min(scaleX, scaleY);
    
        // Update font size
        fontSize = fontSize * scale;
    
        // Update strokeWidth
        let newStrokeWidth = fontSize / 4;
    
        // Adjust position based on scaling origin
        if (vector.x !== 0 && vector.y !== 0) {
            // Corner handles
            if (vector.x < 0) {
                // Resizing from the left
                newPosition.x = maxX - (textWidth * scale);
            }
            if (vector.y < 0) {
                // Resizing from the top
                newPosition.y = maxY;
            }
            if (vector.x > 0) {
                // Resizing from the right
                newPosition.x = minX;
            }
            if (vector.y > 0) {
                // Resizing from the bottom
                newPosition.y = minY + (textHeight * scale);
            }
        } else {
            // Side handles: adjust scaling to maintain aspect ratio and fix opposite side
            if (vector.x !== 0) {
                // Horizontal resize (left or right handle)
                scale = scaleX;
    
                fontSize = drawing.strokeWidth * 4 * scale;
                newStrokeWidth = fontSize / 4;
    
                if (vector.x < 0) {
                    // Resizing from the left
                    newPosition.x = maxX - (textWidth * scale);
                } else {
                    // Resizing from the right
                    newPosition.x = minX;
                }
    
                // Adjust position.y to keep vertical position consistent
                newPosition.y = position.y;
            }
    
            if (vector.y !== 0) {
                // Vertical resize (top or bottom handle)
                scale = scaleY;
    
                fontSize = drawing.strokeWidth * 4 * scale;
                newStrokeWidth = fontSize / 4;
    
                if (vector.y < 0) {
                    // Resizing from the top
                    newPosition.y = maxY;
                } else {
                    // Resizing from the bottom
                    newPosition.y = minY + (textHeight * scale);
                }
    
                // Adjust position.x to keep horizontal position consistent
                newPosition.x = position.x;
            }
        }
    
        // Return the updated drawing
        return {
            ...drawing,
            strokeWidth: newStrokeWidth,
            properties: {
                ...drawing.properties,
                position: newPosition,
            }
        };
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
                y: maxY
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
