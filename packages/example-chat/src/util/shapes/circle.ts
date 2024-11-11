import { Drawing } from "../../types";
import { Shape } from "./types";

export class Circle implements Shape {
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
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.stroke;
        ctx.stroke();
    }
}
