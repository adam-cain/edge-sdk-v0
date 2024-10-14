import { useEdgeReducerV0, useTurboEdgeV0 } from "@turbo-ing/edge-v0";
import { useEffect, useState, useRef, useCallback } from "react";
import { jamReducer, initialState } from "./reducers/jam";
import TurboLogo from "./assets/turbo-logo.svg";
import PingPeers from "./PingPeers";
import RoomModal from "./components/RoomModal";
import stringToColor from "./util/stringToCursor";
import debounce from 'lodash.debounce';

function App() {
  const [name, setName] = useState("");
  const [roomIdCommitted, setRoomIdCommitted] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true)

  const boardRef = useRef<HTMLDivElement>(null)

  const [state, dispatch, connected] = useEdgeReducerV0(
    jamReducer,
    initialState,
    {
      topic: roomIdCommitted,
      // onDispatch: (action) => console.log('onDispatch:', action),
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
      const rect = boardRef.current?.getBoundingClientRect(); // Get the bounding box of the div

      if (rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;

        debouncedDispatchCursor(relativeX, relativeY);
      }
    };

    const divElement = boardRef.current;
    if (divElement) {
      divElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (divElement) {
        divElement.removeEventListener('mousemove', handleMouseMove);
      }
      debouncedDispatchCursor.cancel();
    };
  }, [debouncedDispatchCursor]);

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
                  className="bg-white size-full"
                  ref={boardRef}
                  style={{ position: 'relative', width: '100%', height: '100%' }} // Added styles
                >
                  {state.cursors.map((cursor, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: cursor.x,
                        top: cursor.y,
                        pointerEvents: 'none',
                        backgroundColor: stringToColor(cursor.peerId),
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                      }}
                    >
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
