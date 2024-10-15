import { EdgeAction } from "@turbo-ing/edge-v0";

export type CursorPosition = {
  x: number;
  y: number,
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

interface SetRecipientNameAction extends EdgeAction<JamState> {
  type: 'SET_RECIPIENT_NAME';
  payload: {
    name: string;
  };
}

interface UpdateCursorAction extends EdgeAction<JamState> {
  type: 'UPDATE_CURSOR';
  payload: {
    x: number;
    y: number
  };
}

interface StartDrawingAction extends EdgeAction<JamState> {
  type: 'START_DRAWING';
}

interface AddDrawingPointAction extends EdgeAction<JamState> {
  type: 'ADD_DRAWING_POINT';
  payload: DrawingPoint;
}

interface StopDrawingAction extends EdgeAction<JamState> {
  type: 'STOP_DRAWING';
}

export type JamAction = 
  | SetRecipientNameAction 
  | UpdateCursorAction
  | StartDrawingAction
  | AddDrawingPointAction
  | StopDrawingAction;

export const initialState: JamState = {
  cursors: [],
  names: {},
  drawings: []
};

export function jamReducer(
  state: JamState = initialState,
  action: JamAction
): JamState {
  if (!action.peerId) return state

  switch (action.type) {
    case 'SET_RECIPIENT_NAME': {
      const { name } = action.payload;
      return {
        ...state,
        names: {
          ...state.names,
          [action.peerId]: name,
        },
      };
    }
    case 'UPDATE_CURSOR': {
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
    case 'START_DRAWING': {
      // Initialize a new drawing for the peer
      return {
        ...state,
        drawings: [
          ...state.drawings,
          {
            peerId: action.peerId,
            points: [],
          },
        ],
      };
    }
    case 'ADD_DRAWING_POINT': {
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
    case 'STOP_DRAWING': {
      // Optional: logic to stop drawing or finalize a drawing
      return state;
    }
    default:
      return state;
  }
}