import { CursorPosition, Drawing } from "../reducers/jam";
import Cursor from "./Cursor";
import DrawingCanvas from "./DrawingCanvas";

const Board = ({
    boardRef,
    canvasRef,
    cursors,
    names,
    drawings,
  }: {
    boardRef: React.RefObject<HTMLDivElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    cursors: CursorPosition[];
    names: { [peerId: string]: string };
    drawings: Drawing[];
  }) => (
    <div
      className="bg-white size-full overflow-hidden"
      ref={boardRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
      aria-label="Collaborative drawing board"
    >
      {/* Canvas for drawings */}
      <DrawingCanvas drawings={drawings} canvasRef={canvasRef} />
  
      {/* Render Cursors */}
      {cursors.map((cursor, i) => (
        <Cursor
          key={i}
          cursor={cursor}
          name={names[cursor.peerId] || "Anonymous"}
        />
      ))}
    </div>
  );

export default Board