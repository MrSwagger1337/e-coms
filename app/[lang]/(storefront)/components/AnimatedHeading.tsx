"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedHeadingProps {
  title: string
  className?: string
  lang?: "en" | "ar"
}

export function AnimatedHeading({ title, className, lang }: AnimatedHeadingProps) {
  const isRtl = lang === "ar"
  const words = title.split(" ")
  const lastWord = words.pop()
  const restOfTitle = words.join(" ")

  return (
    <h2 className={cn("text-4xl font-extrabold tracking-tight mb-5 relative", className)}>
      <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {restOfTitle}{" "}
      </motion.span>
      <span className="relative inline-block">
        <motion.span
          className="relative z-10 text-white px-4 py-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {lastWord}
        </motion.span>
        <motion.span
          className="absolute inset-0 bg-pink-500 transform skew-x-12"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        ></motion.span>
        <motion.span
          className={`absolute ${isRtl ? "-right-2 -left-2" : "-left-2 -right-2"} h-1/2 bg-pink-600 top-full`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        ></motion.span>
      </span>
    </h2>
  )
}

