import { useEffect } from "react";
import { Drawing } from "../reducers/jam";
// import stringToColor from "../util/stringToCursor";
import { BrushSettings } from "./Toolbox";

interface DrawingCanvasProps {
    drawings: Drawing[];
    canvasRef: React.RefObject<HTMLCanvasElement>;
    brushSettings: BrushSettings
}

const DrawingCanvas = ({
    drawings,
    canvasRef,
    brushSettings
}: DrawingCanvasProps) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render each drawing
        drawings.forEach((drawing) => {
            if (drawing.points.length < 2) return; // Skip if not enough points
            ctx.beginPath();
            drawing.points.forEach((point, index) => {
                const canvasX = point.x;
                const canvasY = point.y;
                if (index === 0) {
                    ctx.moveTo(canvasX, canvasY);
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            });
            ctx.strokeStyle = brushSettings.color;
            ctx.lineWidth = brushSettings.strokeWidth;
            ctx.stroke();
        });
    }, [drawings, canvasRef]);

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

export default DrawingCanvas