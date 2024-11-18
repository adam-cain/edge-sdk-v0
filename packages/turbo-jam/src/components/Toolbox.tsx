import { useEffect, useState, useRef } from "react";
import ColorPicker from "./ColorPicker";
import { ToolType } from "../types";
import { toolTypes } from "../types/enums";
import { useBrushSettings } from "../providers/BrushSettingsProvider";
import {
  CircleIcon,
  SquareIcon,
  FreeDrawIcon,
  LineDrawIcon,
  TextIcon,
  CollapseIcon,
} from "./Icons";
import { CursorIcon } from "./Icons";
import React from "react";

const toolIcons: Record<ToolType, JSX.Element> = {
  select: <CursorIcon width={20} height={20}/>,
  freehand: <LineDrawIcon width={20} height={20} />,
  rectangle: <SquareIcon width={20} height={20} />,
  circle: <CircleIcon width={20} height={20} />,
  line: <FreeDrawIcon width={20} height={20} />,
  text: <TextIcon width={20} height={20} />,
};

const Toolbox = () => {
  const { brushSettings, dispatch } = useBrushSettings();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [height, setHeight] = useState("auto");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch({ type: "SET_COLOR", color: brushSettings.color });
  }, [brushSettings.color, dispatch]);

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

  const handleToolChange = (type: ToolType) => {
    dispatch({ type: "SET_TOOL_TYPE", toolType: type });
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

  return (
    <div className="z-[9999] absolute right-2 top-2 border bg-white rounded w-24">
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ height }}
        ref={contentRef}
      >
        {/* Fill Color Component */}
        <div className="flex flex-col p-2 items-center text-xs gap-2">
          <div className="w-full flex flex-col items-center gap-0.5">
            <span>Fill</span>
            <ColorPicker
              color={brushSettings.color}
              updateColor={handleColorChange}
            />
          </div>
          {/* Stroke Color Component */}
          <div className="w-full flex flex-col items-center gap-0.5">
            <span>Stroke</span>
            <ColorPicker
              color={brushSettings.strokeColor}
              updateColor={handleStrokeColorChange}
            />
          </div>
          {/* Width Selector Component */}
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
          {/* Tool Selection Component */}
          <div className="w-full flex flex-col items-center gap-0.5">
            <label htmlFor="shapeType">Tool</label>
            <div id="shapeType" className="grid grid-flow-row grid-cols-2 gap-1">
              {toolTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleToolChange(type as ToolType)}
                  className={`p-2 rounded aspect-square flex items-center justify-center ${brushSettings.toolType === type
                    ? "bg-background-color text-white"
                    : "bg-gray-200 text-black"
                    }`}
                  title={type}
                >
                  {toolIcons[type as ToolType]}
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
