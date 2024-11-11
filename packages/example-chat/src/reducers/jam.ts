import {updateCursor, addOrUpdateDrawing, removeDrawing} from "../util/reducerUtil"
import { Drawing, JamState } from '../types/state';
import { JamAction } from '../types/actions';
import { FreehandShapeProperties, ShapeProperties } from "../types";

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
  