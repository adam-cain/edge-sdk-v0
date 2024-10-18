import { Drawing } from "../../reducers/jam";
import { Shape } from "./types";

export class Line implements Shape {
    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void {
        if (drawing.properties.type !== "line") {
            throw Error("Expected Line Drawing")
        }
        const { properties } = drawing

        ctx.beginPath();
        
        const { x: startX, y: startY } = properties.startPoint;
        ctx.moveTo(startX, startY);
        
        const { x: endX, y: endY } = properties.endPoint;
        ctx.lineTo(endX, endY);

        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.stroke;
        ctx.stroke();
    }
}