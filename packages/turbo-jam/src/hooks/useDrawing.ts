import { useEffect, useState } from "react";
import {
  ShapeProperties,
  DrawingId,
  JamAction,
  Point,
  JamState,
  BoundingBox,
  ResizeDirection,
  BrushSettings
} from "../types";
import { v4 as uuidv4 } from "uuid";
import { collides, getShapeBoundingBox } from "../util/shapes";
import { useBrushSettings } from "../providers/BrushSettingsProvider";

interface UseDrawingProps {
  dispatch: (action: JamAction) => Promise<void>;
  state: JamState;
  currentPeerId: string;
  brushSettings: BrushSettings;
  panOffset: { x: number; y: number };
  scale: number;
  boardRef: React.RefObject<HTMLDivElement>;
}

export function useDrawing({
  dispatch,
  state,
  currentPeerId,
  panOffset,
  scale,
  boardRef,
}: UseDrawingProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawingId, setCurrentDrawingId] = useState<DrawingId | null>(null);

  const [selectedDrawingId, setSelectedDrawingId] = useState<DrawingId | null>(null);
  const [startMoveCoords, setStartMoveCoords] = useState<Point | null>(null);

  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPoint, setResizeStartPoint] = useState<Point | null>(null);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection | null>(null);

  const selectedDrawing = selectedDrawingId ? state.completedDrawings[selectedDrawingId] : null;

  const { brushSettings, dispatchBrushSettings } = useBrushSettings()

  useEffect(() => {
    if (selectedDrawing) {
      setBoundingBox(getShapeBoundingBox(selectedDrawing));
    } else {
      setBoundingBox(null);
    }
  }, [
    selectedDrawing,
    selectedDrawing?.properties
  ]);

  useEffect(() => {
    if (!selectedDrawing) { return }
    dispatchBrushSettings({ type: "SET_COLOR", color: selectedDrawing.color })
    dispatchBrushSettings({ type: "SET_STROKE_COLOR", strokeColor: selectedDrawing.strokeColor })
    dispatchBrushSettings({ type: "SET_STROKE_WIDTH", strokeWidth: selectedDrawing.strokeWidth })
  }, [selectedDrawing, dispatchBrushSettings])

  useEffect(() => {
    if (selectedDrawing && selectedDrawingId) {
      dispatch({
        type: "UPDATE_DRAWING_APPEARANCE",
        payload: {
          color: brushSettings.color,
          strokeColor: brushSettings.strokeColor,
          strokeWidth: brushSettings.strokeWidth,
          drawingId: selectedDrawingId
        },
        peerId: currentPeerId
      })
    }
  }, [brushSettings])

  const getRelativeCoordinates = (clientX: number, clientY: number): Point | null => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const relativeX = (clientX - rect.left - panOffset.x) / scale;
    const relativeY = (clientY - rect.top - panOffset.y) / scale;
    return { x: relativeX, y: relativeY };
  };

  const startDrawing = (clientX: number, clientY: number) => {
    const coords = getRelativeCoordinates(clientX, clientY);
    if (!coords) return;

    setIsDrawing(true);
    const drawingId = `${currentPeerId}-${uuidv4()}`
    setCurrentDrawingId(drawingId);

    let properties: ShapeProperties | undefined = undefined;
    switch (brushSettings.toolType) {
      case "freehand":
        properties = {
          type: "freehand",
          points: [coords],
        };
        break;
      case "rectangle":
      case "circle":
      case "line":
        properties = {
          type: brushSettings.toolType,
          startPoint: coords,
          endPoint: coords,
        };
        break;
      case "text": {
        const text = prompt("Enter Text");
        if (!text) {
          return;
        }
        properties = {
          type: brushSettings.toolType,
          position: coords,
          text,
        };
        break;
      }
      case "select": {
        const drawings = Object.values(state.completedDrawings);

        const selectedId = collides(drawings, coords);

        if (!selectedId) {
          setSelectedDrawingId(null);
          setStartMoveCoords(null);
          return;
        }

        setSelectedDrawingId(selectedId);
        setStartMoveCoords(coords);
        //Brings drawing to front when clicked.
        dispatch({
          type: "MOVE_COMPLETED_DRAWING",
          peerId: currentPeerId,
          payload: {
            drawingId: selectedId,
            deltaX: 0,
            deltaY: 0
          }
        })
        return;
      }
      default:
        return;
    }
    setSelectedDrawingId(null);
    setStartMoveCoords(null);

    if (properties !== undefined) {
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
    setIsResizing(false);
    setResizeStartPoint(null)
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
    const coords = getRelativeCoordinates(clientX, clientY);
    if (!coords) return;

    dispatch({
      type: "UPDATE_CURSOR",
      payload: coords,
      peerId: currentPeerId,
    });

    if (isResizing && selectedDrawingId && resizeDirection && resizeStartPoint) {
      const deltaX = coords.x - resizeStartPoint.x;
      const deltaY = coords.y - resizeStartPoint.y;

      dispatch({
        type: "RESIZE_DRAWING",
        peerId: currentPeerId,
        payload: {
          drawingId: selectedDrawingId,
          deltaX,
          deltaY,
          scale: scale,
          resizeDirection
        }
      })
      setResizeStartPoint(coords)
      setStartMoveCoords(coords)
      setBoundingBox(getShapeBoundingBox(state.completedDrawings[selectedDrawingId]))
    }

    if (isDrawing && currentDrawingId) {
      switch (brushSettings.toolType) {
        case "freehand":
          dispatch({
            type: "ADD_DRAWING_POINT",
            payload: {
              drawingId: currentDrawingId,
              point: coords,
            },
            peerId: currentPeerId,
          });
          break;

        case "rectangle":
        case "circle":
        case "line":
          // Update the drawing's endPoint for other shapes
          dispatch({
            type: "UPDATE_DRAWING_PROPERTIES",
            payload: {
              drawingId: currentDrawingId,
              properties: {
                endPoint: coords,
              },
            },
            peerId: currentPeerId,
          });
          break;
        case "select": {
          // const selectedId = collides(coords);
          if (!selectedDrawingId || !startMoveCoords) return;
          // Calculate the movement delta
          const deltaX = coords.x - startMoveCoords.x;
          const deltaY = coords.y - startMoveCoords.y;
          // Dispatch the move action with the delta
          dispatch({
            type: "MOVE_COMPLETED_DRAWING",
            payload: {
              drawingId: selectedDrawingId,
              deltaX,
              deltaY,
            },
            peerId: currentPeerId,
          });
          setStartMoveCoords(coords);
          break;
        }
        default:
          break;
      }
    }
  };

  const handleDelete = () => {
    if (selectedDrawingId) {
      dispatch({
        type: "DELETE_DRAWING",
        peerId: currentPeerId,
        payload: {
          drawingId: selectedDrawingId,
        },
      });
      setSelectedDrawingId(null);
      setStartMoveCoords(null);
    }
  };

  const handleResize = (direction: ResizeDirection, point: Point) => {
    if (!selectedDrawingId) return;
    const coords = getRelativeCoordinates(point.x, point.y)
    setResizeStartPoint(coords)
    setResizeDirection(direction)
    setIsResizing(true)
    console.log("resizing");
  }

  return {
    isDrawing,
    boundingBox,
    startDrawing,
    stopDrawing,
    handleMove,
    handleDelete,
    handleResize
  };
}
