import { Drawing } from "../reducers/jam";
import { Circle, FreeHand, Line, Rectangle } from "./shapes";
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
        default:
            throw Error("Shape not supported")
    }
    if(shape){
        shape.render(ctx,drawing)
    }
}