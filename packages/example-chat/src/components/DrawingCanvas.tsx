import { useEffect } from "react";
import { Drawing } from "../reducers/jam";
import { renderDrawing } from "../util/shapeRenderer";

interface DrawingCanvasProps {
    drawings: Drawing[];
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const DrawingCanvas = ({
    drawings,
    canvasRef,
}: DrawingCanvasProps) => {


    //  Canvas Rendering Optimization with requestAnimationFrame

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;


        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawings.forEach((drawing) => {
                renderDrawing(drawing, ctx)
            });

            animationFrameId = requestAnimationFrame(render);
        }

        render(); // Start the rendering loop

        return () => {
            cancelAnimationFrame(animationFrameId);
        };

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