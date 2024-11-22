import Mockup from "../assets/Holding-Hand-Smart-Phone-Mockup.png";
// import ExternalLink from "../assets/external-link.svg"
import { ExternalLinkIcon } from "./Icons";

export default function LandingPage() {
    return (
      <div className="relative h-screen text-xl font-semibold text-black">
        {/* CurvedSection as the background */}
        <CurvedSection className="absolute inset-0 bg-background-color -z-1 h-[35%]" />
  
        {/* Flex container for content */}
        <div className="absolute top-0 z-10 flex size-full flex-row-reverse tall:flex-col">
          {/* Image Section */}
          <div className="shrink-0 my-auto ml-auto tall:my-4">
            <img
              src={Mockup}
              alt=""
              className="w-[200px] sm:w-[280px] md:w-[290px] lg:w-[400px] xl:w-[550px] -z-1"
            />
          </div>
  
          {/* Text Content */}
          <div className="flex flex-col flex-1 px-6 text-left xl:items-center z-10 h-full wide:justify-center align-middle  items-center order-2">
            <div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold mb-4">
                <span>Introducing</span>
                <br />
                <span>Turbo Jam</span>
              </h1>
              <section className="font-light md:text-2xl mb-2">
                A collaborative whiteboard built with{" "}
                <span className="">
                  <a
                    href="https://turbo.ing"
                    className="bg-stone-900 text-white italic font-semibold p-1 hover:bg-background-color rounded"
                  >
                    <span>Turbo
                    <ExternalLinkIcon
                      width={15}
                      height={15}
                      className="inline stroke-white ml-0.5 mb-3"
                    />
                    </span>
                  </a>
                </span>
              </section>
              <div className="flex flex-row justify-between">
                <ul className="font-medium space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Free
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Millisecond Fast
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    P2P
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

const CurvedSection = ({ className }: { className: string }) => {
    return (
        <section className={`relative w-full ${className}`}>
            {/* Curve design */}
            <div className="absolute bottom-0 w-full h-[20%] bg-gray-50 rounded-t-[60%_100%] translate-y-1"></div>
        </section>
    );
};
