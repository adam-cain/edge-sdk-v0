import { BoundingBox, Drawing, Point } from "../../types";
import { Shape } from ".";
export class Circle implements Shape {
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
        const minX =  centerX - radius
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
                y:maxY
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
