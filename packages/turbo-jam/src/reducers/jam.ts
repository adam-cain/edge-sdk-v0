import { updateCursor, addOrUpdateDrawing, removeDrawing } from "../util/reducerUtil"
import { Drawing, JamState } from '../types/state';
import { JamAction } from '../types/actions';
import { FreehandShapeProperties, Point, ShapeProperties } from "../types";
import { resizeDrawing } from "../util/shapes";

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
    case "SET_NAME": {
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
      const { drawingId, color, strokeColor, strokeWidth, properties } = action.payload;
      const newDrawing: Drawing = {
        id: drawingId,
        peerId: action.peerId,
        color,
        strokeColor,
        strokeWidth,
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

    case "UPDATE_DRAWING_PROPERTIES": {
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

      console.log("Updating drawing", drawingId)

      return {
        ...state,
        activeDrawings: addOrUpdateDrawing(
          state.activeDrawings,
          updatedDrawing),
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

    case "DELETE_DRAWING": {
      const { drawingId } = action.payload;

      // Remove the drawing from completedDrawings
      const { [drawingId]: deletedCompletedDrawing, ...updatedCompletedDrawings } = state.completedDrawings;

      if (!deletedCompletedDrawing) {
        // Drawing not found, ignore action or handle error
        return state;
      }

      return {
        ...state,
        completedDrawings: updatedCompletedDrawings,
      };
    }

    case "MOVE_COMPLETED_DRAWING": {
      const { drawingId, deltaX, deltaY } = action.payload;

      // Retrieve the drawing by its ID
      const drawing = state.completedDrawings[drawingId];
      if (!drawing) return state; // If the drawing does not exist, return the current state

      const { properties } = drawing;

      // Update the drawing based on its type
      let updatedProperties;

      switch (properties.type) {
        case "rectangle":
        case "circle":
        case "line":
          updatedProperties = {
            ...properties,
            startPoint: {
              x: properties.startPoint.x + deltaX,
              y: properties.startPoint.y + deltaY,
            },
            endPoint: {
              x: properties.endPoint.x + deltaX,
              y: properties.endPoint.y + deltaY,
            },
          };
          break;

        case "text":
          updatedProperties = {
            ...properties,
            position: {
              x: properties.position.x + deltaX,
              y: properties.position.y + deltaY,
            },
          };
          break;

        case "freehand":
          updatedProperties = {
            ...properties,
            points: properties.points.map((point: Point) => ({
              x: point.x + deltaX,
              y: point.y + deltaY,
            })),
          };
          break;

        default:
          return state;
      }

      const updatedDrawing = {
        ...state.completedDrawings[drawingId],
        ...drawing,
        properties: updatedProperties,
      };

      return {
        ...state,
        completedDrawings: {
          ...Object.fromEntries(
            Object.entries(state.completedDrawings).filter(([key]) => key !== drawingId)
          ),
          [drawingId]: updatedDrawing,
        },
      };
    }

    case "RESIZE_DRAWING": {
      const { drawingId, deltaX, deltaY, scale, resizeDirection } = action.payload;
      const updatedDrawing = resizeDrawing(state.completedDrawings[drawingId], resizeDirection, { x: deltaX, y: deltaY }, scale)
      if (!updatedDrawing) return state

      return {
        ...state,
        completedDrawings: {
          ...state.completedDrawings,
          [drawingId]: updatedDrawing
        }
      }
    }

    case "UPDATE_DRAWING_APPEARANCE": {
      const { drawingId, color, strokeColor, strokeWidth } = action.payload

      const drawing = state.completedDrawings[drawingId];
      if (!drawing) return state;
    
      const updatedDrawing = {
        ...drawing,
        color,
        strokeColor,
        strokeWidth,
      };
    
      return {
        ...state,
        completedDrawings: {
          ...state.completedDrawings,
          [drawingId]: updatedDrawing,
        },
      };
    }

    case "RESET_STATE": {
      return initialState;
    }
    default:
      return state;
  }
}
