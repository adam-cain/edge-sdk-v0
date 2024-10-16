import Cursor from "./Cursor";
import DrawingCanvas from "./DrawingCanvas";
import Toolbox, { BrushSettings } from "./Toolbox";
import { useEffect, useRef, useCallback, useState } from "react";
import { JamAction, JamState } from "../reducers/jam";
// import stringToColor from "../util/stringToCursor";

interface BoardProps {
  dispatch: (action: JamAction) => Promise<void>;
  state: JamState;
  currentPeerId: string;
}

function Board({ dispatch, state, currentPeerId }: BoardProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const drawingsRef = useRef(state.drawings);

  // Ref to keep track of the latest brush settings
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    color: "#FFFFFF",
    strokeWidth: 5, // default stroke width
  });

  useEffect(() => {
    drawingsRef.current = state.drawings;
  }, [state.drawings]);

  // Responsive Canvas Sizing
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const board = boardRef.current;
    if (canvas && board) {
      canvas.width = board.clientWidth;
      canvas.height = board.clientHeight;
    }
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  // Event Handlers
  const handleMove = (x: number, y: number) => {
    dispatch({
      type: "UPDATE_CURSOR",
      payload: { x, y },
      peerId: currentPeerId,
    });

    if (isDrawing) {
      dispatch({
        type: "ADD_DRAWING_POINT",
        payload: { x, y },
        peerId: currentPeerId,
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const rect = boardRef.current?.getBoundingClientRect();

    if (
      rect &&
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;
      handleMove(relativeX, relativeY);
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    const { clientX, clientY } = touch;
    const rect = boardRef.current?.getBoundingClientRect();

    if (
      rect &&
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;
      handleMove(relativeX, relativeY);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default behavior like text selection
    setIsDrawing(true);
    const { clientX, clientY } = event;
    const rect = boardRef.current?.getBoundingClientRect();

    if (rect) {
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;
      dispatch({
        type: "START_DRAWING",
        peerId: currentPeerId,
        payload: {
          color: brushSettings.color,
          stroke: brushSettings.strokeWidth,
        },
      });
      handleMove(relativeX, relativeY); // Capture the initial point
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    dispatch({
      type: "STOP_DRAWING",
      peerId: currentPeerId,
    });
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default touch behaviors
    setIsDrawing(true);
    const touch = event.touches[0];
    const { clientX, clientY } = touch;
    const rect = boardRef.current?.getBoundingClientRect();

    if (rect) {
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;
      dispatch({
        type: "START_DRAWING",
        peerId: currentPeerId,
        payload: {
          color: brushSettings.color,
          stroke: brushSettings.strokeWidth,
        },
      });
      handleMove(relativeX, relativeY); // Capture the initial point
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    dispatch({
      type: "STOP_DRAWING",
      peerId: currentPeerId,
    });
  };

  // Canvas Rendering Optimization with requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const drawings = drawingsRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawings.slice().reverse().forEach((drawing) => {
        if (drawing.points.length < 2) return;
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
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.stroke;
        ctx.stroke();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render(); // Start the rendering loop

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="bg-white size-full overflow-hidden"
      ref={boardRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
      aria-label="Collaborative drawing board"
      // React Event Handlers
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Canvas for drawings */}
      <DrawingCanvas
        drawings={state.drawings}
        canvasRef={canvasRef}
        brushSettings={brushSettings}
      />

      {/* Toolbox for brush/stroke settings */}
      {/* <Toolbox onSettingsChange={setBrushSettings} initialColor={stringToColor(currentPeerId)}/> */}
      <Toolbox onSettingsChange={setBrushSettings} initialColor={"#FFFFFF"} />

      {/* Render Cursors */}
      {state.cursors
        .filter((cursor) => cursor.peerId !== currentPeerId) // Filter out user's cursor
        .map((cursor, i) => (
          <Cursor
            key={i}
            cursor={cursor}
            name={state.names[cursor.peerId] || "Anonymous"}
          />
        ))}
    </div>
  );
}

export default Board;
