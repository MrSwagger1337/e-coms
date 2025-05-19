"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/context/LanguageContext";

export function LandingHeader() {
  const { dictionary, isRtl } = useLanguage();
  if (!dictionary) return null;

  return (
    <div className="container mx-auto flex flex-col-reverse md:flex-row items-center py-12 sm:py-24 lg:py-32">
      {/* Text Column */}
      <motion.div
        className={`
          w-full md:w-1/2 flex flex-col
          items-center md:items-${isRtl ? "end" : "end"}
          text-center md:text-left
        `}
        initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className={`
            font-semibold mb-4
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
            ${isRtl ? "rtl" : ""}
          `}
        >
          {dictionary.landing.discover}
        </h1>

        <span
          className={`
            block font-bold text-[#ED008C]
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            mb-2
            ${isRtl ? "rtl" : ""}
          `}
        >
          {dictionary.landing.wonders}
        </span>

        <h2
          className={`
            font-semibold mt-4
            text-xl sm:text-2xl md:text-3xl lg:text-4xl
            ${isRtl ? "rtl" : ""}
          `}
        >
          {dictionary.landing.youWill}
          <span className="block mt-2 font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="text-[#ED008C]">
              {dictionary.landing.fallInLove}
            </span>{" "}
            {dictionary.landing.with}
          </span>
        </h2>
      </motion.div>

      {/* Image Column */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0"
        initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-48 sm:h-64 md:h-80 lg:h-[520px]">
          <div className="absolute inset-0 bg-white rounded-3xl shadow-lg shadow-[#c5c5c5] transform rotate-3" />
          <Image
            src="/header_img.png"
            alt="Main"
            fill
            className="rounded-3xl object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}
