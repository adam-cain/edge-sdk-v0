import { useEffect, useState } from "react";
import { useEdgeReducerV0, useTurboEdgeV0 } from "@turbo-ing/edge-v0";
import { jamReducer, initialState } from "./reducers/jam";
import { JamState, JamAction } from "./types"
import RoomModal from "./components/RoomModal";
import Header from "./components/Header";
import Board from "./components/Board";
import RoomInfo from "./components/RoomInfo";

function App() {
  const [name, setName] = useState("");
  const [roomIdCommitted, setRoomIdCommitted] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [state, dispatch, connected] = useEdgeReducerV0<JamState, JamAction>(
    jamReducer,
    initialState,
    {
      topic: roomIdCommitted,
      onPayload: (state) => console.log("onPayload:", state),
      onReset: (state) => console.log("onReset:", state),
    }
  );

  const turboEdge = useTurboEdgeV0();
  const currentPeerId = turboEdge?.node.peerId?.toString() || "";

  // Handle name submission
  useEffect(() => {
    if (connected && turboEdge?.node.peerId) {
      dispatch({
        type: "SET_NAME",
        payload: { name },
        peerId: turboEdge.node.peerId.toString(),
      });
    }
  }, [name, connected, roomIdCommitted, dispatch, turboEdge?.node.peerId]);

  // Reset state on disconnect
  useEffect(() => {
    if (!connected && turboEdge?.node.peerId) {
      dispatch({
        type: "RESET_STATE",
        peerId: turboEdge.node.peerId.toString(),
      });
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
                dispatch={dispatch}
                state={state}
                currentPeerId={currentPeerId}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xl font-semibold text-background-color">
                Connecting...
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-xl font-semibold text-background-color">
              Join a
              <button
                onClick={() => setIsModalOpen(true)}
                className="border rounded px-3 py-1 hover:shadow-inner transition my-auto border-background-color ml-1 mr-0.5"
                aria-label="Join a room"
              >
                Room
              </button>
              .
            </div>
          )}
        </div>


        {turboEdge?.node.peerId && (
          <RoomInfo
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
