import { EdgeAction } from "@turbo-ing/edge-v0";
import {updateCursor, addOrUpdateDrawing, removeDrawing} from "../util/reducerUtil"

export const shapeTypes = ['freehand', 'rectangle', 'circle', 'line', 'text'] as const;
export type ShapeType = typeof shapeTypes[number];

export type Point = {
  x: number;
  y: number;
};

export interface StartEnd {
  startPoint: Point;
  endPoint: Point;
}

// Base interface for shape properties
interface BaseShapeProperties {
  type: ShapeType;
}

interface FreehandShapeProperties extends BaseShapeProperties {
  type: 'freehand';
  points: Point[];
}

interface TextShapeProperties extends BaseShapeProperties {
  type: 'text';
  position: Point;
  text: string;
  fontSize: number;
}

interface RectangleShapeProperties extends BaseShapeProperties, StartEnd {
  type: 'rectangle';
}

interface CircleShapeProperties extends BaseShapeProperties, StartEnd {
  type: 'circle';
}

interface LineShapeProperties extends BaseShapeProperties, StartEnd {
  type: 'line';
}

export type ShapeProperties =
  | FreehandShapeProperties
  | TextShapeProperties
  | RectangleShapeProperties
  | CircleShapeProperties
  | LineShapeProperties;

export interface CursorPosition extends Point {
  peerId: string;
}

export type DrawingId = string;

export interface Drawing {
  id: DrawingId;
  peerId: string;
  color: string;
  stroke: number;
  properties: ShapeProperties;
}

export interface JamState {
  cursors: Record<string, CursorPosition>;
  names: Record<string, string>;
  activeDrawings: Record<string, Drawing>;
  completedDrawings: Record<DrawingId, Drawing>;
}

// Action interfaces

interface BaseJamAction extends EdgeAction<JamState> {
  peerId: string;
  type: string;
}

interface SetRecipientNameAction extends BaseJamAction {
  type: "SET_RECIPIENT_NAME";
  payload: {
    name: string;
  };
}

interface UpdateCursorAction extends BaseJamAction {
  type: "UPDATE_CURSOR";
  payload: Point;
}

interface StartDrawingAction extends BaseJamAction {
  type: "START_DRAWING";
  payload: {
    drawingId: DrawingId;
    color: string;
    stroke: number;
    properties: ShapeProperties;
  };
}

interface UpdateDrawingAction extends BaseJamAction {
  type: "UPDATE_DRAWING";
  payload: {
    drawingId: DrawingId;
    properties: Partial<ShapeProperties>;
  };
}

interface AddPointAction extends BaseJamAction {
  type: "ADD_DRAWING_POINT";
  payload: {
    drawingId: DrawingId;
    point: Point;
  };
}

interface StopDrawingAction extends BaseJamAction {
  type: "STOP_DRAWING";
  payload: {
    drawingId: DrawingId;
  };
}

interface ResetStateAction extends BaseJamAction {
  type: "RESET_STATE";
}

export type JamAction =
  | SetRecipientNameAction
  | UpdateCursorAction
  | StartDrawingAction
  | UpdateDrawingAction
  | AddPointAction
  | StopDrawingAction
  | ResetStateAction;


  export const initialState: JamState = {
    cursors: {},
    names: {},
    activeDrawings: {},
    completedDrawings: {},
  };

  export function jamReducer(
    state: JamState = initialState,
    action: JamAction
  ): JamState {
    if (!action.peerId) return state;
  
    switch (action.type) {
      case "SET_RECIPIENT_NAME": {
        const { name } = action.payload;
        return {
          ...state,
          names: {
            ...state.names,
            [action.peerId]: name,
          },
        };
      }
  
      case "UPDATE_CURSOR": {
        const position = action.payload;
        return {
          ...state,
          cursors: updateCursor(state.cursors, action.peerId, position),
        };
      }
  
      case "START_DRAWING": {
        const { drawingId, color, stroke, properties } = action.payload;
        const newDrawing: Drawing = {
          id: drawingId,
          peerId: action.peerId,
          color,
          stroke,
          properties,
        };
        return {
          ...state,
          activeDrawings: addOrUpdateDrawing(state.activeDrawings, newDrawing),
        };
      }
  
      case "ADD_DRAWING_POINT": {
        const { drawingId, point } = action.payload;
        const drawing = state.activeDrawings[drawingId];
  
        if (!drawing) {
          // Drawing not found, ignore action or handle error
          return state;
        }
        if (drawing.properties.type !== 'freehand') {
          // Points can only be added to freehand drawings
          return state;
        }
  
        const updatedDrawing: Drawing = {
          ...drawing,
          properties: {
            ...drawing.properties,
            points: [...drawing.properties.points, point],
          } as FreehandShapeProperties,
        };
  
        return {
          ...state,
          activeDrawings: addOrUpdateDrawing(
            state.activeDrawings,
            updatedDrawing
          ),
        };
      }
  
      case "UPDATE_DRAWING": {
        const { drawingId, properties } = action.payload;
        const drawing = state.activeDrawings[drawingId];
  
        if (!drawing) {
          // Drawing not found, ignore action or handle error
          return state;
        }
  
        const updatedDrawing: Drawing = {
          ...drawing,
          properties: {
            ...drawing.properties,
            ...properties,
          } as ShapeProperties,
        };
  
        return {
          ...state,
          activeDrawings: addOrUpdateDrawing(
            state.activeDrawings,
            updatedDrawing
          ),
        };
      }
  
      case "STOP_DRAWING": {
        const { drawingId } = action.payload;
        const drawing = state.activeDrawings[drawingId];
  
        if (!drawing) {
          // Drawing not found, ignore action or handle error
          return state;
        }
  
        // Move the drawing from active to completed
        return {
          ...state,
          activeDrawings: removeDrawing(state.activeDrawings, drawingId),
          completedDrawings: addOrUpdateDrawing(
            state.completedDrawings,
            drawing
          ),
        };
      }
  
      case "RESET_STATE": {
        return initialState;
      }
  
      default:
        return state;
    }
  }
  