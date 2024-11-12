import { useEffect, useState, useRef } from "react";
import ColorPicker from "./ColorPicker";
import { ShapeType } from "../types";
import { useBrushSettings } from "../providers/BrushSettingsProvider";
import {
  CircleIcon,
  SquareIcon,
  FreeDrawIcon,
  LineDrawIcon,
  TextIcon,
  CollapseIcon,
} from "./Icons";
import React from "react";

const Toolbox = () => {
  const { brushSettings, dispatch } = useBrushSettings();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [height, setHeight] = useState("auto");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch({ type: "SET_COLOR", color: brushSettings.color });
  }, [brushSettings.color]);

  const handleColorChange = (newColor: string) => {
    dispatch({ type: "SET_COLOR", color: newColor });
  };

  const handleStrokeColorChange = (newStrokeColor: string) => {
    dispatch({ type: "SET_STROKE_COLOR", strokeColor: newStrokeColor });
  };

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStrokeWidth = parseInt(e.target.value, 10);
    dispatch({ type: "SET_STROKE_WIDTH", strokeWidth: newStrokeWidth });
  };

  const handleShapeTypeChange = (type: ShapeType) => {
    dispatch({ type: "SET_SHAPE_TYPE", shapeType: type });
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Adjust the height when collapsing or expanding
  useEffect(() => {
    if (isCollapsed) {
      setHeight("0px");
    } else {
      const contentHeight = contentRef.current?.scrollHeight;
      setHeight(`${contentHeight}px`);
    }
  }, [isCollapsed]);

  const shapeIcons = {
    freehand: <LineDrawIcon width={20} height={20} />,
    rectangle: <SquareIcon width={20} height={20} />,
    circle: <CircleIcon width={20} height={20} />,
    line: <FreeDrawIcon width={20} height={20} />,
    text: <TextIcon width={20} height={20} />,
  };

  return (
    <div className="z-50 absolute right-2 top-2 border bg-white rounded w-24">
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ height }}
        ref={contentRef}
      >
        <div className="flex flex-col p-2 items-center text-xs gap-2">
          <div className="w-full flex flex-col items-center gap-0.5">
            <span>Fill</span>
            <ColorPicker
              color={brushSettings.color}
              updateColor={handleColorChange}
            />
          </div>

          <div className="w-full flex flex-col items-center gap-0.5">
            <span>Stroke</span>
            <ColorPicker
              color={brushSettings.strokeColor}
              updateColor={handleStrokeColorChange}
            />
          </div>

          <div className="w-full flex flex-col items-center gap-0.5">
            <label htmlFor="strokeWidth">Width</label>
            <div className="flex flex-row gap-0.5 justify-between max-w-full w-full">
              <input
                id="strokeWidth"
                type="range"
                min="1"
                max="32"
                value={brushSettings.strokeWidth}
                onChange={handleStrokeWidthChange}
                className="flex-shrink-0 max-w-12"
              />
              <span className="whitespace-nowrap select-none">{`${brushSettings.strokeWidth}pt`}</span>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-0.5">
            <label htmlFor="shapeType">Tool</label>
            <div id="shapeType" className="grid grid-flow-row grid-cols-2 gap-1">
              {["freehand", "line", "rectangle", "circle", "text"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleShapeTypeChange(type as ShapeType)}
                  className={`p-2 rounded aspect-square flex items-center justify-center ${brushSettings.shapeType === type
                      ? "bg-background-color text-white"
                      : "bg-gray-200 text-black"
                    }`}
                  title={type}
                >
                  {shapeIcons[type as ShapeType]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={toggleCollapse}
        className={`w-full p-2 mx-auto bg-gray-200 text-black text-xs hover:bg-background-color hover:text-white flex justify-center ${isCollapsed ? "hover:rounded" : "hover:rounded-b"}`}
      >
        <CollapseIcon collapsed={isCollapsed} />
      </button>
    </div>
  );
};

export default Toolbox;
