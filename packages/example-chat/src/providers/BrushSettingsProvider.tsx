import React, { createContext, useContext, useReducer } from "react";
import stringToColor from "../util/stringToCursor";
import { BrushSettings, ShapeType } from "../types";

interface BrushSettingsContextType {
  brushSettings: BrushSettings;
  dispatch: React.Dispatch<BrushSettingsAction>;
}

const BrushSettingsContext = createContext<BrushSettingsContextType | undefined>(undefined);

export const useBrushSettings = () => {
  const context = useContext(BrushSettingsContext);
  if (!context) {
    throw new Error("useBrushSettings must be used within a BrushSettingsProvider");
  }
  return context;
};

interface BrushSettingsProviderProps {
  children: React.ReactNode;
  currentPeerId: string;
}

// Define actions for the reducer
type BrushSettingsAction =
  | { type: "SET_COLOR"; color: string }
  | { type: "SET_STROKE_COLOR"; strokeColor: string }
  | { type: "SET_STROKE_WIDTH"; strokeWidth: number }
  | { type: "SET_SHAPE_TYPE"; shapeType: ShapeType };

// Reducer function
const brushSettingsReducer = (state: BrushSettings, action: BrushSettingsAction): BrushSettings => {
  switch (action.type) {
    case "SET_COLOR":
      return { ...state, color: action.color };
    case "SET_STROKE_COLOR":
      return { ...state, strokeColor: action.strokeColor };
    case "SET_STROKE_WIDTH":
      return { ...state, strokeWidth: action.strokeWidth };
    case "SET_SHAPE_TYPE":
      return { ...state, shapeType: action.shapeType };
    default:
      return state;
  }
};

export const BrushSettingsProvider: React.FC<BrushSettingsProviderProps> = ({
  children,
  currentPeerId,
}) => {
  const [brushSettings, dispatch] = useReducer(brushSettingsReducer, {
    color: stringToColor(currentPeerId),
    strokeColor: "#00000000",
    strokeWidth: 5,
    shapeType: "freehand",
  });

  return (
    <BrushSettingsContext.Provider value={{ brushSettings, dispatch }}>
      {children}
    </BrushSettingsContext.Provider>
  );
};