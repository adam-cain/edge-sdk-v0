import { useEdgeReducerV0, useTurboEdgeV0 } from "@turbo-ing/edge-v0";
<<<<<<< HEAD
import { useEffect, useState, useRef, useCallback } from "react";
import { jamReducer, initialState } from "./reducers/jam";
=======
import { useEffect, useState } from "react";
import { gridReducer, initialState } from "./reducers/grid";
>>>>>>> 1317ad473f60bfe78c25c477ac307be1bc7e5743
import TurboLogo from "./assets/turbo-logo.svg";
import ColorPicker from "./assets/color-picker.svg"
import PingPeers from "./PingPeers";
import RoomModal from "./components/RoomModal";
import stringToColor from "./util/stringToCursor";
import debounce from 'lodash.debounce';

function App() {
  const [name, setName] = useState("");
  const [roomIdCommitted, setRoomIdCommitted] = useState("");
<<<<<<< HEAD
  const [isModalOpen, setIsModalOpen] = useState(true)

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  const boardRef = useRef<HTMLDivElement>(null)

  const [state, dispatch, connected] = useEdgeReducerV0(
    jamReducer,
=======
  const [color, setColor] = useState("#000");

  const [state, dispatch, connected] = useEdgeReducerV0(
    gridReducer,
>>>>>>> 1317ad473f60bfe78c25c477ac307be1bc7e5743
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
        type: "SET_USER_NAME",
        payload: {
          name,
        },
      });
    }
  }, [name, connected, roomIdCommitted]);

<<<<<<< HEAD
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

        setCursorPos({ x: relativeX, y: relativeY });
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
=======
  const handleColourPickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value)
  }

  const handleCellClick = (x: number, y: number) => {
    if (color !== null) {
      dispatch({
        type: "UPDATE_CELL",
        payload: {
          x,
          y,
          value: color,
        },
      });
    }
  };
>>>>>>> 1317ad473f60bfe78c25c477ac307be1bc7e5743

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
<<<<<<< HEAD
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
=======
              <div className="text-white text-4xl font-bold">GRID</div>
            </div>

            <div className="text-center text-white text-lg">
              100% P2P collaborative grid, zero servers
            </div>
            <div className="text-center text-white text-lg font-bold">
              Powered by Turbo Edge
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <input
              className="p-2 px-3 rounded w-full"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!turboEdge}
            ></input>
          </div>

          <div className="flex gap-3">
            <input
              className="p-2 px-3 rounded w-full border-none border-0"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={!turboEdge}
            ></input>
>>>>>>> 1317ad473f60bfe78c25c477ac307be1bc7e5743
            <button
              onClick={() => setIsModalOpen(true)}
              className=" text-white border rounded px-4 py-2 hover:shadow-inner transition my-auto"
            >New Room</button>
          </div>

<<<<<<< HEAD
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
=======
          <div className="text-sm text-white mt-1">
            <i>
              Hint: Enter any Room ID; they're all public. Just share the correct one with your friend.
            </i>
          </div>

          {roomIdCommitted &&
            (connected ? (
              <div className="bg-white rounded w-full mt-4">
                <div className="border-b border-gray-400 font-bold py-3 px-4 justify-between flex align-middle">
                  <div>Room ID: {roomIdCommitted}</div>
                  <div className="flex h-6">
                    <input type="color" value={color} onChange={handleColourPickerChange} autoFocus
                      className=" cursor-pointer rounded-l-lg border border-gray-400 h-6" />
                    <div className=" border rounded-r-lg border-gray-400">
                      <img src={ColorPicker} width={18} alt="Color Picker" className=" m-0.5 "></img>
>>>>>>> 1317ad473f60bfe78c25c477ac307be1bc7e5743
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-lg text-background-color mt-4">Connecting...</div>
              ))}
          </div>

<<<<<<< HEAD
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
=======
                <div className=" p-4 overflow-auto xl:px-24 2xl:px-48">
                  <div className="grid grid-cols-10 gap-0 aspect-square">
                    {state.grid.map((row, x) =>
                      row.map((cell, y) => (
                        <div
                          key={`${x}-${y}`}
                          className=" flex items-center justify-center cursor-pointer border"
                          style={{ backgroundColor: cell.value || "#FFF" }}
                          onClick={() => handleCellClick(x, y)}
                          title={`Updated by: ${cell.updatedBy || "N/A"}`}
                        ></div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-800 px-4">
                  <div className="truncate">
                    Peer ID: {turboEdge?.node.peerId.toString()}
                  </div>
                  <div className="mt-0.5">
                    Status: {turboEdge?.node.status}
                  </div>
                  <div className="mt-0.5 flex flex-col gap-0.5">
                    <PingPeers
                      roomId={roomIdCommitted}
                      names={{}} // Adjusted as needed
                    ></PingPeers>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-lg text-white mt-4">Connecting...</div>
            ))}
>>>>>>> 1317ad473f60bfe78c25c477ac307be1bc7e5743
        </div>
      </div>

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
