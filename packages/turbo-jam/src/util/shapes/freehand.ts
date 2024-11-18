import { BoundingBox, Drawing, Point } from "../../types";
import { Shape } from ".";
export class FreeHand implements Shape {
    getBoundingBox(drawing: Drawing): BoundingBox {
        if (drawing.properties.type !== "freehand") {
            throw Error("Expected Freehand Drawing");
        }

        const { points } = drawing.properties;

        if (!points || points.length === 0) {
            throw new Error("No points in the freehand drawing.");
        }

        // Initialize min and max values
        let minX = points[0].x;
        let maxX = points[0].x;
        let minY = points[0].y;
        let maxY = points[0].y;

        // Iterate through all points to find min and max x, y
        for (const point of points) {
            if (point.x < minX) minX = point.x;
            if (point.x > maxX) maxX = point.x;
            if (point.y < minY) minY = point.y;
            if (point.y > maxY) maxY = point.y;
        }

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
        if (drawing.properties.type !== "freehand") {
            throw Error("Expected Freehand Drawing");
        }

        const { properties } = drawing;
        const { points } = properties;

        if (!points || points.length < 2) {
            return false;
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

        // Check each segment of the freehand drawing
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];

            // If the distance from coords to the segment is less than or equal to the threshold, return true
            if (pointToSegmentDistance(coords, p1, p2) <= threshold) {
                return true;
            }
        }

        return false;
    }

    render(ctx: CanvasRenderingContext2D, drawing: Drawing): void {
        if (drawing.properties.type !== "freehand") {
            throw Error("Expected Freehand Drawing");
        }
        const { properties } = drawing;

        ctx.beginPath();
        properties.points.forEach((point, index) => {
            const canvasX = point.x;
            const canvasY = point.y;
            if (index === 0) {
                ctx.moveTo(canvasX, canvasY);
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        });
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.strokeWidth;
        ctx.stroke();
    }
}
