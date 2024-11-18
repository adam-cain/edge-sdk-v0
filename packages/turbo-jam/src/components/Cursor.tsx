import React from "react";
import stringToColor from "../util/stringToCursor";
import { CursorIcon } from "./Icons";

interface CursorProps {
    x: number;
    y: number;
    name: string;
    peerId: string;
}


const Cursor = React.memo(({ x, y, name, peerId }: CursorProps) => (
    <div
      className="absolute z-[100] pointer-events-none w-[30px] h-[30px] transform -translate-x-1/2 -translate-y-1/2 select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <CursorIcon fillColor={stringToColor(peerId)} width={30} height={30} strokeWidth={0.4} strokeColor="white" className={`fill-white `}/>
      <span
        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-black bg-opacity-60 text-white px-1 py-[2px] rounded text-xs pointer-events-none z-[100] select-none"
      >
        {name}
      </span>
    </div>
  ));
  

export default Cursor;
