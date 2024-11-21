import TurboLogo from "../assets/turbo-logo.svg";

interface HeaderProps {
    onRoomClick: () => void,
    onLanding: boolean
}


const Header = ({ onRoomClick, onLanding }: HeaderProps) => (
    <div className="container px-1 mx-auto my-2 flex justify-between text-white">
        <div className="flex items-center justify-center">
            <img src={TurboLogo} width={150} alt="Turbo Logo" />
            <span className="text-3xl font-extralight">JAM</span>
        </div>
        <button
            onClick={onRoomClick}
            className={`border rounded px-3 hover:bg-white hover:text-background-color transition text-white font-medium
            ${onLanding ?
                    "bg-blue-500 border-none"
                    :
                    "border-1 border-white"}    
                `}
            aria-label="Join a room"
        >
            {onLanding ? "Get Started" : "New Room"}
        </button>
    </div>
);

export default Header