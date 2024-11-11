import { Drawing } from "../../types";
import { Shape } from "./types";

export class Text implements Shape {
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
