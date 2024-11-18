import { BoundingBox, Drawing, Point } from "../../types";
import { Shape } from ".";

export class Line implements Shape {
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
