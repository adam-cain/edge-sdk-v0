import React, { createContext, useContext, useReducer } from "react";
import stringToColor from "../util/stringToCursor";
import { BrushSettings, ToolType } from "../types";

interface BrushSettingsContextType {
  brushSettings: BrushSettings;
  dispatchBrushSettings: React.Dispatch<BrushSettingsAction>;
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
  | { type: "SET_TOOL_TYPE"; toolType: ToolType };

// Reducer function
const brushSettingsReducer = (state: BrushSettings, action: BrushSettingsAction): BrushSettings => {
  switch (action.type) {
    case "SET_COLOR":
      return { ...state, color: action.color };
    case "SET_STROKE_COLOR":
      return { ...state, strokeColor: action.strokeColor };
    case "SET_STROKE_WIDTH":
      return { ...state, strokeWidth: action.strokeWidth };
    case "SET_TOOL_TYPE":
      return { ...state, toolType: action.toolType };
    default:
      return state;
  }
};

export const BrushSettingsProvider: React.FC<BrushSettingsProviderProps> = ({
  children,
  currentPeerId,
}) => {
  const [brushSettings, dispatchBrushSettings] = useReducer(brushSettingsReducer, {
    color: stringToColor(currentPeerId),
    strokeColor: "rgba(0, 0, 0, 0)",
    strokeWidth: 5,
    toolType: "freehand",
  });

  return (
    <BrushSettingsContext.Provider value={{ brushSettings, dispatchBrushSettings }}>
      {children}
    </BrushSettingsContext.Provider>
  );
};