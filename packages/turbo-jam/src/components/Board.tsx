import DrawingCanvas from "./DrawingCanvas";
import Toolbox from "./Toolbox";
import Cursors from './Cursors';
import { useEffect, useRef, useCallback } from "react";
import { JamAction, JamState } from "../types";
import {
  useBrushSettings,
  BrushSettingsProvider,
} from "../providers/BrushSettingsProvider";
import { usePanZoom } from "../hooks/usePanZoom";
import { useDrawing } from "../hooks/useDrawing";

interface BoardProps {
  dispatch: (action: JamAction) => Promise<void>;
  state: JamState;
  currentPeerId: string;
}

function Board({ dispatch, state, currentPeerId }: BoardProps) {
  const { brushSettings } = useBrushSettings(); // Use the brush settings from context
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Use custom hooks for pan/zoom and drawing logic
  const {
    panOffset,
    scale,
    isPanning,
    isPinching,
    isSpacePressed,
    handleMouseDown: panZoomHandleMouseDown,
    handleMouseMove: panZoomHandleMouseMove,
    handleMouseUp: panZoomHandleMouseUp,
    handleTouchStart: panZoomHandleTouchStart,
    handleTouchMove: panZoomHandleTouchMove,
    handleTouchEnd: panZoomHandleTouchEnd,
    handleWheel: panZoomHandleWheel,
  } = usePanZoom(boardRef);

  const {
    isDrawing,
    startDrawing,
    stopDrawing,
    handleMove,
  } = useDrawing({
    dispatch,
    currentPeerId,
    brushSettings,
    panOffset,
    scale,
    boardRef,
  });

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

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isSpacePressed) {
      panZoomHandleMouseDown(event);
    } else {
      startDrawing(event.clientX, event.clientY);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      panZoomHandleMouseMove(event);
    } else {
      handleMove(event.clientX, event.clientY);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      panZoomHandleMouseUp();
    } else {
      stopDrawing();
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.touches.length === 1 && !isPinching) {
      const touch = event.touches[0];
      startDrawing(touch.clientX, touch.clientY);
    } else if (event.touches.length === 2) {
      panZoomHandleTouchStart(event);
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (isPinching && event.touches.length === 2) {
      panZoomHandleTouchMove(event);
    } else if (event.touches.length === 1 && isDrawing) {
      const touch = event.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length < 2) {
      panZoomHandleTouchEnd(event);
    }
    if (event.touches.length === 0) {
      stopDrawing();
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    panZoomHandleWheel(event);
  };

  const allDrawings = [
    ...Object.values(state.completedDrawings),
    ...Object.values(state.activeDrawings),
  ];

  return (
    <div
      className="bg-white size-full overflow-hidden"
      ref={boardRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        cursor: isPanning
          ? "grabbing"
          : isSpacePressed
          ? "grab"
          : "crosshair",
      }}
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
      <Cursors
        state={state}
        currentPeerId={currentPeerId}
        scale={scale}
        panOffset={panOffset}
      />
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
