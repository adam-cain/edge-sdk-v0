import { useState } from "react";
import { useIsCoarsePointer } from "../hooks/useIsCoarsePointer";
import { BoundingBox, Point } from "../types";
import { ResizeDirection } from "../types/enums";

interface BoundBoxProps {
  boundingBox: BoundingBox | null;
  scale: number;
  panOffset: Point;
  isGrabbing: boolean;
  onResizeStart?: (direction: ResizeDirection, point: Point) => void;
  onEdit?: () => void; // New prop for entering edit mode
}

interface Handle {
  direction: ResizeDirection;
  x: number;
  y: number;
  cursor: string;
}

export default function SelectionBoundingBox({
  boundingBox,
  scale,
  panOffset,
  isGrabbing,
  onResizeStart,
  onEdit,
}: BoundBoxProps) {
  const isMobile = useIsCoarsePointer();
  const [lastTapTime, setLastTapTime] = useState<number | null>(null); // State to track double-tap timing

  if (!boundingBox) return null;

  const handleSize = isMobile ? 15 : 10;
  const halfHandleSize = handleSize / 2;

  const left = boundingBox.min.x * scale + panOffset.x;
  const top = boundingBox.min.y * scale + panOffset.y;
  const width = (boundingBox.max.x - boundingBox.min.x) * scale;
  const height = (boundingBox.max.y - boundingBox.min.y) * scale;

  const createHandleStyle = (x: number, y: number) => ({
    left: x - halfHandleSize,
    top: y - halfHandleSize,
    width: handleSize,
    height: handleSize,
  });

  const handleData: Handle[] = [
    { direction: ResizeDirection.TopLeft, x: 0, y: 0, cursor: "cursor-nwse-resize" },
    { direction: ResizeDirection.TopRight, x: width, y: 0, cursor: "cursor-nesw-resize" },
    { direction: ResizeDirection.BottomLeft, x: 0, y: height, cursor: "cursor-nesw-resize" },
    { direction: ResizeDirection.BottomRight, x: width, y: height, cursor: "cursor-nwse-resize" },
    { direction: ResizeDirection.Top, x: width / 2, y: 0, cursor: "cursor-ns-resize" },
    { direction: ResizeDirection.Bottom, x: width / 2, y: height, cursor: "cursor-ns-resize" },
    { direction: ResizeDirection.Left, x: 0, y: height / 2, cursor: "cursor-ew-resize" },
    { direction: ResizeDirection.Right, x: width, y: height / 2, cursor: "cursor-ew-resize" },
  ];

  

  const handleDoubleTap = () => {

    if (onEdit) {
      onEdit(); // Trigger the editing callback
    }
  };

  const handleTouchStart = () => {
    const currentTime = Date.now();
    if (lastTapTime && currentTime - lastTapTime < 300) {
      handleDoubleTap(); // Double-tap detected
    }
    setLastTapTime(currentTime); // Update the last tap time
  };

  return (
    <div
      className={`absolute border-2 border-dashed border-blue-500 z-[50] select-none ${isGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ left, top, width, height }}
      onDoubleClick={onEdit} // Handle double-click for desktop
      onTouchStart={handleTouchStart} // Handle touch-based double-tap for mobile
    >
      {handleData.map(({ direction, x, y, cursor }) => (
        <div
          key={direction}
          className={`absolute bg-blue-500 -translate-x-0.5 -translate-y-0.5 rounded-full pointer-events-auto ${cursor}`}
          style={createHandleStyle(x, y)}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart?.(direction, { x: e.clientX, y: e.clientY });
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            const touch = e.touches[0];
            onResizeStart?.(direction, { x: touch.clientX, y: touch.clientY });
          }}
        />
      ))}
    </div>
  );
}
