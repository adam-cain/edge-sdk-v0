
import { EdgeAction } from '@turbo-ing/edge-v0';
import { JamState, DrawingId, Drawing } from './state';
import { Point, ShapeProperties } from './shapes';

interface BaseJamAction extends EdgeAction<JamState> {
  peerId: string;
  type: string;
}

export interface SetRecipientNameAction extends BaseJamAction {
  type: 'SET_RECIPIENT_NAME';
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
    stroke: number;
    properties: ShapeProperties;
  };
}

export interface UpdateDrawingAction extends BaseJamAction {
  type: 'UPDATE_DRAWING';
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

export type JamAction =
  | SetRecipientNameAction
  | UpdateCursorAction
  | StartDrawingAction
  | UpdateDrawingAction
  | AddPointAction
  | StopDrawingAction
  | ResetStateAction;
