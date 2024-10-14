import { EdgeAction } from "@turbo-ing/edge-v0";

export type Message = {
  message: string;
  peerId: string;
};

export type CursorPosition = {
  x: number;
  y: number,
  peerId: string;
};

export interface JamState {
  messages: Message[];
  cursors: CursorPosition[];
  names: { [peerId: string]: string };
}

interface ReceiveMessageAction extends EdgeAction<JamState> {
  type: 'MESSAGE';
  payload: {
    message: string;
  };
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

export type JamAction = ReceiveMessageAction | SetRecipientNameAction | UpdateCursorAction;

export const initialState: JamState = {
  messages: [],
  cursors: [],
  names: {},
};

export function jamReducer(
  state: JamState = initialState,
  action: JamAction
): JamState {
  if (!action.peerId) return state

  switch (action.type) {
    case 'MESSAGE': {
      const { message } = action.payload;

      setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 200)

      return {
        ...state,
        messages: [
          ...state.messages,
          {
            message,
            peerId: action.peerId,
          },
        ],
      };
    }
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
        // Add new cursor
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
    default:
      return state;
  }
}