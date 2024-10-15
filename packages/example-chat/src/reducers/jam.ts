import { EdgeAction } from "@turbo-ing/edge-v0";

export type CursorPosition = {
  x: number;
  y: number;
  peerId: string;
};

export type DrawingPoint = {
  x: number;
  y: number;
};

export type Drawing = {
  peerId: string;
  points: DrawingPoint[];
};

export interface JamState {
  cursors: CursorPosition[];
  names: { [peerId: string]: string };
  drawings: Drawing[];
}

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
  payload: {
    x: number;
    y: number;
  };
}

interface StartDrawingAction extends BaseJamAction {
  type: "START_DRAWING";
}

interface AddDrawingPointAction extends BaseJamAction {
  type: "ADD_DRAWING_POINT";
  payload: DrawingPoint;
}

interface StopDrawingAction extends BaseJamAction {
  type: "STOP_DRAWING";
}

interface ResetStateAction extends BaseJamAction {
  type: "RESET_STATE";
}

export type JamAction =
  | SetRecipientNameAction
  | UpdateCursorAction
  | StartDrawingAction
  | AddDrawingPointAction
  | StopDrawingAction
  | ResetStateAction;

export const initialState: JamState = {
  cursors: [],
  names: {},
  drawings: [],
};

export function jamReducer(state: JamState = initialState, action: JamAction): JamState {
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
      const { x, y } = action.payload;
      const existingCursorIndex = state.cursors.findIndex(
        (cursor) => cursor.peerId === action.peerId
      );

      if (existingCursorIndex !== -1) {
        // Update existing cursor
        const updatedCursors = [...state.cursors];
        updatedCursors[existingCursorIndex] = {
          ...updatedCursors[existingCursorIndex],
          x,
          y,
        };
        return {
          ...state,
          cursors: updatedCursors,
        };
      } else {
        return {
          ...state,
          cursors: [
            ...state.cursors,
            {
              peerId: action.peerId,
              x,
              y,
            },
          ],
        };
      }
    }
    case "START_DRAWING": {
      return {
        ...state,
        drawings: [
          {
            peerId: action.peerId,
            points: [],
          },
          ...state.drawings,
        ],
      };
    }
    case "ADD_DRAWING_POINT": {
      const { x, y } = action.payload;
      const drawingIndex = state.drawings.findIndex(
        (drawing) => drawing.peerId === action.peerId
      );

      if (drawingIndex !== -1) {
        const updatedDrawings = [...state.drawings];
        updatedDrawings[drawingIndex] = {
          ...updatedDrawings[drawingIndex],
          points: [...updatedDrawings[drawingIndex].points, { x, y }],
        };
        return {
          ...state,
          drawings: updatedDrawings,
        };
      } else {
        return state;
      }
    }
    case "STOP_DRAWING": {
      // Remove the drawing if it has no points
      const drawingIndex = state.drawings.findIndex(
        (drawing) => drawing.peerId === action.peerId
      );
      if (drawingIndex !== -1) {
        const drawing = state.drawings[drawingIndex];
        if (drawing.points.length === 0) {
          // Remove empty drawing
          const updatedDrawings = state.drawings.filter(
            (_, index) => index !== drawingIndex
          );
          return {
            ...state,
            drawings: updatedDrawings,
          };
        }
      }
      return state;
    }
    case "RESET_STATE": {
      return initialState;
    }
    default:
      return state;
  }
}
