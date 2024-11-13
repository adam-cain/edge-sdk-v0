import { ShapeProperties, ToolType } from './index';

export type DrawingId = string;

export interface CursorPosition {
  peerId: string;
  x: number;
  y: number;
}

export interface Drawing {
  id: DrawingId;
  peerId: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  properties: ShapeProperties;
}

export interface JamState {
  cursors: Record<string, CursorPosition>;
  names: Record<string, string>;
  activeDrawings: Record<string, Drawing>;
  completedDrawings: Record<DrawingId, Drawing>;
}

export interface BrushSettings {
  color: string;
  strokeColor: string;
  strokeWidth: number;
  toolType: ToolType;
}