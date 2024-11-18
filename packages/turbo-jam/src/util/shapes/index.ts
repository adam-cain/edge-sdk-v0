import { BoundingBox, Drawing, Point, ShapeType } from '@/src/types';

import { FreeHand } from './freehand';
import { Line } from './line';
import { Circle } from './circle';
import { Rectangle } from './rectangle';
import { Text } from './text';

export interface Shape{
    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void;
    collision(drawing: Drawing, coords: Point) : boolean;
    getBoundingBox(drawing: Drawing): BoundingBox;
}

class ShapeFactory {
    private static shapeRegistry: Record<ShapeType, () => Shape> = {
        freehand: () => new FreeHand(),
        rectangle: () => new Rectangle(),
        circle: () => new Circle(),
        line: () => new Line(),
        text: () => new Text(),
    };

    static createShape(type: ShapeType): Shape | null {
        const shapeConstructor = this.shapeRegistry[type];
        return shapeConstructor ? shapeConstructor() : null;
    }
}

export function renderDrawing(drawing: Drawing, ctx: CanvasRenderingContext2D) {
    const shapeInstance = ShapeFactory.createShape(drawing.properties.type);
    if (shapeInstance) {
        shapeInstance.render(ctx, drawing);
    }
}

export function getShapeBoundingBox(drawing: Drawing) {
    const shapeInstance = ShapeFactory.createShape(drawing.properties.type);
    return shapeInstance ? shapeInstance.getBoundingBox(drawing) : null;
}

export function collides(drawings: Drawing[], coords: Point) {
    for (let i = drawings.length - 1; i >= 0; i--) {
        const drawing = drawings[i];
        const shapeInstance = ShapeFactory.createShape(drawing.properties.type);
        if (shapeInstance && shapeInstance.collision(drawing, coords)) {
            return drawing.id;
        }
    }
    return null;
}
