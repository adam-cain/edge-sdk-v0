import PingPeers from "../PingPeers";

// Footer Component
const Footer = ({
    peerId,
    status,
    roomId,
    names,
}: {
    peerId: string;
    status: string;
    roomId: string;
    names: { [peerId: string]: string };
}) => (
    <div className="container mx-auto mt-4 text-xs text-gray-200 flex-none pb-2">
        <div className="mt-0.5">
            Status: {status}
        </div>
        <div className="truncate">
            Peer ID: {peerId}
        </div>
        {roomId &&
            <div className="mt-0.5">
                Room ID: {roomId}
            </div>
        }
        <div className="mt-0.5 flex flex-col gap-0.5">
            <PingPeers roomId={roomId} names={names} />
        </div>
    </div>
);

export default Footer