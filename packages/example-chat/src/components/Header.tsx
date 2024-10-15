import TurboLogo from "../assets/turbo-logo.svg";

const Header = ({ onNewRoom }: { onNewRoom: () => void }) => (
    <div className="container mx-auto mb-5 flex justify-between pt-4">
        <div className="flex items-center justify-center mb-2">
            <div>
                <img src={TurboLogo} width={190} alt="Turbo Logo" />
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
            onClick={onNewRoom}
            className="text-white border rounded px-4 py-2 hover:shadow-inner transition my-auto"
            aria-label="Create a new room"
        >
            New Room
        </button>
    </div>
);

export default Header