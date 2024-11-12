import Bin from "../assets/bin.svg";

interface ColorPickerProps {
  color: string;
  updateColor: (data: string) => void;
}

const ColorPicker = ({ color, updateColor }:ColorPickerProps) => {

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateColor(e.target.value);
  };

  const handleRemoveColor = () => {
    updateColor("rgba(0, 0, 0, 0)")
  }

  return (
    <div className="relative inline-block">
      {/* Hidden Functional Element */}
      <input
        id="colorPicker"
        type="color"
        value={color}
        onChange={handlePickerChange}
        className="
          rounded-full
          aspect-square
          w-16
          h-16
          border-none
          appearance-none
          cursor-pointer
          outline-none
          opacity-0
          bg-transparent
        "
      />
      {/* Overlay Element */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          transform
          -translate-x-1/2
          -translate-y-1/2
          w-16
          h-16
          rounded-full
          pointer-events-none
          shadow-inner
          border
        "
        style={{ backgroundColor: color }}
      />
      {/* Transparent Symbol */}
      {color === "rgba(0, 0, 0, 0)" ?  <div
        className="
          absolute
          top-1/2
          left-1/2
          transform
          -translate-x-1/2
          -translate-y-1/2
          -rotate-45
          w-16
          h-0.5
          bg-red-600
          pointer-events-none
          
        "
      /> : null}
      {/* Reset Color Button */}
      <div
        onClick={handleRemoveColor}
        className="
            absolute
            size-6
            bottom-0
            right-0
            bg-white
            shadow-inner
            rounded-full
            border
            p-1
            cursor-pointer
            "
      >
        <img src={Bin}></img>
      </div>
    </div>
  );
};

export default ColorPicker;
