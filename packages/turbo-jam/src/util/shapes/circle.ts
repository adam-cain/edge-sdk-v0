import { BoundingBox, Drawing, Point } from "../../types";
import {ResizeDirection, directionVectors}from "../../types/enums"
import { Shape } from ".";

export class Circle implements Shape {
    resize(drawing: Drawing, direction: ResizeDirection, delta: Point): Drawing {
        if (drawing.properties.type !== "circle") {
            throw Error("Expected Circle Drawing");
        }
    
        const { startPoint, endPoint } = drawing.properties;
    
        if (!startPoint || !endPoint) {
            throw new Error("Required Points Missing");
        }
    
        // Get the direction vector based on the resize direction
        const dirVector = directionVectors[direction];
    
        // Normalize the direction vector
        const dirLength = Math.hypot(dirVector.x, dirVector.y);
        const ux = dirVector.x / dirLength;
        const uy = dirVector.y / dirLength;
        
        // Project the delta onto the direction vector
        const deltaLength = (delta.x * ux + delta.y * uy) / 2;

        // Compute the vector from center to endPoint
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
    
        // Current radius
        const currentRadius = Math.hypot(dx, dy);
    
        // Adjust the radius
        let newRadius = (currentRadius + deltaLength);
    
        // Ensure the radius is positive
        newRadius = Math.max(newRadius, 1);
    
        // Compute the angle of the current endPoint relative to the center
        const angle = Math.atan2(dy, dx);
    
        // Calculate the new endPoint
        drawing.properties.endPoint = {
            x: startPoint.x + newRadius * Math.cos(angle),
            y: startPoint.y + newRadius * Math.sin(angle),
        };
    
        return drawing;
    }

    getBoundingBox(drawing: Drawing): BoundingBox {
        if (drawing.properties.type !== "circle") {
            throw Error("Expected Circle Drawing");
        }

        const { startPoint, endPoint } = drawing.properties;

        if (!startPoint || !endPoint) {
            throw new Error("Required Points Missing");
        }

        // The center of the circle is the startPoint
        const centerX = startPoint.x;
        const centerY = startPoint.y;

        // The radius is the distance from the startPoint (center) to the endPoint
        const radius = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
        );

        // Calculate the bounding box
        const minX = centerX - radius
        const maxX = centerX + radius
        const minY = centerY - radius
        const maxY = centerY + radius

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
        if (drawing.properties.type !== "circle") {
            throw Error("Expected Circle Drawing");
        }

        const { startPoint, endPoint } = drawing.properties;

        if (!startPoint || !endPoint) {
            throw new Error("Required Points Missing");
        }

        // The center of the circle is the startPoint
        const centerX = startPoint.x;
        const centerY = startPoint.y;

        // The radius is the distance from the startPoint (center) to the endPoint
        const radius = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
        );

        // Calculate the distance from the point (coords) to the center of the circle
        const distance = Math.sqrt(
            Math.pow(coords.x - centerX, 2) + Math.pow(coords.y - centerY, 2)
        );

        // Check if the distance is less than or equal to the radius
        return distance <= radius;
    }

    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void {
        if (drawing.properties.type !== "circle") {
            throw Error("Expected Circle Drawing");
        }

        const { startPoint, endPoint } = drawing.properties;

        if (!startPoint || !endPoint) {
            throw new Error("Required Points Missing");
        }

        // The center of the circle is the startPoint
        const centerX = startPoint.x;
        const centerY = startPoint.y;

        // The radius is the distance from the startPoint (center) to the endPoint
        const radius = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
        );

        // Draw the circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = drawing.strokeColor;
        ctx.lineWidth = drawing.strokeWidth;
        ctx.fillStyle = drawing.color;
        ctx.fill();
        ctx.stroke();
    }
}
