import Cursor from "./Cursor";
import DrawingCanvas from "./DrawingCanvas";
import Toolbox from "./Toolbox";
import { useEffect, useRef, useCallback, useState } from "react";
import { DrawingId, JamAction, JamState, ShapeProperties } from "../types";
import {
  useBrushSettings,
  BrushSettingsProvider,
} from "../providers/BrushSettingsProvider";

interface BoardProps {
  dispatch: (action: JamAction) => Promise<void>;
  state: JamState;
  currentPeerId: string;
}

function Board({ dispatch, state, currentPeerId }: BoardProps) {
  const { brushSettings } = useBrushSettings(); // Use the brush settings from context
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [currentDrawingId, setCurrentDrawingId] = useState<DrawingId | null>(
    null
  );
  const drawingIdRef = useRef(0);

  // Pan and Zoom State
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

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

  // Handle Keyboard Events for Panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMove = (x: number, y: number) => {
    dispatch({
      type: "UPDATE_CURSOR",
      payload: { x, y },
      peerId: currentPeerId,
    });

    if (isDrawing && currentDrawingId) {
      switch (brushSettings.shapeType) {
        case "freehand":
          dispatch({
            type: "ADD_DRAWING_POINT",
            payload: {
              drawingId: currentDrawingId,
              point: { x, y },
            },
            peerId: currentPeerId,
          });
          break;

        case "rectangle":
        case "circle":
        case "line":
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
          break;
        default:
          break;
      }
    }
  };

  const handleMoveEvent = (clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const relativeX = (clientX - rect.left - panOffset.x) / scale;
      const relativeY = (clientY - rect.top - panOffset.y) / scale;
      handleMove(relativeX, relativeY);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      const deltaX = event.clientX - panStartRef.current!.x;
      const deltaY = event.clientY - panStartRef.current!.y;
      setPanOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      panStartRef.current = { x: event.clientX, y: event.clientY };
    } else {
      handleMoveEvent(event.clientX, event.clientY);
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    handleMoveEvent(touch.clientX, touch.clientY);
  };

  const startDrawing = (clientX: number, clientY: number) => {
    setIsDrawing(true);
    drawingIdRef.current += 1;
    const drawingId = `${currentPeerId}-${drawingIdRef.current.toString()}`; // Use peerId as prefix
    setCurrentDrawingId(drawingId);

    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const relativeX = (clientX - rect.left - panOffset.x) / scale;
      const relativeY = (clientY - rect.top - panOffset.y) / scale;

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
        case "text":
          const text = prompt("Enter Text");
          if (!text) {
            return;
          }
          properties = {
            type: brushSettings.shapeType,
            position: { x: relativeX, y: relativeY },
            text,
          };
          break;
        default:
          return;
      }

      dispatch({
        type: "START_DRAWING",
        peerId: currentPeerId,
        payload: {
          drawingId,
          color: brushSettings.color,
          strokeColor: brushSettings.strokeColor,
          strokeWidth: brushSettings.strokeWidth,
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
    if (isSpacePressed) {
      setIsPanning(true);
      panStartRef.current = { x: event.clientX, y: event.clientY };
    } else {
      startDrawing(event.clientX, event.clientY);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    const touch = event.touches[0];
    startDrawing(touch.clientX, touch.clientY);
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
    } else {
      stopDrawing();
    }
  };

  const handleTouchEnd = () => stopDrawing();

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = -event.deltaY;

    // Adjust scale
    const zoomFactor = 1.1;
    let newScale = scale;

    if (delta > 0) {
      // Zoom in
      newScale *= zoomFactor;
    } else if (delta < 0) {
      // Zoom out
      newScale /= zoomFactor;
    }

    // Limit scale
    newScale = Math.max(0.1, Math.min(newScale, 10));

    // To keep the point under the cursor stationary, adjust panOffset accordingly
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      const prevScale = scale;
      const scaleChange = newScale / prevScale;

      const originX = (clientX - panOffset.x) / prevScale;
      const originY = (clientY - panOffset.y) / prevScale;

      const newPanOffsetX = clientX - originX * newScale;
      const newPanOffsetY = clientY - originY * newScale;

      setScale(newScale);
      setPanOffset({ x: newPanOffsetX, y: newPanOffsetY });
    } else {
      setScale(newScale);
    }
  };

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
      onWheel={handleWheel}
    >
      {/* Canvas for drawings */}
      <DrawingCanvas
        drawings={allDrawings}
        canvasRef={canvasRef}
        panOffset={panOffset}
        scale={scale}
      />

      {/* Render Cursors */}
      {Object.values(state.cursors)
        .filter((cursor) => cursor.peerId !== currentPeerId) // Filter out user's cursor
        .map((cursor, i) => {
          const screenX = cursor.x * scale + panOffset.x;
          const screenY = cursor.y * scale + panOffset.y;
          return (
            <Cursor
              key={i}
              x={screenX}
              y={screenY}
              name={state.names[cursor.peerId] || "Anonymous"}
              peerId={cursor.peerId}
            />
          );
        })}
    </div>
  );
}

export default function BoardWithProvider(props: BoardProps) {
  return (
    <BrushSettingsProvider currentPeerId={props.currentPeerId}>
      <Board {...props} />
      {/* Toolbox for brush/stroke settings */}
      <Toolbox />
    </BrushSettingsProvider>
  );
}
