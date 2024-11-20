import { BoundingBox, Drawing, Point } from "../../types";
import {directionVectors, ResizeDirection}from "../../types/enums"
import { Shape } from ".";
export class Rectangle implements Shape {
    resize(drawing: Drawing, direction: ResizeDirection, delta: Point): Drawing {
        if (drawing.properties.type !== "rectangle") {
            throw Error("Expected Rectangle Drawing");
        }
    
        const { startPoint, endPoint } = drawing.properties;
    
        if (!startPoint || !endPoint) {
            throw new Error("StartPoint and EndPoint are required for resizing");
        }
    
        // Scale the delta
        const deltaX = delta.x / 2;
        const deltaY = delta.y / 2;
    
        let minX = Math.min(startPoint.x, endPoint.x);
        let maxX = Math.max(startPoint.x, endPoint.x);
        let minY = Math.min(startPoint.y, endPoint.y);
        let maxY = Math.max(startPoint.y, endPoint.y);
    
        const minWidth = 10; // Minimum allowed width
        const minHeight = 10; // Minimum allowed height
    
        const vector = directionVectors[direction];
        if (!vector) {
            throw new Error("Invalid resize direction");
        }
    
        // Adjust bounds based on direction vector
        if (vector.x < 0 && maxX - (minX + deltaX) >= minWidth) {
            minX += deltaX; // Adjust left edge
        }
        if (vector.x > 0 && (maxX + deltaX) - minX >= minWidth) {
            maxX += deltaX; // Adjust right edge
        }
        if (vector.y < 0 && maxY - (minY + deltaY) >= minHeight) {
            minY += deltaY; // Adjust top edge
        }
        if (vector.y > 0 && (maxY + deltaY) - minY >= minHeight) {
            maxY += deltaY; // Adjust bottom edge
        }
    
        const newStartPoint: Point = { x: minX, y: minY };
        const newEndPoint: Point = { x: maxX, y: maxY };
    
        drawing.properties.startPoint = newStartPoint;
        drawing.properties.endPoint = newEndPoint;
    
        return drawing;
    }
    
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
                y: maxY
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
