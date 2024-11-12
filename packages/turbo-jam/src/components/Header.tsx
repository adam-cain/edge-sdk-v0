import TurboLogo from "../assets/turbo-logo.svg";

const Header = ({ onNewRoom }: { onNewRoom: () => void }) => (
    <div className="container px-1 mx-auto my-2 flex justify-between">
        <div className="flex items-center justify-center">
            <div>
                <img src={TurboLogo} width={150} alt="Turbo Logo" />
            </div>
            <div className="text-white text-3xl font-bold">JAM</div>
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