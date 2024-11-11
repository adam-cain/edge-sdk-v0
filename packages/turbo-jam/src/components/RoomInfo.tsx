import { useState } from "react";
import PingPeers from "../PingPeers";
import Info from "../assets/info-circle.svg"

interface InfoProps {
    peerId: string;
    status: string;
    roomId: string;
    names: { [peerId: string]: string };
}

const RoomInfo = ({ peerId, status, roomId, names }: InfoProps) => {
    const [showInfo, setShowInfo] = useState<boolean>(false)
    return (<>
        <div className="z-[60] absolute size-8 right-4 bottom-4 rounded-full border bg-white cursor-pointer p-1"
            onClick={() => setShowInfo(!showInfo)}
        >
            <img src={Info} alt="room info" />
        </div>
        {showInfo ?
            <div className="z-50 absolute right-14 bottom-4 border bg-white flex flex-col p-2 rounded text-xs">
                <div className="">
                    Status: {status}
                </div>
                <div className="mt-0.5">
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
            </div> : null}
    </>
    );
};

export default RoomInfo;
