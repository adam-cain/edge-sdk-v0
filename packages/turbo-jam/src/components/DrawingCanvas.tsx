import { useCallback, useEffect } from "react";
import { Drawing } from "../types";
import { renderDrawing } from "../util/shapes";

interface DrawingCanvasProps {
    drawings: Drawing[];
    canvasRef: React.RefObject<HTMLCanvasElement>;
    panOffset: { x: number; y: number };
    scale: number;
}

const DrawingCanvas = ({
    drawings,
    canvasRef,
    panOffset,
    scale,
}: DrawingCanvasProps) => {


    const renderGrid = useCallback((ctx: CanvasRenderingContext2D) => {
        const gridSize = 20; // Set grid size

        ctx.strokeStyle = "#e0e0e0"; // Light color for the grid lines
        ctx.lineWidth = 0.4;

        const canvas = canvasRef.current!;
        const width = canvas.width / scale;
        const height = canvas.height / scale;

        const startX = (-panOffset.x) / scale;
        const startY = (-panOffset.y) / scale;

        const endX = startX + width;
        const endY = startY + height;

        // Adjust to grid size
        const firstLineX = Math.floor(startX / gridSize) * gridSize;
        const firstLineY = Math.floor(startY / gridSize) * gridSize;

        // Draw vertical lines
        for (let x = firstLineX; x <= endX; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = firstLineY; y <= endY; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }
    }, [canvasRef, panOffset, scale])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            ctx.save();
            // Clear canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Apply transformations
            ctx.setTransform(scale, 0, 0, scale, panOffset.x, panOffset.y);

            // Render grid
            renderGrid(ctx);

            // Render drawings
            drawings.forEach((drawing) => {
                renderDrawing(drawing, ctx);
            });

            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };

        render(); // Start the rendering loop

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [drawings, canvasRef, panOffset, scale, renderGrid]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                width: "100%",
                height: "100%",
            }}
        ></canvas>
    );
};

export default DrawingCanvas;
