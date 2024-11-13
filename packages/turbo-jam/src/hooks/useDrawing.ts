import { useState } from "react";
import { ShapeProperties, DrawingId, JamAction } from "../types";
import { BrushSettings } from "../types";
import { v4 as uuidv4 } from "uuid";
interface UseDrawingProps {
  dispatch: (action: JamAction) => Promise<void>;
  currentPeerId: string;
  brushSettings: BrushSettings;
  panOffset: { x: number; y: number };
  scale: number;
  boardRef: React.RefObject<HTMLDivElement>;
}

export function useDrawing({
  dispatch,
  currentPeerId,
  brushSettings,
  panOffset,
  scale,
  boardRef,
}: UseDrawingProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawingId, setCurrentDrawingId] = useState<DrawingId | null>(null);

  const startDrawing = (clientX: number, clientY: number) => {
    setIsDrawing(true);
    const drawingId = `${currentPeerId}-${uuidv4()}`
    setCurrentDrawingId(drawingId);

    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const relativeX = (clientX - rect.left - panOffset.x) / scale;
      const relativeY = (clientY - rect.top - panOffset.y) / scale;

      let properties: ShapeProperties;
      switch (brushSettings.toolType) {
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
            type: brushSettings.toolType,
            startPoint: { x: relativeX, y: relativeY },
            endPoint: { x: relativeX, y: relativeY },
          };
          break;
        case "text": {
          const text = prompt("Enter Text");
          if (!text) {
            return;
          }
          properties = {
            type: brushSettings.toolType,
            position: { x: relativeX, y: relativeY },
            text,
          };
          break;
        }
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

  const handleMove = (clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const relativeX = (clientX - rect.left - panOffset.x) / scale;
      const relativeY = (clientY - rect.top - panOffset.y) / scale;

      dispatch({
        type: "UPDATE_CURSOR",
        payload: { x: relativeX, y: relativeY },
        peerId: currentPeerId,
      });

      if (isDrawing && currentDrawingId) {
        switch (brushSettings.toolType) {
          case "freehand":
            dispatch({
              type: "ADD_DRAWING_POINT",
              payload: {
                drawingId: currentDrawingId,
                point: { x: relativeX, y: relativeY },
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
                  endPoint: { x: relativeX, y: relativeY },
                },
              },
              peerId: currentPeerId,
            });
            break;
          default:
            break;
        }
      }
    }
  };

  return {
    isDrawing,
    startDrawing,
    stopDrawing,
    handleMove,
  };
}
