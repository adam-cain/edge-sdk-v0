import { useState, useEffect } from "react";
import ColorPicker from "./ColorPicker";
import { ShapeType, BrushSettings } from "../types";

interface ToolboxProps {
  onSettingsChange: (settings: BrushSettings) => void;
  initialColor: string;
}

const Toolbox = ({ onSettingsChange, initialColor }: ToolboxProps) => {
  // Initialize state
  const [color, setColor] = useState<string>(initialColor);
  const [strokeColor, setStrokeColor] = useState<string>("#00000000");
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const [shapeType, setShapeType] = useState<ShapeType>("freehand");

  // Handle color change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onSettingsChange({ color: newColor, strokeWidth, shapeType });
  };

  // Handle stroke width change
  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStrokeWidth = parseInt(e.target.value, 10);
    setStrokeWidth(newStrokeWidth);
    onSettingsChange({ color, strokeWidth: newStrokeWidth, shapeType });
  };

  // Handle shape type change
  const handleShapeTypeChange = (type: ShapeType) => {
    setShapeType(type);
    onSettingsChange({ color, strokeWidth, shapeType: type });
  };

  // Sync initial color on mount
  useEffect(() => {
    setColor(initialColor);
    onSettingsChange({ color: initialColor, strokeWidth, shapeType });
  }, [initialColor]);

  return (
    <div className="z-50 absolute right-4 top-4 border bg-white flex flex-col p-2 items-center rounded w-32 gap-2">
        Fill Color
    <ColorPicker color={color} updateColor={setColor} ></ColorPicker>
        Stroke Color
    <ColorPicker color={strokeColor} updateColor={setStrokeColor}></ColorPicker>

      {/* Stroke Width Selector */}
      <label htmlFor="strokeWidth">Width</label>
      <div className="flex flex-row gap-0.5 justify-between max-w-full w-full">
        <input
          id="strokeWidth"
          type="range"
          min="1"
          max="32"
          value={strokeWidth}
          onChange={handleStrokeWidthChange}
          className="flex-shrink-0 max-w-16"
        />
        <span className="whitespace-nowrap select-none">{`${strokeWidth}pt`}</span>
      </div>

      <label htmlFor="shapeType">Shape</label>
      <div id="shapeType" className="grid grid-flow-row grid-cols-2 gap-1">
        {["freehand", "rectangle", "circle", "line", "text"].map((type) => (
          <button
            key={type}
            onClick={() => handleShapeTypeChange(type as ShapeType)}
            className={`p-3 rounded aspect-square ${
              shapeType === type
                ? " bg-background-color text-white"
                : "bg-gray-200"
            }`}
            title={type.charAt(0).toUpperCase() + type.slice(1)}
          >
            {/* Prefer icons fro each type here */}
            {type.charAt(0).toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbox;
