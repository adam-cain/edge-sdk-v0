interface NameModalProps {
    name: string;
    setName: (name: string) => void; 
    isOpen: boolean;
    closeModal: () => void;
}

function JoinModal({name, setName, isOpen, closeModal }: NameModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-lg p-6 w-96 gap-3 flex flex-col">
                {/* Title and Exit Button */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Set Your Name</h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={closeModal}
                        aria-label="Close modal"
                    >
                        &#10005; {/* X symbol */}
                    </button>
                </div>

                {/* Input for name */}
                <div className="">
                    <input
                        className="p-2 px-3 rounded w-full border focus:ring-gray-500 focus:outline-none focus:ring-2"
                        placeholder="Enter Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} // Set name in parent component
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        className="text-black border rounded px-4 py-2 hover:shadow-inner transition"
                        onClick={() => closeModal()}
                        // disabled={!name.trim()}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JoinModal;
