import { Drawing } from "../types";
import { Circle, FreeHand, Line, Rectangle, Text } from "./shapes";
import { Shape } from "./shapes/types";

export function renderDrawing(drawing: Drawing, ctx: CanvasRenderingContext2D) {
    let shape: Shape
    switch (drawing.properties.type) {
        case "freehand":
            shape = new FreeHand()
            break;
        case "line":
            shape = new Line()
            break;
        case "circle":
            shape = new Circle()
            break;
        case "rectangle":
            shape = new Rectangle()
            break;
        case "text":
            shape = new Text()
            break;
        default:
            return;
    }
        shape.render(ctx,drawing)
}