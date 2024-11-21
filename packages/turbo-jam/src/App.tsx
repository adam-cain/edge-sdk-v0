import { useEffect, useState, lazy, Suspense } from "react";
import { useEdgeReducerV0, useTurboEdgeV0 } from "@turbo-ing/edge-v0";
import { jamReducer, initialState } from "./reducers/jam";
import { JamState, JamAction } from "./types";
import RoomModal from "./components/RoomModal";
import RoomInfo from "./components/RoomInfo";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";

const Board = lazy(() => import("./components/Board"));

function App() {
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [currentView, setCurrentView] = useState("landing"); // landing | room

  const [state, dispatch, connected] = useEdgeReducerV0<JamState, JamAction>(
    jamReducer,
    initialState,
    {
      topic: roomId,
      onPayload: (state) => console.log("onPayload:", state),
      onReset: (state) => console.log("onReset:", state),
    }
  );

  const turboEdge = useTurboEdgeV0();
  const currentPeerId = turboEdge?.node.peerId?.toString() || "";

  // Handle route changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/";
      if (hash.startsWith("#/room/")) {
        setIsModalOpen(false)
        const roomIdFromHash = hash.split("/")[2];
        setRoomId(roomIdFromHash);
        setCurrentView("room");
      } else {
        setCurrentView("landing");
        setRoomId("");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Set initial route
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Handle name submission
  useEffect(() => {
    if (connected && turboEdge?.node.peerId) {
      dispatch({
        type: "SET_NAME",
        payload: { name },
        peerId: turboEdge.node.peerId.toString(),
      });
    }
  }, [name, connected, roomId, dispatch, turboEdge?.node.peerId]);

  // Reset state on disconnect
  useEffect(() => {
    if (!connected && turboEdge?.node.peerId) {
      dispatch({
        type: "RESET_STATE",
        peerId: turboEdge.node.peerId.toString(),
      });
    }
  }, [connected, dispatch, turboEdge?.node.peerId]);

  // Navigate to a new route
  const navigate = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <>
      <div className="mx-auto h-screen flex flex-col ">
        {/* Header */}
        <Header onRoomClick={() => setIsModalOpen(true)} onLanding={currentView === "landing"} />

        {/* Main Body */}
        <div className="flex-grow overflow-hidden bg-gray-50 relative">
          {currentView === "landing" ? (
            <LandingPage></LandingPage>
          ) : currentView === "room" ? (
            connected ? (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full text-xl font-semibold text-background-color">
                    Loading Board...
                  </div>
                }
              >
                <Board
                  dispatch={dispatch}
                  state={state}
                  currentPeerId={currentPeerId}
                />
                {turboEdge?.node.peerId && (
                  <RoomInfo
                    peerId={turboEdge.node.peerId.toString()}
                    status={turboEdge.node.status}
                    roomId={roomId}
                    names={state.names}
                  />
                )}
              </Suspense>
            ) : (
              <div className="flex items-center justify-center h-full text-xl font-semibold text-background-color">
                Connecting...
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* Room Modal */}
      <RoomModal
        name={name}
        setName={setName}
        setRoomIdCommitted={(newRoomId) => {
          setRoomId(newRoomId);
          navigate(`#/room/${newRoomId}`);
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default App;
