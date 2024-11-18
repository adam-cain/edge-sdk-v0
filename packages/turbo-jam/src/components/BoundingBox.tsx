import { BoundingBox, Point } from "../types";

interface BoundBoxProps{
  boundingBox: BoundingBox | null,
  scale: number,
  panOffset: Point
}

export default function SelectionBoundingBox(
{  boundingBox,
  scale,
  panOffset}: BoundBoxProps
) {
  if (!boundingBox) return null;

  const left = boundingBox.min.x * scale + panOffset.x;
  const top = boundingBox.min.y * scale + panOffset.y;
  const width = (boundingBox.max.x - boundingBox.min.x) * scale;
  const height = (boundingBox.max.y - boundingBox.min.y) * scale;

  return (
    <div
      className="absolute border-2 border-dashed border-blue-500 pointer-events-none z-[50] select-none"
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
}