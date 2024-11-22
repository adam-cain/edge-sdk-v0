import Mockup from "../assets/Holding-Hand-Smart-Phone-Mockup.png";
import { ExternalLinkIcon } from "./Icons";

export default function LandingPage() {
    return (
        <div className="h-screen text-xl font-semibold relative">
            <CurvedSection className="absolute inset-0 bg-background-color z-1  h-[35%]" />
            {/* Image Section */}
            <div className="absolute right-0 my-auto max-h-[75dvh] max-w-[65vw] z-2">
                <img
                    src={Mockup}
                    alt=""
                    className="max-h-[75dvh]"
                />
            </div>
            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col flex-1 text-left xl:items-center z-3 justify-end xl:justify-center mx-auto xl:mr-[20%] -translate-y-[20%] xl:translate-y-0 px-1 md:px-5">
                <div className="min-h-fit h-fit ">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold mb-4 container">
                        <span>Introducing</span>
                        <br />
                        <span>Turbo Jam</span>
                    </h1>
                    <section className="font-light text-base sm:text-2xl mb-2">
                        A collaborative whiteboard built with{" "}
                        <span className="whitespace-nowrap">
                            <a
                                href="https://turbo.ing"
                                className="bg-stone-900 text-white italic font-semibold p-1 hover:bg-background-color rounded"
                            >
                                Turbo
                                <ExternalLinkIcon
                                    width={15}
                                    height={15}
                                    className="inline stroke-white ml-0.5 mb-3"
                                />
                            </a>
                        </span>
                    </section>
                    <ul className="font-medium space-y-2">
                        <li>
                            <span className="mr-2">✓</span>
                            Free
                        </li>
                        <li>
                            <span className="mr-2">✓</span>
                            Millisecond Fast
                        </li>
                        <li>
                            <span className="mr-2">✓</span>
                            P2P
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}


const CurvedSection = ({ className }: { className: string }) => {
    return (
        <section className={` w-full ${className}`}>
            {/* Curve design */}
            <div className="absolute bottom-0 w-full h-[20%] bg-gray-50 rounded-t-[60%_100%] translate-y-1"></div>
        </section>
    );
};
