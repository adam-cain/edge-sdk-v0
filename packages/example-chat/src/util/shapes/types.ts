import { Drawing } from "../../reducers/jam";

export interface Shape{
    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void;
}