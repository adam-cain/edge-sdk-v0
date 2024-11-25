import { useState } from "react";

interface RoomModalProps {
    name: string; // The name entered by the user
    setName: (name: string) => void; // Function to set the name
    setRoomIdCommitted: (roomId: string) => void; // Function to set the roomId in the parent component
    isOpen: boolean; // Boolean to determine if the modal is visible
    closeModal: () => void; // Function to close the modal
}

function RoomModal({ name, setName, setRoomIdCommitted, isOpen, closeModal }: RoomModalProps) {
    const [localRoomId, setLocalRoomId] = useState("");
    const [step, setStep] = useState<"choose" | "join" | "create">("choose");
    const [createdRoomId, setCreatedRoomId] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);

    if (!isOpen) return null;

    const handleCreateRoom = () => {
        const newRoomId = Math.random().toString(36).substr(2, 9); // Generate a random room ID
        setCreatedRoomId(newRoomId);
        setStep("create");
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset the copy success message after 2 seconds
        });
    };

    const currentDomain = typeof window !== "undefined" ? window.location.origin : "";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-lg p-6 w-96 gap-3 flex flex-col">
                {/* Title and Exit Button */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {step === "choose" ? "Choose an Option" : step === "join" ? "Join a Room" : "Room Created"}
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={closeModal}
                        aria-label="Close modal"
                    >
                        &#10005; {/* X symbol */}
                    </button>
                </div>


                {step === "choose" && (
                    <>
                        {/* Input for name */}
                        <div className="mb-2">
                            <input
                                className="p-2 px-3 rounded w-full border focus:ring-gray-500 focus:outline-none focus:ring-2"
                                placeholder="Enter Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)} // Set name in parent component
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                className="text-black border rounded px-4 py-2 hover:shadow-inner transition"
                                onClick={() => setStep("join")}
                            // Disabled if no name selected, handled through Anonymous as default name
                            // disabled={!name.trim()}
                            >
                                Join a Room
                            </button>
                            <button
                                className="text-black border rounded px-4 py-2 hover:shadow-inner transition"
                                onClick={handleCreateRoom}
                            // disabled={!name.trim()}
                            >
                                Create a Room
                            </button>
                        </div>
                    </>
                )}

                {step === "join" && (
                    <>
                        {/* Input for room ID */}
                        <div className="">
                            <input
                                className="p-2 px-3 rounded w-full border focus:ring-gray-500 focus:outline-none focus:ring-2"
                                placeholder="Enter Room ID"
                                value={localRoomId}
                                onChange={(e) => setLocalRoomId(e.target.value)}
                            />
                            <div className=" text-sm text-black mt-1">
                                <i>
                                    Hint: Enter any Room ID; they're all public. Just share the correct one with your friend.
                                </i>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                className="text-black border rounded px-4 py-2 hover:shadow-inner transition"
                                onClick={() => {
                                    setStep("choose");
                                    setLocalRoomId("");
                                }}
                            >
                                Back
                            </button>
                            <button
                                className="text-black border rounded px-4 py-2 hover:shadow-inner transition"
                                onClick={() => {
                                    setRoomIdCommitted(localRoomId);
                                    setLocalRoomId("");
                                    setStep("choose");
                                    closeModal();
                                }}
                                disabled={!localRoomId.trim()}
                            >
                                Join
                            </button>
                        </div>
                    </>
                )}

                {step === "create" && (
                    <>
                        <div className="text-center">
                            <p className="text-lg">Your Room ID: <span className="text-lg font-bold">{createdRoomId}</span>
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-sm mb-0.5">
                                Click this link to copy and share it with others:
                            </p>

                            <p
                                className="text-blue-500 break-all cursor-pointer hover:underline"
                                onClick={() => handleCopyToClipboard(`${currentDomain}/#/room/${createdRoomId}`)}
                            >
                                {`${currentDomain}/#/room/${createdRoomId}`}
                            </p>
                            {copySuccess && <p className="text-green-500 text-sm mt-2">Copied to clipboard!</p>}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                className="text-black border rounded px-4 py-2 hover:shadow-inner transition"
                                onClick={() => {
                                    setRoomIdCommitted(createdRoomId);
                                    closeModal();
                                    setCreatedRoomId("");
                                    setStep("choose");
                                }}
                            >
                                Done
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default RoomModal;
