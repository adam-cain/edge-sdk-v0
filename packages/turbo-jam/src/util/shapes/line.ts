import { BoundingBox, Drawing, Point } from "../../types";
import {directionVectors, ResizeDirection}from "../../types/enums"
import { Shape } from ".";

export class Line implements Shape {
    resize(drawing: Drawing, direction: ResizeDirection, delta: Point): Drawing {
        if (drawing.properties.type !== "line") {
            throw Error("Expected Line Drawing");
        }

        const { startPoint, endPoint } = drawing.properties;

        if (!startPoint || !endPoint) {
            throw new Error("StartPoint and EndPoint are required for resizing");
        }

        // Clone the points to avoid mutating the original drawing
        const newStartPoint: Point = { ...startPoint };
        const newEndPoint: Point = { ...endPoint };

        const vector = directionVectors[direction];
        if (!vector) {
            throw new Error("Invalid resize direction");
        }

        // Determine which point has the min and max x and y coordinates
        const minXPoint = newStartPoint.x <= newEndPoint.x ? newStartPoint : newEndPoint;
        const maxXPoint = newStartPoint.x > newEndPoint.x ? newStartPoint : newEndPoint;
        const minYPoint = newStartPoint.y <= newEndPoint.y ? newStartPoint : newEndPoint;
        const maxYPoint = newStartPoint.y > newEndPoint.y ? newStartPoint : newEndPoint;

        // Adjust points based on direction vector and delta
        if (vector.x !== 0) {
            if (vector.x > 0) {
                // East - adjust the point with the maximum x-coordinate
                maxXPoint.x += delta.x;
            } else if (vector.x < 0) {
                // West - adjust the point with the minimum x-coordinate
                minXPoint.x += delta.x;
            }
        }

        if (vector.y !== 0) {
            if (vector.y > 0) {
                // South - adjust the point with the maximum y-coordinate
                maxYPoint.y += delta.y;
            } else if (vector.y < 0) {
                // North - adjust the point with the minimum y-coordinate
                minYPoint.y += delta.y;
            }
        }

        // Optionally enforce a minimum length to prevent collapsing the line
        const minLength = 1; // Minimum allowed length
        const lengthSquared = Math.pow(newEndPoint.x - newStartPoint.x, 2) + Math.pow(newEndPoint.y - newStartPoint.y, 2);
        if (lengthSquared < minLength * minLength) {
            // Constrain the line to the minimum length
            // Implement logic to adjust the points to maintain minimum length
        }

        // Return the updated drawing with the new points
        return {
            ...drawing,
            properties: {
                ...drawing.properties,
                startPoint: newStartPoint,
                endPoint: newEndPoint
            }
        };
    }
    
    getBoundingBox(drawing: Drawing): BoundingBox {
        if (drawing.properties.type !== "line") {
            throw Error("Expected Line Drawing");
        }

        const { startPoint, endPoint } = drawing.properties;

        if (!startPoint || !endPoint) {
            throw new Error("Required Points Missing");
        }

        // Calculate min and max x, y coordinates
        const minX = Math.min(startPoint.x, endPoint.x);
        const maxX = Math.max(startPoint.x, endPoint.x);
        const minY = Math.min(startPoint.y, endPoint.y);
        const maxY = Math.max(startPoint.y, endPoint.y);

        // Construct the BoundingBox object
        return {
            min: {
                x: minX,
                y: minY
            },
            max: {
                x: maxX,
                y:maxY
            }
        }
    }
    collision(drawing: Drawing, coords: Point): boolean {
        if (drawing.properties.type !== "line") {
            throw Error("Expected Line Drawing");
        }

        const { properties } = drawing;
        const { startPoint, endPoint } = properties;

        if (!startPoint || !endPoint) {
            throw new Error("Required Points Missing");
        }

        const threshold = drawing.strokeWidth / 2;

        // Helper function to calculate the squared distance between two points
        const distanceSquared = (p1: Point, p2: Point): number => {
            return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
        };

        // Helper function to find the minimum distance from a point to a line segment
        const pointToSegmentDistance = (p: Point, v: Point, w: Point): number => {
            const l2 = distanceSquared(v, w);
            if (l2 === 0) return Math.sqrt(distanceSquared(p, v)); // v and w are the same point

            // Calculate the projection of point p onto the segment vw
            const t = Math.max(0, Math.min(1, ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2));
            const projection = {
                x: v.x + t * (w.x - v.x),
                y: v.y + t * (w.y - v.y),
            };

            // Return the distance between p and the projection point
            return Math.sqrt(distanceSquared(p, projection));
        };

        // Calculate the distance from the point (coords) to the line segment (startPoint, endPoint)
        const distance = pointToSegmentDistance(coords, startPoint, endPoint);

        // Return true if the distance is less than or equal to the threshold
        return distance <= threshold;
    }

    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void {
        if (drawing.properties.type !== "line") {
            throw Error("Expected Line Drawing");
        }
        const { properties } = drawing;

        ctx.beginPath();

        const { x: startX, y: startY } = properties.startPoint;
        ctx.moveTo(startX, startY);

        const { x: endX, y: endY } = properties.endPoint;
        ctx.lineTo(endX, endY);

        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.strokeWidth;
        ctx.stroke();
    }
}
