// BrushSettingsContext.tsx
import React, { createContext, useContext, useState } from "react";
import stringToColor from "../util/stringToCursor";
import { BrushSettings } from "../types"

interface BrushSettingsContextType {
  brushSettings: BrushSettings;
  setBrushSettings: React.Dispatch<React.SetStateAction<BrushSettings>>;
}

// Create the context
const BrushSettingsContext = createContext<BrushSettingsContextType | undefined>(undefined);

// Custom hook to use the BrushSettings context
export const useBrushSettings = () => {
  const context = useContext(BrushSettingsContext);
  if (!context) {
    throw new Error("useBrushSettings must be used within a BrushSettingsProvider");
  }
  return context;
};

// Provider component
interface BrushSettingsProviderProps {
  children: React.ReactNode;
  currentPeerId: string;
}

export const BrushSettingsProvider: React.FC<BrushSettingsProviderProps> = ({
  children,
  currentPeerId,
}) => {
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    color: stringToColor(currentPeerId),
    strokeWidth: 5,
    shapeType: "freehand",
  });

  return (
    <BrushSettingsContext.Provider value={{ brushSettings, setBrushSettings }}>
      {children}
    </BrushSettingsContext.Provider>
  );
};
