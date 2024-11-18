import { BoundingBox, Drawing, Point } from "../../types";
import { Shape } from ".";
export class Rectangle implements Shape {
    getBoundingBox(drawing: Drawing): BoundingBox {
        if (drawing.properties.type !== "rectangle") {
            throw Error("Expected Rectangle Drawing");
        }

        const { startPoint, endPoint } = drawing.properties;

        if (!startPoint || !endPoint) {
            throw new Error("StartPoint and EndPoint are required for bounding box calculation");
        }

        // Calculate the boundaries of the rectangle
        const minX = Math.min(startPoint.x, endPoint.x);
        const maxX = Math.max(startPoint.x, endPoint.x);
        const minY = Math.min(startPoint.y, endPoint.y);
        const maxY = Math.max(startPoint.y, endPoint.y);

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
        if (drawing.properties.type !== "rectangle") {
            throw Error("Expected Rectangle Drawing");
        }

        const { startPoint, endPoint } = drawing.properties;

        if (!startPoint || !endPoint) {
            throw new Error("StartPoint and EndPoint are required for collision detection");
        }

        // Calculate the boundaries of the rectangle
        const minX = Math.min(startPoint.x, endPoint.x);
        const maxX = Math.max(startPoint.x, endPoint.x);
        const minY = Math.min(startPoint.y, endPoint.y);
        const maxY = Math.max(startPoint.y, endPoint.y);

        // Check if the point (coords) is within these boundaries
        const isInside =
            coords.x >= minX &&
            coords.x <= maxX &&
            coords.y >= minY &&
            coords.y <= maxY;

        return isInside;
    }

    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void {
        if (drawing.properties.type !== "rectangle") {
            throw Error("Expected Rectangle Drawing");
        }

        const { startPoint, endPoint } = drawing.properties;

        if (!startPoint || !endPoint) {
            throw new Error("StartPoint and EndPoint are required for drawing a rectangle");
        }

        // Calculate the width and height based on the startPoint and endPoint
        const width = endPoint.x - startPoint.x;
        const height = endPoint.y - startPoint.y;

        // Draw the rectangle
        ctx.beginPath();
        ctx.rect(startPoint.x, startPoint.y, width, height);
        ctx.fillStyle = drawing.color;  // Set the fill color
        ctx.fill();                     // Fill the rectangle
        ctx.strokeStyle = drawing.strokeColor;
        ctx.lineWidth = drawing.strokeWidth;
        ctx.stroke();                   // Outline the rectangle
    }
}
