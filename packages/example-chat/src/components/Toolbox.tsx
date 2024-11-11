import { useEffect } from "react";
import ColorPicker from "./ColorPicker";
import { ShapeType } from "../types";
import { useBrushSettings } from "../providers/BrushSettingsProvider";

const Toolbox = () => {
  const { brushSettings, dispatch } = useBrushSettings();

  // Sync initial color on mount (optional if you want to keep initial color sync)
  useEffect(() => {
    dispatch({ type: "SET_COLOR", color: brushSettings.color });
  }, [brushSettings.color]);

  // Handle color change
  const handleColorChange = (newColor: string) => {
    dispatch({ type: "SET_COLOR", color: newColor });
  };

  // Handle stroke color change
  const handleStrokeColorChange = (newStrokeColor: string) => {
    dispatch({ type: "SET_STROKE_COLOR", strokeColor: newStrokeColor });
  };

  // Handle stroke width change
  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStrokeWidth = parseInt(e.target.value, 10);
    dispatch({ type: "SET_STROKE_WIDTH", strokeWidth: newStrokeWidth });
  };

  // Handle shape type change
  const handleShapeTypeChange = (type: ShapeType) => {
    dispatch({ type: "SET_SHAPE_TYPE", shapeType: type });
  };

  return (
    <div className="z-50 absolute right-4 top-4 border bg-white flex flex-col p-2 items-center rounded w-32 gap-2">
      Fill Color
      <ColorPicker color={brushSettings.color} updateColor={handleColorChange} />

      Stroke Color
      <ColorPicker color={brushSettings.strokeColor} updateColor={handleStrokeColorChange} />

      {/* Stroke Width Selector */}
      <label htmlFor="strokeWidth">Width</label>
      <div className="flex flex-row gap-0.5 justify-between max-w-full w-full">
        <input
          id="strokeWidth"
          type="range"
          min="1"
          max="32"
          value={brushSettings.strokeWidth}
          onChange={handleStrokeWidthChange}
          className="flex-shrink-0 max-w-16"
        />
        <span className="whitespace-nowrap select-none">{`${brushSettings.strokeWidth}pt`}</span>
      </div>

      <label htmlFor="shapeType">Shape</label>
      <div id="shapeType" className="grid grid-flow-row grid-cols-2 gap-1">
        {["freehand", "rectangle", "circle", "line", "text"].map((type) => (
          <button
            key={type}
            onClick={() => handleShapeTypeChange(type as ShapeType)}
            className={`p-3 rounded aspect-square ${
              brushSettings.shapeType === type
                ? "bg-background-color text-white"
                : "bg-gray-200"
            }`}
            title={type.charAt(0).toUpperCase() + type.slice(1)}
          >
            {type.charAt(0).toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbox;
