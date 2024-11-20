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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-lg p-6 w-96 gap-3 flex flex-col">
                <h2 className="text-xl font-bold">Join a Room</h2>

                {/* Input for name */}
                <div className="">
                    <input
                        className="p-2 px-3 rounded w-full border focus:ring-gray-500 focus:outline-none focus:ring-2"
                        placeholder="Enter Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} // Set name in parent component
                    />
                </div>

                {/* Input for room ID */}
                <div className="">
                    <input
                        className="p-2 px-3 rounded w-full border focus:ring-gray-500 focus:outline-none focus:ring-2"
                        placeholder="Enter Room ID"
                        value={localRoomId}
                        onChange={(e) => setLocalRoomId(e.target.value)}
                    />
                    <div className="text-sm text-black mt-1">
                    <i>
                        Hint: Enter any Room ID; they're all public. Just share the
                        correct one with your friend.
                    </i>
                </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        className="text-black border rounded px-4 py-2 hover:shadow-inner transition hover:text-background-color"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="text-black border rounded px-4 py-2 hover:shadow-inner transition"
                        onClick={() => {
                            setRoomIdCommitted(localRoomId);
                            closeModal();
                            setLocalRoomId("")
                        }}
                    >
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoomModal;
