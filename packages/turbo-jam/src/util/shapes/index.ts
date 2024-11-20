import { BoundingBox, Drawing, Point, ShapeType } from '@/src/types';
import {ResizeDirection}from "../../types/enums"
import { FreeHand } from './freehand';
import { Line } from './line';
import { Circle } from './circle';
import { Rectangle } from './rectangle';
import { Text } from './text';

export interface Shape {
    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void;
    collision(drawing: Drawing, coords: Point): boolean;
    getBoundingBox(drawing: Drawing): BoundingBox;
    resize(drawing: Drawing, direction: ResizeDirection, delta: Point, scale?: number): Drawing;
}
const shapeHandlers: Record<ShapeType, Shape> = {
    freehand: new FreeHand,
    rectangle: new Rectangle,
    circle: new Circle,
    line: new Line,
    text: new Text,
};

export function resizeDrawing(drawing: Drawing, direction: ResizeDirection, delta: Point, scale: number) {
    const handler = shapeHandlers[drawing.properties.type];
    if (handler) {
        return handler.resize(drawing, direction, delta, scale);
    }
}

export function renderDrawing(drawing: Drawing, ctx: CanvasRenderingContext2D) {
    const handler = shapeHandlers[drawing.properties.type];
    if (handler) {
        handler.render(ctx, drawing);
    }
}

export function getShapeBoundingBox(drawing: Drawing) {
    const handler = shapeHandlers[drawing.properties.type];
    return handler ? handler.getBoundingBox(drawing) : null;
}

export function collides(drawings: Drawing[], coords: Point) {
    for (let i = drawings.length - 1; i >= 0; i--) {
        const drawing = drawings[i];
        const handler = shapeHandlers[drawing.properties.type];
        if (handler && handler.collision(drawing, coords)) {
            return drawing.id;
        }
    }
    return null;
}