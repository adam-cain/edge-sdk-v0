import { Drawing } from "../../types";
import { Shape } from "./types";

export class Rectangle implements Shape {
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
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.stroke;
        ctx.stroke();
    }
}
