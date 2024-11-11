import { Drawing } from "../../types";
import { Shape } from "./types";

export class FreeHand implements Shape {
    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void {
        if (drawing.properties.type !== "freehand") {
            throw Error("Expected Freehand Drawing")
        }
        const { properties } = drawing

        ctx.beginPath();
        properties.points.forEach((point, index) => {
            const canvasX = point.x;
            const canvasY = point.y;
            if (index === 0) {
                ctx.moveTo(canvasX, canvasY);
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        });
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.strokeWidth;
        ctx.stroke();
    }
}