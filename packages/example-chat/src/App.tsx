import { useEffect, useState, useRef, useCallback } from "react";
import { useEdgeReducerV0, useTurboEdgeV0 } from "@turbo-ing/edge-v0";
import { jamReducer, initialState, JamState, JamAction, Drawing } from "./reducers/jam";
import RoomModal from "./components/RoomModal";
import stringToColor from "./util/stringToCursor";
// import debounce from "lodash.debounce";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Board from "./components/Board";

function App() {
  const [name, setName] = useState("");
  const [roomIdCommitted, setRoomIdCommitted] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const drawingsRef = useRef<Drawing[]>(initialState.drawings);

  const [state, dispatch, connected] = useEdgeReducerV0<
    JamState,
    JamAction
  >(jamReducer, initialState, {
    topic: roomIdCommitted,
    onPayload: (state) => console.log("onPayload:", state),
    onReset: (state) => console.log("onReset:", state),
    // onDispatch: (state) => console.log("onDispatch:", state),
  });

  const turboEdge = useTurboEdgeV0();

  useEffect(() => {
    drawingsRef.current = state.drawings;
  }, [state.drawings]);

  // Responsive Canvas Sizing
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const board = boardRef.current;
    if (canvas && board) {
      canvas.width = board.clientWidth;
      canvas.height = board.clientHeight;
    }
  }, [canvasRef.current, boardRef.current]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  // Handle name submission
  useEffect(() => {
    if (connected && turboEdge?.node.peerId) {
      dispatch({
        type: "SET_RECIPIENT_NAME",
        payload: {
          name,
        },
        peerId: turboEdge.node.peerId.toString(),
      });
    }
  }, [name, connected, roomIdCommitted, dispatch, turboEdge?.node.peerId]);

  // Debounced cursor dispatch (100ms delay)
  // const debouncedDispatchCursor = useCallback(
  //   debounce((x: number, y: number, peerId: string) => {
  //     dispatch({
  //       type: "UPDATE_CURSOR",
  //       payload: { x, y },
  //       peerId,
  //     });
  //   }, 100),
  //   [dispatch]
  // );

  // Handle mouse and touch events
  useEffect(() => {
    if (!turboEdge?.node.peerId) return;
    const currentPeerId = turboEdge.node.peerId.toString();

    const handleMove = (x: number, y: number) => {
      // debouncedDispatchCursor(x, y, currentPeerId);


      dispatch({
        type: "UPDATE_CURSOR",
        payload: { x, y },
        peerId: currentPeerId,
      });

      if (isDrawing) {
        dispatch({
          type: "ADD_DRAWING_POINT",
          payload: { x, y },
          peerId: currentPeerId,
        });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const rect = boardRef.current?.getBoundingClientRect();

      if (
        rect &&
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        const relativeX = clientX - rect.left;
        const relativeY = clientY - rect.top;
        handleMove(relativeX, relativeY);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      const { clientX, clientY } = touch;
      const rect = boardRef.current?.getBoundingClientRect();

      if (
        rect &&
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        const relativeX = clientX - rect.left;
        const relativeY = clientY - rect.top;
        handleMove(relativeX, relativeY);
      }
    };

    const handleMouseDown = () => {
      setIsDrawing(true);
      dispatch({
        type: "START_DRAWING",
        peerId: currentPeerId,
      });
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      dispatch({
        type: "STOP_DRAWING",
        peerId: currentPeerId,
      });
    };

    const handleTouchStart = () => {
      setIsDrawing(true);
      dispatch({
        type: "START_DRAWING",
        peerId: currentPeerId,
      });
    };

    const handleTouchEnd = () => {
      setIsDrawing(false);
      dispatch({
        type: "STOP_DRAWING",
        peerId: currentPeerId,
      });
    };

    const divElement = boardRef.current;
    if (divElement) {
      divElement.addEventListener("mousemove", handleMouseMove);
      divElement.addEventListener("mousedown", handleMouseDown);
      divElement.addEventListener("mouseup", handleMouseUp);
      divElement.addEventListener("mouseleave", handleMouseUp);

      // Touch events
      divElement.addEventListener("touchmove", handleTouchMove);
      divElement.addEventListener("touchstart", handleTouchStart);
      divElement.addEventListener("touchend", handleTouchEnd);
      divElement.addEventListener("touchcancel", handleTouchEnd);
    }

    return () => {
      if (divElement) {
        divElement.removeEventListener("mousemove", handleMouseMove);
        divElement.removeEventListener("mousedown", handleMouseDown);
        divElement.removeEventListener("mouseup", handleMouseUp);
        divElement.removeEventListener("mouseleave", handleMouseUp);

        // Touch events
        divElement.removeEventListener("touchmove", handleTouchMove);
        divElement.removeEventListener("touchstart", handleTouchStart);
        divElement.removeEventListener("touchend", handleTouchEnd);
        divElement.removeEventListener("touchcancel", handleTouchEnd);
      }
      // debouncedDispatchCursor.cancel();
    };
    // }, [debouncedDispatchCursor, isDrawing, dispatch, turboEdge?.node.peerId]);
  }, [isDrawing, dispatch, turboEdge?.node.peerId]);

  // Canvas Rendering Optimization with requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Access the latest drawings from the ref
      const drawings = drawingsRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawings.forEach((drawing) => {
        if (drawing.points.length < 2) return;
        ctx.beginPath();
        drawing.points.forEach((point, index) => {
          const canvasX = point.x;
          const canvasY = point.y;
          if (index === 0) {
            ctx.moveTo(canvasX, canvasY);
          } else {
            ctx.lineTo(canvasX, canvasY);
          }
        });
        ctx.strokeStyle = stringToColor(drawing.peerId);
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render(); // Start the rendering loop

    return () => {
      cancelAnimationFrame(animationFrameId); // Correctly cancel the animation frame using the ID
    };
  }, []);;

  // Reset state on disconnect
  useEffect(() => {
    if (!connected && turboEdge?.node.peerId) {
      dispatch({
        type: "RESET_STATE",
        peerId: turboEdge.node.peerId.toString(),
      });
      setIsDrawing(false);
    }
  }, [connected, dispatch, turboEdge?.node.peerId]);

  return (
    <>
      <div className="mx-auto h-screen flex flex-col">
        {/* Header */}
        <Header onNewRoom={() => setIsModalOpen(true)} />

        {/* Main Body */}
        <div className="flex-grow overflow-hidden bg-gray-100 relative">
          {roomIdCommitted ? (
            connected ? (
              <Board
                boardRef={boardRef}
                canvasRef={canvasRef}
                cursors={state.cursors}
                names={state.names}
                drawings={state.drawings}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xl font-semibold text-background-color">
                Connecting...
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-xl font-semibold text-background-color">
              Please join a room.
            </div>
          )}
        </div>

        {/* Footer */}
        {turboEdge?.node.peerId && (
          <Footer
            peerId={turboEdge.node.peerId.toString()}
            status={turboEdge.node.status}
            roomId={roomIdCommitted}
            names={state.names}
          />
        )}
      </div>

      {/* Room Modal */}
      <RoomModal
        name={name}
        setName={setName}
        setRoomIdCommitted={setRoomIdCommitted}
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default App;
