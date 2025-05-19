"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDictionary, type Dictionary } from "@/app/[lang]/dictionaries";

export function LandingHeader({ lang }: { lang: "en" | "ar" }) {
  const [dict, setDict] = useState<Dictionary | null>(null);
  const isRtl = lang === "ar";

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    loadDictionary();
  }, [lang]);

  if (!dict) return null;

  return (
    <div className="py-12 md:max-w-3xl lg:max-w-6xl my-20 sm:py-32 w-full flex flex-col md:flex-row h-auto md:h-[600px]">
      <motion.div
        className={`w-full md:w-1/2 pb-11 flex flex-col text-center justify-center item-center`}
        initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className={`text-3xl md:text-4xl font-semibold  `}
        >
          {dict.landing.discover}
        </h1>
        <span
          className={`block mt-2 text-2xl md:text-4xl -mx-5 font-bold text-[#ED008C] `}
        >
          {dict.landing.wonders}
        </span>
        <h2
          className={`text-2xl md:text-3xl font-semibold text-center mx-6 mt-4`}
        >
          {dict.landing.youWill}
          <span className="block mt-2 text-3xl md:text-3xl font-bold">
            <span className="text-[#ED008C]">{dict.landing.fallInLove}</span>{" "}
            {dict.landing.with}
          </span>
        </h2>
      </motion.div>
      <motion.div
        className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0"
        initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative w-[80vw] h-[50vh] md:w-[42vh] md:h-[52vh]">
          <div className="absolute inset-0  rounded-3xl shadow-lg shadow-[#c5c5c5] transform rotate-3"></div>
          <img
            src="https://i.ibb.co/Dgv89hkX/header-img.png"
            alt="Main Image"
            className="rounded-3xl z-10 object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}
