import Cursor from "./Cursor";
import DrawingCanvas from "./DrawingCanvas";
import Toolbox, { BrushSettings } from "./Toolbox";
import { useEffect, useRef, useCallback, useState } from "react";
import { DrawingId, JamAction, JamState, ShapeProperties } from "../reducers/jam";
import stringToColor from "../util/stringToCursor";

interface BoardProps {
  dispatch: (action: JamAction) => Promise<void>;
  state: JamState;
  currentPeerId: string;
}

function Board({ dispatch, state, currentPeerId }: BoardProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  // const drawingsRef = useRef(state.drawings);
  const [currentDrawingId, setCurrentDrawingId] = useState<DrawingId | null>(null);
  const drawingIdRef = useRef(0);


  // Ref to keep track of the latest brush settings
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    color: stringToColor(currentPeerId),
    strokeWidth: 5,
    shapeType: "freehand"
  });

  // useEffect(() => {
  //   drawingsRef.current = state.drawings;
  // }, [state.drawings]);

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


  const handleMove = (x: number, y: number) => {
    dispatch({
      type: "UPDATE_CURSOR",
      payload: { x, y },
      peerId: currentPeerId,
    });

    if (isDrawing && currentDrawingId) {
      if (brushSettings.shapeType === "freehand") {
        dispatch({
          type: "ADD_DRAWING_POINT",
          payload: {
            drawingId: currentDrawingId,
            point: { x, y },
          },
          peerId: currentPeerId,
        });
      } else {
        // Update the drawing's endPoint for other shapes
        dispatch({
          type: "UPDATE_DRAWING",
          payload: {
            drawingId: currentDrawingId,
            properties: {
              endPoint: { x, y },
            },
          },
          peerId: currentPeerId,
        });
      }
    }
  };


  const handleMoveEvent = (clientX: number, clientY: number) => {
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
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    handleMoveEvent(event.clientX, event.clientY);
  };
  
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    handleMoveEvent(touch.clientX, touch.clientY);
  };

  const startDrawing = (clientX: number, clientY: number) => {
    setIsDrawing(true);
    drawingIdRef.current += 1;
    const drawingId = drawingIdRef.current.toString();
    setCurrentDrawingId(drawingId);

    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;

      let properties: ShapeProperties;
      switch (brushSettings.shapeType) {
        case "freehand":
          properties = {
            type: "freehand",
            points: [{ x: relativeX, y: relativeY }],
          };
          break;
        case "rectangle":
        case "circle":
        case "line":
          properties = {
            type: brushSettings.shapeType,
            startPoint: { x: relativeX, y: relativeY },
            endPoint: { x: relativeX, y: relativeY },
          };
          break;
        // Handle 'text' or other shapes if necessary
        default:
          return;
      }

      dispatch({
        type: "START_DRAWING",
        peerId: currentPeerId,
        payload: {
          drawingId,
          color: brushSettings.color,
          stroke: brushSettings.strokeWidth,
          properties,
        },
      });
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (currentDrawingId) {
      dispatch({
        type: "STOP_DRAWING",
        peerId: currentPeerId,
        payload: { drawingId: currentDrawingId },
      });
      setCurrentDrawingId(null);
    }
  };
  
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    startDrawing(event.clientX, event.clientY);
  };
  
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    const touch = event.touches[0];
    startDrawing(touch.clientX, touch.clientY);
  };
  
  const handleMouseUp = () => stopDrawing();
  const handleTouchEnd = () => stopDrawing();

  const allDrawings = [
    ...Object.values(state.completedDrawings),
    ...Object.values(state.activeDrawings),
  ];

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
        drawings={allDrawings}
        canvasRef={canvasRef}
      />

      {/* Toolbox for brush/stroke settings */}
      <Toolbox onSettingsChange={setBrushSettings} initialColor={stringToColor(currentPeerId)} />

      {/* Render Cursors */}
      {Object.values(state.cursors)
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
