import { useState, useEffect } from "react";

interface ToolboxProps {
    onSettingsChange: (settings: BrushSettings) => void;
    initialColor: string
}

export interface BrushSettings {
    color: string;
    strokeWidth: number;
}

const Toolbox = ({ onSettingsChange, initialColor }: ToolboxProps) => {
    // Local state to manage brush settings within the toolbox
    const [color, setColor] = useState<string>("#000000");
    const [strokeWidth, setStrokeWidth] = useState<number>(5);

    // Handle color change
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setColor(newColor);
        onSettingsChange({ color: newColor, strokeWidth });
    };

    // Handle stroke width change
    const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStrokeWidth = parseInt(e.target.value, 10);
        setStrokeWidth(newStrokeWidth);
        onSettingsChange({ color, strokeWidth: newStrokeWidth });
    };

    useEffect(() => {
        setColor(initialColor)
    }, [])

    return (
        <div className="z-50 absolute right-4 top-4 border bg-white flex flex-col p-2 items-center rounded w-28 gap-2">
            {/* Color Picker */}
            <label htmlFor="colorPicker">Color </label>
            <input
                id="colorPicker"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="rounded-full aspect-square size-16"
                style={{
                    backgroundColor: color,  // Set the background color to reflect selected color
                    border: "none",
                    appearance: "none",  // Remove the default color picker appearance
                    cursor: "pointer",   // Add pointer cursor for better UX
                    outline: "none"
                }}
            />

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
                    className=" flex-shrink-0 max-w-16"
                />
                <span className="whitespace-nowrap select-none">{`${strokeWidth}pt`}</span>
            </div>
        </div>
    );
};

export default Toolbox;
