"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export function LandingHeader() {
  return (
    <div className="py-12 my-20 sm:py-32 w-full flex flex-col md:flex-row h-auto md:h-[600px]">
      <motion.div
        className="w-full md:w-1/2 pb-11 flex flex-col items-center justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl md:text-8xl font-semibold text-center md:text-left -ml-12 mb-4">
          Discover
        </h1>
        <span className="block mt-2 text-5xl md:text-8xl font-bold text-[#ED008C] ml-12">
          Wonders
        </span>
        <h2 className="text-4xl md:text-6xl font-semibold text-center md:text-left mt-4">
          You will fall in
          <span className="block mt-2 text-5xl md:text-8xl font-bold">
            <span className="text-[#ED008C]">Love</span> With!
          </span>
        </h2>
      </motion.div>
      <motion.div
        className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative w-[80vw] h-[50vh] md:w-[42vh] md:h-[52vh]">
          <div className="absolute inset-0 bg-white rounded-3xl shadow-lg shadow-[#c5c5c5] transform rotate-3"></div>
          <Image
            src="/header_img.png"
            alt="Main Image"
            layout="fill"
            objectFit="cover"
            className="rounded-3xl z-10"
          />
        </div>
      </motion.div>
    </div>
  );
}
