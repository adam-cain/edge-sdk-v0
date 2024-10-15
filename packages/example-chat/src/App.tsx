import { useEdgeReducerV0, useTurboEdgeV0 } from "@turbo-ing/edge-v0";
import { useEffect, useState, useRef, useCallback } from "react";
import { jamReducer, initialState } from "./reducers/jam";
import TurboLogo from "./assets/turbo-logo.svg";
import PingPeers from "./PingPeers";
import RoomModal from "./components/RoomModal";
import Cursor from "./components/Cursor";
import stringToColor from "./util/stringToCursor";
import debounce from 'lodash.debounce';

function App() {
  const [name, setName] = useState("");
  const [roomIdCommitted, setRoomIdCommitted] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);  // Track whether the user is drawing

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const [state, dispatch, connected] = useEdgeReducerV0(
    jamReducer,
    initialState,
    {
      topic: roomIdCommitted,
      onPayload: (state) => console.log('onPayload:', state),
      onReset: (state) => console.log('onReset:', state),
    }
  );

  const turboEdge = useTurboEdgeV0();

  useEffect(() => {
    if (connected) {
      dispatch({
        type: "SET_RECIPIENT_NAME",
        payload: {
          name,
        },
      });
    }
  }, [name, connected, roomIdCommitted]);

  const debouncedDispatchCursor = useCallback(
    debounce((x: number, y: number) => {
      dispatch({
        type: "UPDATE_CURSOR",
        payload: { x, y },
      });
    }, 1), // 100ms delay
    [dispatch]
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX: x, clientY: y } = event;
      const rect = boardRef.current?.getBoundingClientRect();

      if (rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const relativeX = x - centerX;
        const relativeY = y - centerY;

        debouncedDispatchCursor(relativeX, relativeY);

        if (isDrawing) {
          // Dispatch drawing point while mouse is moving and drawing is active
          dispatch({
            type: 'ADD_DRAWING_POINT',
            payload: { x: relativeX, y: relativeY },
          });
        }
      }
    };

    const handleMouseDown = () => {
      setIsDrawing(true);  // Start drawing
      dispatch({
        type: 'START_DRAWING',
      });
    };

    const handleMouseUp = () => {
      setIsDrawing(false);  // Stop drawing
      dispatch({
        type: 'STOP_DRAWING',
      });
    };

    const divElement = boardRef.current;
    if (divElement) {
      divElement.addEventListener('mousemove', handleMouseMove);
      divElement.addEventListener('mousedown', handleMouseDown);
      divElement.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (divElement) {
        divElement.removeEventListener('mousemove', handleMouseMove);
        divElement.removeEventListener('mousedown', handleMouseDown);
        divElement.removeEventListener('mouseup', handleMouseUp);
      }
      debouncedDispatchCursor.cancel();
    };
  }, [debouncedDispatchCursor, isDrawing, dispatch, turboEdge?.node.peerId]);

  // Render drawings on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    // Iterate through each peer's drawings and render them
    state.drawings.forEach(drawing => {
      ctx.beginPath();
      drawing.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(canvas.width / 2 + point.x, canvas.height / 2 + point.y);
        } else {
          ctx.lineTo(canvas.width / 2 + point.x, canvas.height / 2 + point.y);
        }
      });
      ctx.strokeStyle = stringToColor(drawing.peerId);  // Color based on peerId
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [state.drawings]);

  return (
    <>
      <div className="mx-auto h-screen">
        <div className="flex flex-col justify-center h-screen">
          {/* Header */}
          <div className="container mx-auto mb-5 flex justify-between pt-4">
            <div className="flex items-center justify-center mb-2">
              <div>
                <img src={TurboLogo} width={190} alt="Turbo Logo"></img>
              </div>
              <div className="text-white text-4xl font-bold">JAM</div>
            </div>
            <div>
              <div className="text-center text-white text-lg">
                100% P2P jam board, zero servers
              </div>
              <div className="text-center text-white text-lg font-bold">
                Powered by Turbo Edge
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className=" text-white border rounded px-4 py-2 hover:shadow-inner transition my-auto"
            >New Room</button>
          </div>

          {/* Main Body */}
          <div className="flex-grow overflow-auto bg-white">
            {roomIdCommitted &&
              (connected ? (
                <div
                  className="bg-white size-full overflow-hidden"
                  ref={boardRef}
                  style={{ position: 'relative', width: '100%', height: '100%' }} 
                >
                  {/* Canvas for drawings */}
                  <canvas
                    ref={canvasRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                  ></canvas>

                  {state.cursors.map((cursor, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `calc(50% + ${cursor.x}px)`,
                        top: `calc(50% + ${cursor.y}px)`,
                        pointerEvents: 'none',
                        width: '30px',
                        height: '30px',
                      }}
                    >
                      <Cursor color={stringToColor(cursor.peerId)} size={30}/>
                      <span>{state.names[cursor.peerId] || cursor.peerId}</span>
                    </div>
                  ))}
                </div>) : (
                  <div className="text-lg text-background-color mt-4">Connecting...</div>
              ))}
            </div>

        {/* Footer */}
            <div className="container mx-auto mt-4 text-xs text-gray-200 flex-none pb-2">
              <div className="truncate">
                Peer ID: {turboEdge?.node.peerId.toString()}
              </div>
              <div className="mt-0.5">
                Status: {turboEdge?.node.status}
              </div>
              <div className="mt-0.5 flex flex-col gap-0.5">
                <PingPeers
                  roomId={roomIdCommitted}
                  names={state.names}
                ></PingPeers>
              </div>
            </div>
          </div>
        </div >

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
