
import { EdgeAction } from '@turbo-ing/edge-v0';
import { JamState, DrawingId } from './state';
import { Point, ShapeProperties } from './shapes';
import { ResizeDirection } from './enums';

interface BaseJamAction extends EdgeAction<JamState> {
  peerId: string;
  type: string;
}

export interface SetRecipientNameAction extends BaseJamAction {
  type: 'SET_NAME';
  payload: {
    name: string;
  };
}

export interface UpdateCursorAction extends BaseJamAction {
  type: 'UPDATE_CURSOR';
  payload: Point;
}

export interface StartDrawingAction extends BaseJamAction {
  type: 'START_DRAWING';
  payload: {
    drawingId: DrawingId;
    color: string;
    strokeColor: string,
    strokeWidth: number;
    properties: ShapeProperties;
  };
}

export interface UpdateDrawingPropertiesAction extends BaseJamAction {
  type: 'UPDATE_DRAWING_PROPERTIES';
  payload: {
    drawingId: DrawingId;
    properties: Partial<ShapeProperties>;
  };
}

export interface AddPointAction extends BaseJamAction {
  type: 'ADD_DRAWING_POINT';
  payload: {
    drawingId: DrawingId;
    point: Point;
  };
}

export interface StopDrawingAction extends BaseJamAction {
  type: 'STOP_DRAWING';
  payload: {
    drawingId: DrawingId;
  };
}

export interface ResetStateAction extends BaseJamAction {
  type: 'RESET_STATE';
}

export interface DeleteDrawingAction extends BaseJamAction {
  type: "DELETE_DRAWING"; 
  peerId: string; 
  payload: { drawingId: DrawingId }
}

export interface MoveCompletedDrawingAction extends BaseJamAction {
  type: 'MOVE_COMPLETED_DRAWING';
  payload: {
    drawingId: DrawingId;
    deltaX: number;
    deltaY: number;
  };
}

export interface ResizeDrawingAction extends BaseJamAction {
  type: 'RESIZE_DRAWING';
  payload: {
    drawingId: DrawingId;
    deltaX: number;
    deltaY: number;
    scale: number;
    resizeDirection: ResizeDirection
  };
}

export interface UpdateDrawingAppearanceAction extends BaseJamAction {
  type: 'UPDATE_DRAWING_APPEARANCE';
  payload: {
    drawingId: DrawingId;
    color: string;
    strokeColor: string;
    strokeWidth: number;
  }
}

export interface UpdateTextAction extends BaseJamAction {
  type: "UPDATE_TEXT",
  payload: {
    drawingId: DrawingId;
    text: string;
  }
}

export type JamAction =
  | SetRecipientNameAction
  | UpdateCursorAction
  | StartDrawingAction
  | UpdateDrawingPropertiesAction
  | AddPointAction
  | StopDrawingAction
  | ResetStateAction
  | DeleteDrawingAction
  | MoveCompletedDrawingAction
  | ResizeDrawingAction
  | UpdateDrawingAppearanceAction
  | UpdateTextAction