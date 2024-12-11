import Image from "next/image";
import Link from "next/link";
import all from "@/public/all.jpeg";
import men from "@/public/men.jpeg";
import women from "@/public/women.jpeg";

import mainpic from "@/public/main-pic.png";

export function LandingHeader() {
  return (
    <div className="py-12 my-20 sm:py-32 w-full  flex-col flex md:flex-row h-[600px]">
      <div className="w-full md:w-1/2 pb-11 flex flex-col items-center justify-center">
        <h1 className="md:text-8xl text-6xl font-semibold -ml-20">Discover</h1>
        <h1 className="md:text-8xl text-5xl font-bold ml-20 text-[#ED008C]">
          Wonders
        </h1>
        <h1 className="text-4xl md:text-6xl font-semibold -ml-20">
          You will fall in
        </h1>
        <h1 className="text-5xl md:text-8xl font-bold ml-28 text-[#ED008C]">
          Love <text className="text-black">With!</text>
        </h1>
      </div>
      <div className="w-1/2 hidden  md:flex justify-center items-center flex-col">
        <span className="w-[42vh] z-10 absolute h-[52vh] drop-shadow-md border rounded-3xl shadow-lg shadow-[#c5c5c5]" />
        <img src="./header_img.png" alt="Main Image" className="z-20" />
      </div>
    </div>
  );
}
