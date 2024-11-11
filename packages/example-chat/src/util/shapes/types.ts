import { Drawing } from "../../types";

export interface Shape{
    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void;
}