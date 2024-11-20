export const shapeTypes = ['freehand', 'line', 'text', 'rectangle', 'circle'] as const;

export const toolTypes = ['select', ...shapeTypes] as const;

export enum ResizeDirection {
  TopLeft = "top-left",
  TopRight = "top-right",
  BottomLeft = "bottom-left",
  BottomRight = "bottom-right",
  Top = "top",
  Bottom = "bottom",
  Left = "left",
  Right = "right",
}

export const directionVectors: { [key in ResizeDirection]: { x: number; y: number } } = {
  [ResizeDirection.TopLeft]: { x: -1, y: -1 },
  [ResizeDirection.TopRight]: { x: 1, y: -1 },
  [ResizeDirection.BottomLeft]: { x: -1, y: 1 },
  [ResizeDirection.BottomRight]: { x: 1, y: 1 },
  [ResizeDirection.Top]: { x: 0, y: -1 },
  [ResizeDirection.Bottom]: { x: 0, y: 1 },
  [ResizeDirection.Left]: { x: -1, y: 0 },
  [ResizeDirection.Right]: { x: 1, y: 0 },
};