
export const shapeTypes = ['freehand', 'rectangle', 'circle', 'line', 'text'] as const;
export type ShapeType = typeof shapeTypes[number];

export interface Point {
  x: number;
  y: number;
}

export interface StartEnd {
  startPoint: Point;
  endPoint: Point;
}

// Base interface for shape properties
export interface BaseShapeProperties {
  type: ShapeType;
}

export interface FreehandShapeProperties extends BaseShapeProperties {
  type: 'freehand';
  points: Point[];
}

export interface TextShapeProperties extends BaseShapeProperties {
  type: 'text';
  position: Point;
  text: string;
  fontSize: number;
}

export interface RectangleShapeProperties extends BaseShapeProperties, StartEnd {
  type: 'rectangle';
}

export interface CircleShapeProperties extends BaseShapeProperties, StartEnd {
  type: 'circle';
}

export interface LineShapeProperties extends BaseShapeProperties, StartEnd {
  type: 'line';
}

export type ShapeProperties =
  | FreehandShapeProperties
  | TextShapeProperties
  | RectangleShapeProperties
  | CircleShapeProperties
  | LineShapeProperties;
